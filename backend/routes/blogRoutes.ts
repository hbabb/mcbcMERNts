// mcbcMERNts/backend/routes/blogRoutes.ts

import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import * as blogController from '../controllers/blog/blogController';

const router = express.Router();

router.get('/blog', blogController.getAllBlogPosts);
router.get('/blog/:id', blogController.getBlogById);
router.get('/blog/:slug', blogController.getBlogBySlug);

router.post('/blog', authenticate, blogController.createBlogPost);
router.put('/blog/:id', authenticate, blogController.updateBlogPost);
router.delete('/blog/:id', authenticate, blogController.deleteBlogPost);

router.post('/blog/:id/comment', authenticate, blogController.addComment);
router.put(
  '/blog/:id/comment/:commentId',
  authenticate,
  blogController.updateComment,
);
router.delete(
  '/blog/:id/comment/:commentId',
  authenticate,
  blogController.deleteComment,
);

export default router;
