import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

// Mock data for demonstration
const mockQuadrants = {
  Q1: {
    count: 3,
    tasks: [
      {
        _id: '1',
        title: 'Fix critical production bug',
        description: 'Security vulnerability needs immediate attention',
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
        priority: 'critical',
        isUrgent: true,
        isImportant: true,
        eisenhowerQuadrant: 'Q1',
        status: 'pending',
        createdBy: { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
        tags: ['security', 'production'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '2',
        title: 'Prepare client presentation',
        description: 'Key stakeholder meeting tomorrow',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
        priority: 'high',
        isUrgent: true,
        isImportant: true,
        eisenhowerQuadrant: 'Q1',
        status: 'in_progress',
        createdBy: { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
        tags: ['presentation', 'client'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '3',
        title: 'Server maintenance emergency',
        description: 'Database performance issues affecting users',
        dueDate: new Date().toISOString(), // Today
        priority: 'critical',
        isUrgent: true,
        isImportant: true,
        eisenhowerQuadrant: 'Q1',
        status: 'pending',
        createdBy: { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
        tags: ['maintenance', 'database'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  },
  Q2: {
    count: 2,
    tasks: [
      {
        _id: '4',
        title: 'Plan Q3 roadmap',
        description: 'Strategic planning for next quarter',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(), // 2 weeks
        priority: 'high',
        isUrgent: false,
        isImportant: true,
        eisenhowerQuadrant: 'Q2',
        status: 'pending',
        createdBy: { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
        tags: ['planning', 'strategy'],
        estimatedTime: 480,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '5',
        title: 'Learn new technology stack',
        description: 'Research and training on emerging tools',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 1 month
        priority: 'medium',
        isUrgent: false,
        isImportant: true,
        eisenhowerQuadrant: 'Q2',
        status: 'pending',
        createdBy: { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
        tags: ['learning', 'development'],
        estimatedTime: 960,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  },
  Q3: {
    count: 2,
    tasks: [
      {
        _id: '6',
        title: 'Update documentation',
        description: 'Routine documentation updates',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days
        priority: 'medium',
        isUrgent: true,
        isImportant: false,
        eisenhowerQuadrant: 'Q3',
        status: 'pending',
        createdBy: { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
        tags: ['documentation'],
        estimatedTime: 120,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '7',
        title: 'Respond to non-critical emails',
        description: 'Clear email backlog',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
        priority: 'low',
        isUrgent: true,
        isImportant: false,
        eisenhowerQuadrant: 'Q3',
        status: 'pending',
        createdBy: { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
        tags: ['email', 'communication'],
        estimatedTime: 60,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  },
  Q4: {
    count: 1,
    tasks: [
      {
        _id: '8',
        title: 'Organize desk workspace',
        description: 'Clean and organize physical workspace',
        priority: 'low',
        isUrgent: false,
        isImportant: false,
        eisenhowerQuadrant: 'Q4',
        status: 'pending',
        createdBy: { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
        tags: ['organization'],
        estimatedTime: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }
};

// Get tasks grouped by quadrant
router.get('/quadrants', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: mockQuadrants
  });
});

// Get all tasks
router.get('/', (req: Request, res: Response) => {
  const allTasks = [
    ...mockQuadrants.Q1.tasks,
    ...mockQuadrants.Q2.tasks,
    ...mockQuadrants.Q3.tasks,
    ...mockQuadrants.Q4.tasks
  ];

  res.json({
    success: true,
    data: {
      tasks: allTasks,
      pagination: {
        current: 1,
        total: 1,
        count: allTasks.length,
        totalTasks: allTasks.length
      }
    }
  });
});

// Create new task (mock)
router.post('/', (req: Request, res: Response) => {
  const newTask = {
    _id: Date.now().toString(),
    ...req.body,
    createdBy: { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    data: newTask
  });
});

// Update task (mock)
router.put('/:id', (req: Request, res: Response) => {
  const updatedTask = {
    _id: req.params.id,
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    data: updatedTask
  });
});

// Delete task (mock)
router.delete('/:id', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Task deleted successfully'
  });
});

export default router;