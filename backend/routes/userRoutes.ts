import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import * as userController from '../controllers/user/UserController';

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', authenticate, userController.logoutUser);
router.get('/me', authenticate, userController.getUserProfile);
router.patch('/me', authenticate, userController.updateUserProfile);

// Admin routes
router.get('/all', authenticate, userController.getAllUsers);
router.patch('/role', authenticate, userController.updateUserRole);

export default router;
