import express, { Router } from 'express';
import { body } from 'express-validator';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByQuadrant
} from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();

// Validation rules
const taskValidation = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('priority')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Priority must be low, medium, high, or critical'),
  body('isImportant')
    .isBoolean()
    .withMessage('isImportant must be a boolean'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
  body('estimatedTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Estimated time must be a positive integer')
];

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Routes
router.post('/', taskValidation, createTask);
router.get('/', getTasks);
router.get('/quadrants', getTasksByQuadrant);
router.get('/:id', getTaskById);
router.put('/:id', taskValidation, updateTask);
router.delete('/:id', deleteTask);

export default router;