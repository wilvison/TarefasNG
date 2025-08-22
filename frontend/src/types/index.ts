export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isUrgent: boolean;
  isImportant: boolean;
  eisenhowerQuadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  tags?: string[];
  estimatedTime?: number;
  actualTime?: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'owner';
  tenantId: string;
  subscription?: {
    plan: string;
    status: 'active' | 'inactive' | 'trial' | 'cancelled';
    currentPeriodEnd?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
    pagination: {
      current: number;
      total: number;
      count: number;
      totalTasks: number;
    };
  };
}

export interface QuadrantData {
  count: number;
  tasks: Task[];
}

export interface QuadrantsResponse {
  success: boolean;
  data: {
    Q1: QuadrantData;
    Q2: QuadrantData;
    Q3: QuadrantData;
    Q4: QuadrantData;
  };
}