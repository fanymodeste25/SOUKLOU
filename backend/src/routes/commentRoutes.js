import express from 'express';
import {
  createComment,
  getCommentsBySubmission,
  updateComment,
  deleteComment
} from '../controllers/commentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createComment);
router.get('/submission/:submissionId', authenticate, getCommentsBySubmission);
router.put('/:id', authenticate, updateComment);
router.delete('/:id', authenticate, deleteComment);

export default router;
