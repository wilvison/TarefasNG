import { Injectable } from '@angular/core';
import { Task, EisenhowerQuadrant, TaskStatus, QuadrantInfo } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Bem-vindo ao TarefasNG!',
      description: 'Esta é uma tarefa de exemplo da Matriz de Eisenhower. Você pode classificar tarefas por urgência e importância.',
      completed: false,
      createdAt: new Date(),
      is_urgent: true,
      is_important: true,
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      effort_estimate: 3,
      impact_score: 4,
      priority_score: 0,
      quadrant: EisenhowerQuadrant.Q1_DO,
      labels: ['boas-vindas', 'demo'],
      status: TaskStatus.PENDING
    },
    {
      id: 2,
      title: 'Planejar próximo trimestre',
      description: 'Definir objetivos e metas estratégicas para os próximos 3 meses da empresa.',
      completed: false,
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      is_urgent: false,
      is_important: true,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      effort_estimate: 5,
      impact_score: 5,
      priority_score: 0,
      quadrant: EisenhowerQuadrant.Q2_PLAN,
      labels: ['planejamento', 'estratégia'],
      status: TaskStatus.PENDING
    },
    {
      id: 3,
      title: 'Verificar emails não urgentes',
      description: 'Responder emails de rotina e newsletters.',
      completed: false,
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      is_urgent: true,
      is_important: false,
      effort_estimate: 2,
      impact_score: 1,
      priority_score: 0,
      quadrant: EisenhowerQuadrant.Q3_DELEGATE,
      labels: ['comunicação', 'rotina'],
      status: TaskStatus.PENDING
    }
  ];
  private nextId = 4;

  // Quadrant information for UI
  public readonly quadrants: QuadrantInfo[] = [
    {
      key: EisenhowerQuadrant.Q1_DO,
      title: 'Q1: Fazer Agora',
      description: 'Urgente e Importante',
      color: '#dc3545', // Red
      icon: '🔥'
    },
    {
      key: EisenhowerQuadrant.Q2_PLAN,
      title: 'Q2: Planejar',
      description: 'Não Urgente e Importante',
      color: '#28a745', // Green
      icon: '📅'
    },
    {
      key: EisenhowerQuadrant.Q3_DELEGATE,
      title: 'Q3: Delegar',
      description: 'Urgente e Não Importante',
      color: '#ffc107', // Yellow
      icon: '👥'
    },
    {
      key: EisenhowerQuadrant.Q4_ELIMINATE,
      title: 'Q4: Eliminar',
      description: 'Não Urgente e Não Importante',
      color: '#6c757d', // Gray
      icon: '🗑️'
    }
  ];

  constructor() {
    // Calculate priority scores for existing tasks
    this.tasks.forEach(task => {
      this.calculateTaskPriority(task);
    });
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  getTasksByQuadrant(quadrant: EisenhowerQuadrant): Task[] {
    return this.tasks.filter(task => task.quadrant === quadrant);
  }

  addTask(title: string, description: string, is_urgent: boolean = false, is_important: boolean = false, 
         due_date?: Date, effort_estimate: number = 3, impact_score: number = 3): void {
    const newTask: Task = {
      id: this.nextId++,
      title,
      description,
      completed: false,
      createdAt: new Date(),
      is_urgent,
      is_important,
      due_date,
      effort_estimate,
      impact_score,
      priority_score: 0,
      quadrant: EisenhowerQuadrant.Q4_ELIMINATE, // Will be recalculated
      labels: [],
      status: TaskStatus.PENDING
    };
    
    this.calculateTaskPriority(newTask);
    this.tasks.unshift(newTask);
  }

  updateTask(id: number, updates: Partial<Task>): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      Object.assign(task, updates);
      this.calculateTaskPriority(task);
    }
  }

  toggleTask(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      task.status = task.completed ? TaskStatus.COMPLETED : TaskStatus.PENDING;
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }

  moveTaskToQuadrant(taskId: number, targetQuadrant: EisenhowerQuadrant): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      // Update urgency/importance based on target quadrant
      switch (targetQuadrant) {
        case EisenhowerQuadrant.Q1_DO:
          task.is_urgent = true;
          task.is_important = true;
          break;
        case EisenhowerQuadrant.Q2_PLAN:
          task.is_urgent = false;
          task.is_important = true;
          break;
        case EisenhowerQuadrant.Q3_DELEGATE:
          task.is_urgent = true;
          task.is_important = false;
          break;
        case EisenhowerQuadrant.Q4_ELIMINATE:
          task.is_urgent = false;
          task.is_important = false;
          break;
      }
      this.calculateTaskPriority(task);
    }
  }

  private calculateTaskPriority(task: Task): void {
    // Auto-classify urgency based on due date (if within 48h or flag is set)
    if (task.due_date) {
      const hoursUntilDue = (task.due_date.getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursUntilDue <= 48) {
        task.is_urgent = true;
      }
    }

    // Calculate priority score: urgency(2) + importance(3) + impact(0-5) - effort(0-5)
    task.priority_score = 
      (task.is_urgent ? 2 : 0) + 
      (task.is_important ? 3 : 0) + 
      task.impact_score - 
      task.effort_estimate;

    // Determine quadrant
    if (task.is_urgent && task.is_important) {
      task.quadrant = EisenhowerQuadrant.Q1_DO;
    } else if (!task.is_urgent && task.is_important) {
      task.quadrant = EisenhowerQuadrant.Q2_PLAN;
    } else if (task.is_urgent && !task.is_important) {
      task.quadrant = EisenhowerQuadrant.Q3_DELEGATE;
    } else {
      task.quadrant = EisenhowerQuadrant.Q4_ELIMINATE;
    }
  }

  getCompletedCount(): number {
    return this.tasks.filter(t => t.completed).length;
  }

  getTotalCount(): number {
    return this.tasks.length;
  }

  getQuadrantInfo(quadrant: EisenhowerQuadrant): QuadrantInfo | undefined {
    return this.quadrants.find(q => q.key === quadrant);
  }
}