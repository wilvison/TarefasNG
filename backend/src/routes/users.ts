import express, { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();

// Apply authentication middleware
router.use(authenticateToken);

// Placeholder for user routes
router.get('/', (req, res) => {
  res.json({ message: 'Users endpoint - to be implemented' });
});

export default router;