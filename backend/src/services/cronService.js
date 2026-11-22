import cron from 'node-cron';
import { syncLiveFeeds } from './newsService.js';
import { config } from '../config/index.js';

export const initCronJobs = () => {
  console.log(`[Cron] Initializing news sync job with schedule: ${config.cronSchedule}`);

  // Periodic news ingestion cron
  cron.schedule(config.cronSchedule, async () => {
    console.log('[Cron] Running scheduled RSS news sync...');
    try {
      const res = await syncLiveFeeds();
      console.log(`[Cron] News sync complete. Ingested ${res.count || 0} items.`);
    } catch (e) {
      console.error('[Cron] Error during scheduled sync:', e.message);
    }
  });

  // Run once shortly after startup
  setTimeout(async () => {
    console.log('[Startup] Triggering initial news feed verification...');
    try {
      await syncLiveFeeds();
    } catch (e) {
      console.warn('[Startup] Initial news sync completed with notice:', e.message);
    }
  }, 3000);
};
