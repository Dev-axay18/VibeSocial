import express from 'express';
import { getRandomReels, searchReels } from '../controllers/reelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getRandomReels);
router.get('/search', searchReels);

export default router;
