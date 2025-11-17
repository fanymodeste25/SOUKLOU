import express from 'express';
import {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  getUnreadCount
} from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', authenticate, getConversations);
router.post('/conversations', authenticate, createConversation);
router.get('/conversations/:conversationId/messages', authenticate, getMessages);
router.post('/conversations/:conversationId/messages', authenticate, sendMessage);
router.get('/unread-count', authenticate, getUnreadCount);

export default router;
