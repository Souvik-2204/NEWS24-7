import { getMarketOverview, getIndexHistory, updateMarketData } from '../services/marketService.js';

export const getMarkets = async (req, res) => {
  try {
    const data = await getMarketOverview();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve market data.', error: err.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { indexId } = req.params;
    const { timeframe = '1D' } = req.query;
    const history = await getIndexHistory(indexId, timeframe);

    if (!history) {
      return res.status(404).json({ message: 'Market index not found.' });
    }

    return res.json(history);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve index history.', error: err.message });
  }
};

export const updateMarketConfig = async (req, res) => {
  try {
    const updated = await updateMarketData(req.body);
    return res.json({ message: 'Market data updated.', data: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update market data.', error: err.message });
  }
};
