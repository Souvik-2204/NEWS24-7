import express from 'express';
import { getMarkets, getHistory, updateMarketConfig } from '../controllers/marketController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getMarkets);
router.get('/history/:indexId', getHistory);
router.post('/update', authenticate, authorizeRoles('Super Admin'), updateMarketConfig);

export default router;
