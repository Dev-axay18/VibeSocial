import express from 'express';
import {
  accessChat,
  getChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All chat routes are protected
router.route('/')
  .post(protect, accessChat)
  .get(protect, getChats);

router.route('/group')
  .post(protect, createGroupChat);

router.route('/group/:id')
  .put(protect, renameGroupChat);

router.route('/group/:id/add')
  .put(protect, addToGroup);

router.route('/group/:id/remove')
  .put(protect, removeFromGroup);

export default router;