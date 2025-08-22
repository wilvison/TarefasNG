import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle = '';
  newTaskDescription = '';
  showCompleted = true;
  isLoading = false;
  isSubmitting = false;
  showSuccessMessage = false;
  
  // Touch interaction state
  swipeStates: {[key: number]: {isActive: boolean, direction: string}} = {};

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    // Simulate loading for better UX
    setTimeout(() => {
      this.tasks = this.taskService.getTasks();
      this.isLoading = false;
    }, 300);
  }

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.isSubmitting = true;
      
      // Simulate async operation
      setTimeout(() => {
        this.taskService.addTask(this.newTaskTitle.trim(), this.newTaskDescription.trim());
        this.newTaskTitle = '';
        this.newTaskDescription = '';
        this.showSuccessToast();
        this.loadTasks();
        this.isSubmitting = false;
      }, 500);
    }
  }

  toggleTask(id: number): void {
    this.taskService.toggleTask(id);
    this.showSuccessToast();
    this.loadTasks();
  }

  deleteTask(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.taskService.deleteTask(id);
      this.showSuccessToast();
      this.loadTasks();
    }
  }

  private showSuccessToast(): void {
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 2000);
  }

  getFilteredTasks(): Task[] {
    if (this.showCompleted) {
      return this.tasks;
    }
    return this.tasks.filter(task => !task.completed);
  }

  getCompletedCount(): number {
    return this.taskService.getCompletedCount();
  }

  getTotalCount(): number {
    return this.taskService.getTotalCount();
  }

  getCompletedPercentage(): number {
    const total = this.getTotalCount();
    if (total === 0) return 0;
    return Math.round((this.getCompletedCount() / total) * 100);
  }

  // Touch interaction methods for mobile
  onTouchStart(event: TouchEvent, taskId: number): void {
    this.swipeStates[taskId] = { isActive: true, direction: 'none' };
  }

  onTouchMove(event: TouchEvent, taskId: number): void {
    if (!this.swipeStates[taskId]?.isActive) return;
    
    const touch = event.touches[0];
    const startX = event.currentTarget ? (event.currentTarget as HTMLElement).getBoundingClientRect().left : 0;
    const deltaX = touch.clientX - startX;
    
    if (Math.abs(deltaX) > 50) {
      this.swipeStates[taskId].direction = deltaX > 0 ? 'right' : 'left';
    }
  }

  onTouchEnd(event: TouchEvent, taskId: number): void {
    const swipeState = this.swipeStates[taskId];
    if (!swipeState?.isActive) return;
    
    if (swipeState.direction === 'right') {
      this.toggleTask(taskId);
    } else if (swipeState.direction === 'left') {
      this.deleteTask(taskId);
    }
    
    delete this.swipeStates[taskId];
  }

  getTaskAriaLabel(task: Task): string {
    const status = task.completed ? 'concluída' : 'pendente';
    return `Tarefa ${task.title}, status ${status}. Deslize para a direita para alternar status, para a esquerda para excluir.`;
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
}