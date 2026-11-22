import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', authenticate, authorizeRoles('Super Admin', 'Chief Editor'), createCategory);
router.put('/:id', authenticate, authorizeRoles('Super Admin', 'Chief Editor'), updateCategory);
router.delete('/:id', authenticate, authorizeRoles('Super Admin', 'Chief Editor'), deleteCategory);

export default router;
