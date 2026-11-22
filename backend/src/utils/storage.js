import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

// Simple in-memory mutex to prevent concurrent file write collisions
const writeLocks = new Map();

/**
 * Reads a JSON file safely from the data directory.
 * If file does not exist, returns fallback default data.
 */
export const readJson = async (filename, defaultValue = []) => {
  const filePath = path.join(config.dataDir, filename);
  try {
    if (!fs.existsSync(filePath)) {
      await writeJson(filename, defaultValue);
      return defaultValue;
    }
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err.message);
    return defaultValue;
  }
};

/**
 * Writes data atomically to a JSON file with temporary file & rename, plus automatic backup.
 */
export const writeJson = async (filename, data) => {
  const filePath = path.join(config.dataDir, filename);
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
    console.error(`Error writing ${filename}:`, err.message);
    throw err;
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
