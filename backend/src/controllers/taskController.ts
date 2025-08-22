import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Task, ITask, EisenhowerQuadrant, TaskStatus } from '../models/Task';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    tenantId: string;
    role: string;
  };
}

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, dueDate, priority, isImportant, assignedTo, tags, estimatedTime } = req.body;

    const task = new Task({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority,
      isImportant,
      assignedTo,
      createdBy: req.user!.id,
      tenantId: req.user!.tenantId,
      tags,
      estimatedTime
    });

    await task.save();

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task'
    });
  }
};

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      quadrant, 
      status, 
      assignedTo, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query: any = { tenantId: req.user!.tenantId };

    if (quadrant) query.eisenhowerQuadrant = quadrant;
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          current: Number(page),
          total: Math.ceil(total / Number(limit)),
          count: tasks.length,
          totalTasks: total
        }
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
};

export const getTaskById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      tenantId: req.user!.tenantId
    })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task'
    });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = { ...req.body };
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        tenantId: req.user!.tenantId
      },
      updateData,
      { new: true, runValidators: true }
    )
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task'
    });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user!.tenantId
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task'
    });
  }
};

export const getTasksByQuadrant = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const quadrants = await Task.aggregate([
      {
        $match: { tenantId: req.user!.tenantId }
      },
      {
        $group: {
          _id: '$eisenhowerQuadrant',
          count: { $sum: 1 },
          tasks: {
            $push: {
              _id: '$_id',
              title: '$title',
              priority: '$priority',
              status: '$status',
              dueDate: '$dueDate',
              isUrgent: '$isUrgent',
              isImportant: '$isImportant'
            }
          }
        }
      }
    ]);

    // Ensure all quadrants are represented
    const result = {
      Q1: { count: 0, tasks: [] },
      Q2: { count: 0, tasks: [] },
      Q3: { count: 0, tasks: [] },
      Q4: { count: 0, tasks: [] }
    };

    quadrants.forEach(q => {
      result[q._id as keyof typeof result] = {
        count: q.count,
        tasks: q.tasks
      };
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get tasks by quadrant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks by quadrant'
    });
  }
};