export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  
  // Eisenhower Matrix fields
  is_urgent: boolean;
  is_important: boolean;
  due_date?: Date;
  effort_estimate: number; // 1-5 scale
  impact_score: number; // 1-5 scale
  priority_score: number; // calculated field
  quadrant: EisenhowerQuadrant; // derived from is_urgent/is_important
  
  // Enhanced fields
  labels: string[];
  status: TaskStatus;
  assignee?: string;
  project_id?: number;
}

export enum EisenhowerQuadrant {
  Q1_DO = 'Q1_DO', // Urgent + Important (Do)
  Q2_PLAN = 'Q2_PLAN', // Not Urgent + Important (Plan)
  Q3_DELEGATE = 'Q3_DELEGATE', // Urgent + Not Important (Delegate)
  Q4_ELIMINATE = 'Q4_ELIMINATE' // Not Urgent + Not Important (Eliminate)
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface QuadrantInfo {
  key: EisenhowerQuadrant;
  title: string;
  description: string;
  color: string;
  icon: string;
}