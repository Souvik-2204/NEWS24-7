import express from 'express';
import { getBreakingNews, getHeroSlides, triggerSync } from '../controllers/newsController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/breaking', getBreakingNews);
router.get('/hero-slides', getHeroSlides);
router.post('/sync', authenticate, authorizeRoles('Super Admin', 'Chief Editor'), triggerSync);

export default router;
