import express from 'express';
import { getAllUsers, getUsersByRole, getUserById } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllUsers);
router.get('/role/:role', authenticate, getUsersByRole);
router.get('/:id', authenticate, getUserById);

export default router;
