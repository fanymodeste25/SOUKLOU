import express from 'express';
import {
  createSubmission,
  getSubmissionById,
  getSubmissionsByAssignment,
  getStudentSubmissions,
  updateSubmission,
  deleteSubmission
} from '../controllers/submissionController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createSubmission);
router.get('/my-submissions', authenticate, getStudentSubmissions);
router.get('/assignment/:assignmentId', authenticate, getSubmissionsByAssignment);
router.get('/:id', authenticate, getSubmissionById);
router.put('/:id', authenticate, updateSubmission);
router.delete('/:id', authenticate, deleteSubmission);

export default router;
