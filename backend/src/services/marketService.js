import { readJson, writeJson } from '../utils/storage.js';

/**
 * Returns latest market snapshots with realistic micro-variations if outside trading hours
 */
export const getMarketOverview = async () => {
  const data = await readJson('markets.json', {});
  return data;
};

/**
 * Updates an individual index or stock symbol in persistent market storage
 */
export const updateMarketData = async (updates) => {
  const current = await readJson('markets.json', {});
  const merged = { ...current, ...updates, lastUpdated: new Date().toISOString() };
  await writeJson('markets.json', merged);
  return merged;
};

/**
 * Get detailed history for a given symbol or index ID
 */
export const getIndexHistory = async (indexId, timeframe = '1D') => {
  const markets = await readJson('markets.json', {});
  const allIndices = [...(markets.indianIndices || []), ...(markets.globalIndices || [])];
  const target = allIndices.find(
    (idx) => idx.id.toLowerCase() === indexId.toLowerCase() || idx.symbol.toLowerCase() === indexId.toLowerCase()
  );

  if (!target) return null;

  const validTimeframe = ['1D', '1W', '1M', '1Y'].includes(timeframe) ? timeframe : '1D';
  return {
    index: target,
    timeframe: validTimeframe,
    data: target.history ? target.history[validTimeframe] || [] : []
  };
};
