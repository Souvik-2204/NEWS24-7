import { readJson, writeJson, logActivity } from '../utils/storage.js';

export const getDashboardStats = async (req, res) => {
  try {
    const users = await readJson('users.json', []);
    const articles = await readJson('articles.json', []);
    const subscriptions = await readJson('subscriptions.json', []);
    const payments = await readJson('payments.json', []);
    const logs = await readJson('activity_logs.json', []);

    const activeSubs = subscriptions.filter((s) => s.status === 'active');
    const totalRevenue = payments
      .filter((p) => p.status === 'success')
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const publishedArticles = articles.filter((a) => a.status === 'published');
    const pendingArticles = articles.filter((a) => a.status === 'pending');
    const draftArticles = articles.filter((a) => a.status === 'draft');
    const rejectedArticles = articles.filter((a) => a.status === 'rejected');

    const totalViews = articles.reduce((acc, curr) => acc + (curr.views || 0), 0);

    const roleBreakdown = users.reduce((acc, curr) => {
      acc[curr.role] = (acc[curr.role] || 0) + 1;
      return acc;
    }, {});

    const stats = {
      users: {
        total: users.length,
        subscribers: activeSubs.length,
        roleBreakdown
      },
      articles: {
        total: articles.length,
        published: publishedArticles.length,
        pending: pendingArticles.length,
        draft: draftArticles.length,
        rejected: rejectedArticles.length,
        totalViews
      },
      financials: {
        totalRevenue,
        activeSubscriptions: activeSubs.length,
        totalTransactions: payments.length,
        successfulTransactions: payments.filter((p) => p.status === 'success').length,
        failedTransactions: payments.filter((p) => p.status === 'failed').length
      },
      recentLogs: logs.slice(0, 15)
    };

    return res.json(stats);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to compile analytics.', error: err.message });
  }
};

export const getUsersList = async (req, res) => {
  try {
    const users = await readJson('users.json', []);
    const safeUsers = users.map(({ passwordHash, ...rest }) => rest);
    return res.json(safeUsers);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch users.', error: err.message });
  }
};

export const updateUserRoleAndTier = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, tier } = req.body;

    const users = await readJson('users.json', []);
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (role) users[index].role = role;
    if (tier) users[index].tier = tier;

    await writeJson('users.json', users);
    await logActivity('USER_PERMISSIONS_MODIFIED', { targetUserId: id, role, tier }, req.user.id, req.user.role);

    const { passwordHash: _, ...userSafe } = users[index];
    return res.json({ message: 'User permissions updated.', user: userSafe });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update user.', error: err.message });
  }
};

export const getPaymentsAudit = async (req, res) => {
  try {
    const payments = await readJson('payments.json', []);
    return res.json(payments);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch payments.', error: err.message });
  }
};

export const updateHeroSlidesAdmin = async (req, res) => {
  try {
    const { slides } = req.body;
    if (!Array.isArray(slides)) {
      return res.status(400).json({ message: 'Slides array required.' });
    }
    await writeJson('hero_slides.json', slides);
    await logActivity('HERO_SLIDES_UPDATED', { count: slides.length }, req.user.id, req.user.role);
    return res.json({ message: 'Hero background slides updated successfully.', slides });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update hero slides.', error: err.message });
  }
};

export const updateBreakingNewsAdmin = async (req, res) => {
  try {
    const { breaking } = req.body;
    if (!Array.isArray(breaking)) {
      return res.status(400).json({ message: 'Breaking news array required.' });
    }
    await writeJson('breaking.json', breaking);
    await logActivity('BREAKING_NEWS_UPDATED', { count: breaking.length }, req.user.id, req.user.role);
    return res.json({ message: 'Breaking ticker updated successfully.', breaking });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update breaking news.', error: err.message });
  }
};

export const getSettings = async (req, res) => {
  try {
    const settings = await readJson('settings.json', {});
    return res.json(settings);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch settings.', error: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const current = await readJson('settings.json', {});
    const updated = { ...current, ...req.body };
    await writeJson('settings.json', updated);
    await logActivity('SETTINGS_MODIFIED', req.body, req.user.id, req.user.role);
    return res.json({ message: 'Website settings saved.', settings: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update settings.', error: err.message });
  }
};

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await readJson('activity_logs.json', []);
    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch activity logs.', error: err.message });
  }
};
