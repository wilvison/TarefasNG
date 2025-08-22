import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task, EisenhowerQuadrant, QuadrantInfo, TaskStatus } from '../task.model';

@Component({
  selector: 'app-eisenhower-matrix',
  templateUrl: './eisenhower-matrix.component.html',
  styleUrls: ['./eisenhower-matrix.component.css']
})
export class EisenhowerMatrixComponent implements OnInit {
  quadrants: QuadrantInfo[] = [];
  tasks: Task[] = [];
  EisenhowerQuadrant = EisenhowerQuadrant; // Expose enum to template
  draggedTask: Task | null = null;
  isLoading = false;
  showSuccessMessage = false;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.quadrants = this.taskService.quadrants;
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    // Simulate async loading for better UX
    setTimeout(() => {
      this.tasks = this.taskService.getTasks();
      this.isLoading = false;
    }, 300);
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
    
    // Add visual feedback
    const element = event.target as HTMLElement;
    element.style.opacity = '0.5';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
    
    // Add visual feedback to drop zone
    const element = event.currentTarget as HTMLElement;
    element.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent): void {
    const element = event.currentTarget as HTMLElement;
    element.classList.remove('drag-over');
  }

  onDrop(event: DragEvent, targetQuadrant: EisenhowerQuadrant): void {
    event.preventDefault();
    
    const element = event.currentTarget as HTMLElement;
    element.classList.remove('drag-over');
    
    if (this.draggedTask) {
      this.taskService.moveTaskToQuadrant(this.draggedTask.id, targetQuadrant);
      this.showSuccessToast('Tarefa movida com sucesso!');
      this.loadTasks();
      this.draggedTask = null;
    }
  }

  onDragEnd(): void {
    this.draggedTask = null;
    // Reset visual feedback
    document.querySelectorAll('.matrix-task').forEach(el => {
      (el as HTMLElement).style.opacity = '1';
    });
  }

  toggleTask(id: number): void {
    this.taskService.toggleTask(id);
    this.showSuccessToast('Status da tarefa atualizado!');
    this.loadTasks();
  }

  deleteTask(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.taskService.deleteTask(id);
      this.showSuccessToast('Tarefa excluída com sucesso!');
      this.loadTasks();
    }
  }

  private showSuccessToast(message: string): void {
    // Simple toast implementation - could be enhanced with a toast service
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
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

  getQuadrantAriaLabel(quadrant: QuadrantInfo): string {
    const taskCount = this.getTasksForQuadrant(quadrant.key).length;
    return `${quadrant.title}: ${quadrant.description}. ${taskCount} tarefas.`;
  }

  getTaskAriaLabel(task: Task): string {
    const status = task.completed ? 'concluída' : 'pendente';
    const priority = this.getPriorityLabel(task.priority_score);
    return `Tarefa ${task.title}, prioridade ${priority}, status ${status}`;
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }

  onTaskKeydown(event: KeyboardEvent, task: Task): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleTask(task.id);
    } else if (event.key === 'Delete') {
      event.preventDefault();
      this.deleteTask(task.id);
    }
  }
}
