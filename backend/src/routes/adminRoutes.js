import express from 'express';
import {
  getDashboardStats,
  getUsersList,
  updateUserRoleAndTier,
  getPaymentsAudit,
  updateHeroSlidesAdmin,
  updateBreakingNewsAdmin,
  getSettings,
  updateSettings,
  getActivityLogs
} from '../controllers/adminController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Require editorial or admin role
router.use(authenticate);
router.use(authorizeRoles('Super Admin', 'Chief Editor', 'Section Editor'));

router.get('/stats', getDashboardStats);
router.get('/logs', getActivityLogs);
router.get('/settings', getSettings);

// Super Admin / Chief Editor privileged actions
router.get('/users', authorizeRoles('Super Admin', 'Chief Editor'), getUsersList);
router.put('/users/:id/role', authorizeRoles('Super Admin'), updateUserRoleAndTier);
router.get('/payments', authorizeRoles('Super Admin', 'Chief Editor'), getPaymentsAudit);
router.put('/hero-slides', authorizeRoles('Super Admin', 'Chief Editor'), updateHeroSlidesAdmin);
router.put('/breaking', authorizeRoles('Super Admin', 'Chief Editor'), updateBreakingNewsAdmin);
router.put('/settings', authorizeRoles('Super Admin'), updateSettings);

export default router;
