import mongoose, { Document, Schema } from 'mongoose';

// Eisenhower Matrix Quadrants
export enum EisenhowerQuadrant {
  Q1 = 'Q1', // Urgent and Important (Do First)
  Q2 = 'Q2', // Not Urgent but Important (Schedule)
  Q3 = 'Q3', // Urgent but Not Important (Delegate)
  Q4 = 'Q4'  // Not Urgent and Not Important (Eliminate)
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ITask extends Document {
  _id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: TaskPriority;
  isUrgent: boolean;
  isImportant: boolean;
  eisenhowerQuadrant: EisenhowerQuadrant;
  status: TaskStatus;
  assignedTo?: string; // User ID
  createdBy: string; // User ID
  tenantId: string;
  tags?: string[];
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  dueDate: {
    type: Date,
    index: true
  },
  priority: {
    type: String,
    enum: Object.values(TaskPriority),
    required: true
  },
  isUrgent: {
    type: Boolean,
    required: true,
    default: false
  },
  isImportant: {
    type: Boolean,
    required: true,
    default: false
  },
  eisenhowerQuadrant: {
    type: String,
    enum: Object.values(EisenhowerQuadrant),
    required: true
  },
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.PENDING
  },
  assignedTo: {
    type: String,
    ref: 'User'
  },
  createdBy: {
    type: String,
    required: true,
    ref: 'User'
  },
  tenantId: {
    type: String,
    required: true,
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  estimatedTime: {
    type: Number,
    min: 0
  },
  actualTime: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
taskSchema.index({ tenantId: 1, status: 1 });
taskSchema.index({ tenantId: 1, eisenhowerQuadrant: 1 });
taskSchema.index({ tenantId: 1, assignedTo: 1 });
taskSchema.index({ tenantId: 1, dueDate: 1 });

// Pre-save middleware to automatically calculate Eisenhower quadrant
taskSchema.pre('save', function(next) {
  const task = this as ITask;
  
  // Auto-calculate urgency based on due date
  if (task.dueDate) {
    const now = new Date();
    const timeDiff = task.dueDate.getTime() - now.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    
    // Task is urgent if due within 3 days or overdue
    task.isUrgent = daysDiff <= 3;
  }
  
  // Auto-assign to Eisenhower quadrant
  if (task.isUrgent && task.isImportant) {
    task.eisenhowerQuadrant = EisenhowerQuadrant.Q1; // Do First
  } else if (!task.isUrgent && task.isImportant) {
    task.eisenhowerQuadrant = EisenhowerQuadrant.Q2; // Schedule
  } else if (task.isUrgent && !task.isImportant) {
    task.eisenhowerQuadrant = EisenhowerQuadrant.Q3; // Delegate
  } else {
    task.eisenhowerQuadrant = EisenhowerQuadrant.Q4; // Eliminate
  }
  
  next();
});

export const Task = mongoose.model<ITask>('Task', taskSchema);