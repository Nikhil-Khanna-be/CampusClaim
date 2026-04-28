import express from 'express';
import { authUser, registerUser, logoutUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

export default router;
