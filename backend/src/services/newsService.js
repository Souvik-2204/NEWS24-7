import Parser from 'rss-parser';
import { readJson, writeJson, logActivity } from '../utils/storage.js';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'creator']
    ]
  }
});

// Category-specific high-resolution editorial photography fallbacks
const categoryImages = {
  world: [
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80'
  ],
  india: [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80'
  ],
  politics: [
    'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80'
  ],
  business: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80'
  ],
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80'
  ],
  markets: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80'
  ],
  sports: [
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80'
  ],
  entertainment: [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'
  ],
  science: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80'
  ]
};

// RSS feed endpoints with legitimate topics
const RSS_FEEDS = [
  {
    category: 'india',
    source: 'Google News India',
    url: 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en'
  },
  {
    category: 'world',
    source: 'Google News World',
    url: 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-US&gl=US&ceid=US:en'
  },
  {
    category: 'business',
    source: 'Google News Business',
    url: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en'
  },
  {
    category: 'technology',
    source: 'Google News Tech',
    url: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-US&gl=US&ceid=US:en'
  },
  {
    category: 'sports',
    source: 'Google News Sports',
    url: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN:en'
  },
  {
    category: 'entertainment',
    source: 'Google News Entertainment',
    url: 'https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-IN&gl=IN&ceid=IN:en'
  },
  {
    category: 'science',
    source: 'Google News Science',
    url: 'https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-US&gl=US&ceid=US:en'
  }
];

export const syncLiveFeeds = async () => {
  try {
    const existingArticles = await readJson('articles.json', []);
    const existingLinks = new Set(existingArticles.map((a) => a.originalUrl || a.slug));
    const newlyFetched = [];

    for (const feed of RSS_FEEDS) {
      try {
        const parsed = await parser.parseURL(feed.url);
        const items = (parsed.items || []).slice(0, 4); // Take top 4 from each category to respect rate limits

        for (const item of items) {
          if (!item.title || existingLinks.has(item.link)) continue;

          // Strip HTML tags from summary
          const rawSnippet = item.contentSnippet || item.content || item.summary || '';
          const cleanSnippet = rawSnippet.replace(/<[^>]*>?/gm, '').trim();

          // Pick an image
          const fallbackList = categoryImages[feed.category] || categoryImages.world;
          const randomImage = fallbackList[Math.floor(Math.random() * fallbackList.length)];
          const imageUrl = item.enclosure?.url || item.mediaContent?.$.url || randomImage;

          const articleId = 'rss_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
          const slug = item.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 90) + '-' + Math.random().toString(36).substr(2, 4);

          const newArticle = {
            id: articleId,
            title: item.title,
            slug,
            summary: cleanSnippet.length > 220 ? cleanSnippet.slice(0, 217) + '...' : cleanSnippet,
            content: `<p>${cleanSnippet || item.title}</p><p>This dispatch was curated via ${feed.source}. For in-depth editorial commentary and real-time investigative updates, subscribe to NEWS 24*7.</p>`,
            category: feed.category,
            tags: [feed.category, 'Live News', feed.source.split(' ')[0]],
            author: {
              id: 'rss_wire',
              name: feed.source,
              email: 'wire@news247.global',
              avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=200&q=80',
              role: 'Global News Wire'
            },
            imageUrl,
            accessLevel: 'free',
            status: 'published',
            isFeatured: false,
            isBreaking: false,
            views: Math.floor(Math.random() * 3000) + 500,
            readTime: '3 min read',
            publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
            createdAt: new Date().toISOString(),
            originalUrl: item.link,
            sourceName: feed.source,
            editorialHistory: [
              {
                status: 'published',
                changedBy: 'System Auto-Ingest',
                timestamp: new Date().toISOString(),
                comment: `Ingested from ${feed.source}`
              }
            ]
          };

          newlyFetched.push(newArticle);
          existingLinks.add(item.link);
        }
      } catch (feedErr) {
        // Continue gracefully if a single RSS feed is slow or unreachable
        console.warn(`Feed sync failed for ${feed.category}:`, feedErr.message);
      }
    }

    if (newlyFetched.length > 0) {
      // Keep manual editorial articles at top, append new RSS
      const combined = [...newlyFetched, ...existingArticles];
      // Keep within reasonable size (e.g. 150 articles)
      if (combined.length > 150) combined.length = 150;
      await writeJson('articles.json', combined);
      await logActivity('LIVE_NEWS_SYNC', { count: newlyFetched.length });
    }

    return { success: true, count: newlyFetched.length };
  } catch (err) {
    console.error('Error during news feed synchronization:', err.message);
    return { success: false, error: err.message };
  }
};
