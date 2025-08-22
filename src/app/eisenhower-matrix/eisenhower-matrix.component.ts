import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task, EisenhowerQuadrant, QuadrantInfo, TaskStatus } from '../task.model';
import { listAnimation, fadeInOut, scaleInOut, bounceIn } from '../animations';

@Component({
  selector: 'app-eisenhower-matrix',
  templateUrl: './eisenhower-matrix.component.html',
  styleUrls: ['./eisenhower-matrix.component.css'],
  animations: [listAnimation, fadeInOut, scaleInOut, bounceIn]
})
export class EisenhowerMatrixComponent implements OnInit {
  quadrants: QuadrantInfo[] = [];
  tasks: Task[] = [];
  EisenhowerQuadrant = EisenhowerQuadrant; // Expose enum to template
  draggedTask: Task | null = null;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.quadrants = this.taskService.quadrants;
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasks = this.taskService.getTasks();
  }

  getTasksForQuadrant(quadrant: EisenhowerQuadrant): Task[] {
    return this.taskService.getTasksByQuadrant(quadrant).filter(task => !task.completed);
  }

  onDragStart(event: DragEvent, task: Task): void {
    this.draggedTask = task;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', task.id.toString());
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  onDrop(event: DragEvent, targetQuadrant: EisenhowerQuadrant): void {
    event.preventDefault();
    
    if (this.draggedTask) {
      this.taskService.moveTaskToQuadrant(this.draggedTask.id, targetQuadrant);
      this.loadTasks();
      this.draggedTask = null;
    }
  }

  onDragEnd(): void {
    this.draggedTask = null;
  }

  toggleTask(id: number): void {
    this.taskService.toggleTask(id);
    this.loadTasks();
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id);
    this.loadTasks();
  }

  getQuadrantClass(quadrant: EisenhowerQuadrant): string {
    const baseClass = 'matrix-quadrant';
    switch (quadrant) {
      case EisenhowerQuadrant.Q1_DO:
        return `${baseClass} q1-do`;
      case EisenhowerQuadrant.Q2_PLAN:
        return `${baseClass} q2-plan`;
      case EisenhowerQuadrant.Q3_DELEGATE:
        return `${baseClass} q3-delegate`;
      case EisenhowerQuadrant.Q4_ELIMINATE:
        return `${baseClass} q4-eliminate`;
      default:
        return baseClass;
    }
  }

  getPriorityLabel(score: number): string {
    if (score >= 5) return 'Crítica';
    if (score >= 3) return 'Alta';
    if (score >= 1) return 'Média';
    return 'Baixa';
  }

  formatDueDate(date?: Date): string {
    if (!date) return '';
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Atrasado ${Math.abs(diffDays)} dias`;
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    return `${diffDays} dias`;
  }
}
