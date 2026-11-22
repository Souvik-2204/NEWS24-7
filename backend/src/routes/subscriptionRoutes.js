import express from 'express';
import {
  getPlans,
  subscribeDemo,
  getMySubscription,
  cancelSubscription
} from '../controllers/subscriptionController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/plans', getPlans);
router.post('/checkout-demo', authenticate, subscribeDemo);
router.get('/my-status', authenticate, getMySubscription);
router.post('/cancel', authenticate, cancelSubscription);

export default router;
