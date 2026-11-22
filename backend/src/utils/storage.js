import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

// Simple in-memory mutex to prevent concurrent file write collisions
const writeLocks = new Map();
// In-memory cache fallback for serverless environments (like Vercel)
const memoryCache = new Map();

// Determine active data directory (use /tmp on Vercel)
const isVercel = !!process.env.VERCEL;
let activeDataDir = config.dataDir;

if (isVercel) {
  const tmpDataDir = path.join('/tmp', 'news24_data');
  try {
    if (!fs.existsSync(tmpDataDir)) {
      fs.mkdirSync(tmpDataDir, { recursive: true });
      if (fs.existsSync(config.dataDir)) {
        const files = fs.readdirSync(config.dataDir);
        for (const file of files) {
          if (file.endsWith('.json')) {
            fs.copyFileSync(path.join(config.dataDir, file), path.join(tmpDataDir, file));
          }
        }
      }
    }
    activeDataDir = tmpDataDir;
  } catch (err) {
    console.warn('[Vercel /tmp setup notice]:', err.message);
  }
}

/**
 * Reads a JSON file safely from the data directory.
 * If file does not exist, returns fallback default data.
 */
export const readJson = async (filename, defaultValue = []) => {
  if (memoryCache.has(filename)) {
    return memoryCache.get(filename);
  }

  const primaryPath = path.join(activeDataDir, filename);
  const fallbackPath = path.join(config.dataDir, filename);

  try {
    let targetPath = primaryPath;
    if (!fs.existsSync(targetPath)) {
      if (fs.existsSync(fallbackPath)) {
        targetPath = fallbackPath;
      } else {
        await writeJson(filename, defaultValue);
        return defaultValue;
      }
    }
    const data = await fs.promises.readFile(targetPath, 'utf-8');
    const parsed = JSON.parse(data);
    memoryCache.set(filename, parsed);
    return parsed;
  } catch (err) {
    console.error(`Error reading ${filename}:`, err.message);
    if (fs.existsSync(fallbackPath)) {
      try {
        const fbData = JSON.parse(await fs.promises.readFile(fallbackPath, 'utf-8'));
        memoryCache.set(filename, fbData);
        return fbData;
      } catch (fbErr) {
        // Return default
      }
    }
    return defaultValue;
  }
};

/**
 * Writes data atomically to a JSON file with temporary file & rename, plus automatic backup.
 */
export const writeJson = async (filename, data) => {
  // Always update in-memory cache immediately
  memoryCache.set(filename, data);

  const filePath = path.join(activeDataDir, filename);
  const tempPath = `${filePath}.tmp`;
  const backupPath = `${filePath}.bak`;

  // Wait if write lock is held
  while (writeLocks.get(filename)) {
    await new Promise((res) => setTimeout(res, 20));
  }
  writeLocks.set(filename, true);

  try {
    const serialized = JSON.stringify(data, null, 2);
    // Write to temp file
    await fs.promises.writeFile(tempPath, serialized, 'utf-8');

    // Create backup of current file if it exists
    if (fs.existsSync(filePath)) {
      await fs.promises.copyFile(filePath, backupPath).catch(() => {});
    }

    // Atomic rename
    await fs.promises.rename(tempPath, filePath);
    return true;
  } catch (err) {
    console.warn(`Filesystem write notice for ${filename} (cached in memory):`, err.message);
    // Even if disk write fails on read-only environments, in-memory cache holds state
    return true;
  } finally {
    writeLocks.delete(filename);
  }
};

/**
 * Appends an activity log item
 */
export const logActivity = async (action, details = {}, userId = null, role = null) => {
  try {
    const logs = await readJson('activity_logs.json', []);
    const newLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      action,
      details,
      userId,
      role
    };
    logs.unshift(newLog);
    // Keep last 1000 logs
    if (logs.length > 1000) logs.length = 1000;
    await writeJson('activity_logs.json', logs);
  } catch (e) {
    console.error('Failed to write activity log:', e.message);
  }
};
