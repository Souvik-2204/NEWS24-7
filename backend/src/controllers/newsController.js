import { readJson } from '../utils/storage.js';
import { syncLiveFeeds } from '../services/newsService.js';

export const getBreakingNews = async (req, res) => {
  try {
    const breaking = await readJson('breaking.json', []);
    return res.json(breaking);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve breaking news.', error: err.message });
  }
};

export const getHeroSlides = async (req, res) => {
  try {
    const slides = await readJson('hero_slides.json', []);
    return res.json(slides.filter((s) => s.active !== false));
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve hero slides.', error: err.message });
  }
};

export const triggerSync = async (req, res) => {
  try {
    const result = await syncLiveFeeds();
    return res.json({ message: 'Live RSS synchronization completed.', ...result });
  } catch (err) {
    return res.status(500).json({ message: 'Live news sync failed.', error: err.message });
  }
};
