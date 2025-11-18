import express from 'express';
import {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  getTeacherAssignments,
  updateAssignment,
  deleteAssignment
} from '../controllers/assignmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createAssignment);
router.get('/', authenticate, getAllAssignments);
router.get('/my-assignments', authenticate, getTeacherAssignments);
router.get('/:id', authenticate, getAssignmentById);
router.put('/:id', authenticate, updateAssignment);
router.delete('/:id', authenticate, deleteAssignment);

export default router;
