import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  forgotPasswordDemo,
  toggleBookmark
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPasswordDemo);

// Protected routes
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.post('/bookmarks/:articleId', authenticate, toggleBookmark);

export default router;
