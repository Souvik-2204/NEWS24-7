import express from 'express';
import {
  getArticles,
  getArticleBySlugOrId,
  createArticle,
  updateArticle,
  reviewEditorialWorkflow,
  deleteArticle
} from '../controllers/articleController.js';
import { authenticate, optionalAuthenticate, authorizeRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public / Optional Auth routes
router.get('/', optionalAuthenticate, getArticles);
router.get('/:identifier', optionalAuthenticate, getArticleBySlugOrId);

// Upload article image
router.post('/upload-image', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded.' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  return res.json({ imageUrl, message: 'Image uploaded successfully.' });
});

// Protected editorial routes
router.post(
  '/',
  authenticate,
  authorizeRoles('Super Admin', 'Chief Editor', 'Section Editor', 'Author/Journalist'),
  createArticle
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('Super Admin', 'Chief Editor', 'Section Editor', 'Author/Journalist'),
  updateArticle
);

// Editorial review action (Approve / Reject / Publish)
router.post(
  '/:id/review',
  authenticate,
  authorizeRoles('Super Admin', 'Chief Editor', 'Section Editor'),
  reviewEditorialWorkflow
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('Super Admin', 'Chief Editor', 'Author/Journalist'),
  deleteArticle
);

export default router;
