import { readJson, writeJson, logActivity } from '../utils/storage.js';
import { checkContentAccess } from '../middleware/auth.js';

export const getArticles = async (req, res) => {
  try {
    const { category, search, tag, accessLevel, status, featured, breaking, limit = 50, page = 1 } = req.query;
    let articles = await readJson('articles.json', []);

    // Filter by publication status
    // Public requests (unauthenticated or regular readers) only see 'published'
    const userRole = req.user?.role;
    const isEditorialStaff = ['Super Admin', 'Chief Editor', 'Section Editor', 'Author/Journalist'].includes(userRole);

    if (status) {
      if (isEditorialStaff) {
        articles = articles.filter((a) => a.status === status);
      } else {
        articles = articles.filter((a) => a.status === 'published');
      }
    } else if (!isEditorialStaff) {
      articles = articles.filter((a) => a.status === 'published');
    }

    // Filter by Category
    if (category && category !== 'all') {
      articles = articles.filter((a) => a.category?.toLowerCase() === category.toLowerCase());
    }

    // Filter by Tag
    if (tag) {
      articles = articles.filter((a) => a.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()));
    }

    // Filter by Access Level
    if (accessLevel) {
      articles = articles.filter((a) => a.accessLevel?.toLowerCase() === accessLevel.toLowerCase());
    }

    // Filter by Featured
    if (featured === 'true') {
      articles = articles.filter((a) => a.isFeatured === true);
    }

    // Filter by Breaking
    if (breaking === 'true') {
      articles = articles.filter((a) => a.isBreaking === true);
    }

    // Search query
    if (search) {
      const q = search.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.summary?.toLowerCase().includes(q) ||
          a.author?.name?.toLowerCase().includes(q) ||
          a.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort by publication date descending
    articles.sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));

    const total = articles.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginated = articles.slice(startIndex, startIndex + parseInt(limit));

    return res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      articles: paginated
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve articles.', error: err.message });
  }
};

export const getArticleBySlugOrId = async (req, res) => {
  try {
    const { identifier } = req.params;
    const articles = await readJson('articles.json', []);
    const articleIndex = articles.findIndex((a) => a.id === identifier || a.slug === identifier);

    if (articleIndex === -1) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    const article = articles[articleIndex];

    // Increment view count
    article.views = (article.views || 0) + 1;
    articles[articleIndex] = article;
    await writeJson('articles.json', articles);

    // Check paywall gating
    const userTier = req.user?.tier || 'Free';
    const hasAccess = checkContentAccess(userTier, article.accessLevel || 'free');

    if (!hasAccess && article.accessLevel && article.accessLevel.toLowerCase() !== 'free') {
      // Truncate content for paywall preview
      const previewSlice = article.content
        ? article.content.slice(0, 320) + '...'
        : article.summary;

      return res.json({
        ...article,
        content: previewSlice,
        isGated: true,
        hasAccess: false,
        requiredTier: article.accessLevel,
        userCurrentTier: userTier,
        message: `This investigative story requires a ${article.accessLevel.toUpperCase()} subscription.`
      });
    }

    return res.json({
      ...article,
      isGated: false,
      hasAccess: true
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve article.', error: err.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const {
      title,
      summary,
      content,
      category,
      tags = [],
      imageUrl,
      accessLevel = 'free',
      status = 'pending',
      isFeatured = false,
      isBreaking = false,
      readTime = '5 min read'
    } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required.' });
    }

    const user = req.user;
    const articles = await readJson('articles.json', []);

    // Authors cannot publish directly; their submissions go to 'pending' or 'draft'
    let finalStatus = status;
    if (user.role === 'Author/Journalist') {
      finalStatus = status === 'draft' ? 'draft' : 'pending';
    }

    const slug =
      title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 90) + '-' + Math.random().toString(36).substr(2, 4);

    const newArticle = {
      id: 'art_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      title: title.trim(),
      slug,
      summary: summary || title,
      content,
      category: category.toLowerCase(),
      tags: Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim()),
      author: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
      accessLevel: accessLevel.toLowerCase(),
      status: finalStatus,
      isFeatured: !!isFeatured,
      isBreaking: !!isBreaking,
      views: 0,
      readTime,
      publishedAt: finalStatus === 'published' ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      editorialHistory: [
        {
          status: finalStatus,
          changedBy: `${user.name} (${user.role})`,
          timestamp: new Date().toISOString(),
          comment: finalStatus === 'pending' ? 'Submitted for editorial review' : 'Created'
        }
      ]
    };

    articles.unshift(newArticle);
    await writeJson('articles.json', articles);
    await logActivity('ARTICLE_CREATED', { id: newArticle.id, title: newArticle.title, status: finalStatus }, user.id, user.role);

    return res.status(201).json({
      message: 'Article created successfully.',
      article: newArticle
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create article.', error: err.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const articles = await readJson('articles.json', []);
    const index = articles.findIndex((a) => a.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    const current = articles[index];
    const user = req.user;

    // Authors can only edit their own articles
    if (user.role === 'Author/Journalist' && current.author?.id !== user.id) {
      return res.status(403).json({ message: 'You can only edit your own articles.' });
    }

    const updates = req.body;

    // Authors cannot directly set status to 'published' or 'approved'
    if (user.role === 'Author/Journalist' && (updates.status === 'published' || updates.status === 'approved')) {
      updates.status = 'pending';
    }

    // Set publishedAt if changing to published
    if (updates.status === 'published' && current.status !== 'published') {
      updates.publishedAt = new Date().toISOString();
    }

    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    articles[index] = updated;
    await writeJson('articles.json', articles);
    await logActivity('ARTICLE_UPDATED', { id: current.id, title: current.title }, user.id, user.role);

    return res.json({ message: 'Article updated successfully.', article: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update article.', error: err.message });
  }
};

export const reviewEditorialWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, comment } = req.body; // action: 'approve' | 'reject' | 'publish'
    const user = req.user;

    const allowedRoles = ['Super Admin', 'Chief Editor', 'Section Editor'];
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Only editorial management can review and approve articles.' });
    }

    const articles = await readJson('articles.json', []);
    const index = articles.findIndex((a) => a.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    const target = articles[index];

    // Enforcement: Authors cannot approve their own articles
    if (target.author?.id === user.id) {
      return res.status(403).json({
        message: 'Strict Editorial Policy Violation: Authors cannot approve their own articles.'
      });
    }

    let newStatus = 'approved';
    if (action === 'reject') newStatus = 'rejected';
    if (action === 'publish') newStatus = 'published';

    target.status = newStatus;
    if (newStatus === 'published' && !target.publishedAt) {
      target.publishedAt = new Date().toISOString();
    }

    if (!target.editorialHistory) target.editorialHistory = [];
    target.editorialHistory.push({
      status: newStatus,
      changedBy: `${user.name} (${user.role})`,
      timestamp: new Date().toISOString(),
      comment: comment || `Action '${action}' applied by ${user.role}`
    });

    articles[index] = target;
    await writeJson('articles.json', articles);
    await logActivity('EDITORIAL_REVIEW', { articleId: id, action: newStatus, reviewer: user.name }, user.id, user.role);

    return res.json({
      message: `Article has been ${newStatus}.`,
      article: target
    });
  } catch (err) {
    return res.status(500).json({ message: 'Editorial review failed.', error: err.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const articles = await readJson('articles.json', []);
    const index = articles.findIndex((a) => a.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    const target = articles[index];
    const user = req.user;

    const isHighAdmin = ['Super Admin', 'Chief Editor'].includes(user.role);
    const isOwnerDraft = target.author?.id === user.id && target.status === 'draft';

    if (!isHighAdmin && !isOwnerDraft) {
      return res.status(403).json({ message: 'Permission denied to delete this article.' });
    }

    articles.splice(index, 1);
    await writeJson('articles.json', articles);
    await logActivity('ARTICLE_DELETED', { id, title: target.title }, user.id, user.role);

    return res.json({ message: 'Article deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete article.', error: err.message });
  }
};
