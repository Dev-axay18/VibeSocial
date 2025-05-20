import express from 'express';
import {
  sendMessage,
  getMessages,
  deleteMessage,
  updateMessageStatus,
  forwardMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All message routes are protected
router.route('/')
  .post(protect, sendMessage);

router.route('/:chatId')
  .get(protect, getMessages);

router.route('/:id')
  .delete(protect, deleteMessage);

router.route('/status/:id')
  .put(protect, updateMessageStatus);

router.route('/forward')
  .post(protect, forwardMessage);

export default router;