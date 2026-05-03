import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { EisenhowerQuadrant, QuadrantInfo, Task } from '../task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskUrgent = false;
  newTaskImportant = false;
  newTaskDueDate = '';
  showCompleted = true;
  searchTerm = '';
  sortOption: 'recent' | 'oldest' | 'title' | 'priority' = 'recent';
  selectedQuadrant: EisenhowerQuadrant | 'all' = 'all';
  quadrants: QuadrantInfo[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.quadrants = this.taskService.quadrants;
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasks = this.taskService.getTasks();
  }

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      const dueDate = this.newTaskDueDate ? new Date(this.newTaskDueDate) : undefined;
      this.taskService.addTask(
        this.newTaskTitle.trim(),
        this.newTaskDescription.trim(),
        this.newTaskUrgent,
        this.newTaskImportant,
        dueDate
      );
      this.newTaskTitle = '';
      this.newTaskDescription = '';
      this.newTaskUrgent = false;
      this.newTaskImportant = false;
      this.newTaskDueDate = '';
      this.loadTasks();
    }
  }

  toggleTask(id: number): void {
    this.taskService.toggleTask(id);
    this.loadTasks();
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id);
    this.loadTasks();
  }

  getFilteredTasks(): Task[] {
    let filtered = [...this.tasks];

    if (!this.showCompleted) {
      filtered = filtered.filter(task => !task.completed);
    }

    if (this.selectedQuadrant !== 'all') {
      filtered = filtered.filter(task => task.quadrant === this.selectedQuadrant);
    }

    const query = this.searchTerm.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(task =>
        [task.title, task.description, ...(task.labels || [])]
          .filter(Boolean)
          .some(value => value.toLowerCase().includes(query))
      );
    }

    switch (this.sortOption) {
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'priority':
        filtered.sort((a, b) => b.priority_score - a.priority_score);
        break;
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    return filtered;
  }

  getCompletedCount(): number {
    return this.taskService.getCompletedCount();
  }

  getTotalCount(): number {
    return this.taskService.getTotalCount();
  }

  getPendingCount(): number {
    return this.getTotalCount() - this.getCompletedCount();
  }

  getCompletedPercentage(): number {
    const total = this.getTotalCount();
    if (total === 0) return 0;
    return Math.round((this.getCompletedCount() / total) * 100);
  }

  getQuadrantCount(quadrant: EisenhowerQuadrant): number {
    return this.tasks.filter(task => task.quadrant === quadrant).length;
  }

  getQuadrantLabel(quadrant: EisenhowerQuadrant): string {
    return this.taskService.getQuadrantInfo(quadrant)?.title ?? quadrant;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedQuadrant = 'all';
    this.sortOption = 'recent';
  }

  getPriorityLabel(score: number): string {
    if (score >= 5) return 'Crítica';
    if (score >= 3) return 'Alta';
    if (score >= 1) return 'Média';
    return 'Baixa';
  }

  getPriorityKey(score: number): string {
    if (score >= 5) return 'critica';
    if (score >= 3) return 'alta';
    if (score >= 1) return 'media';
    return 'baixa';
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

  isOverdue(date?: Date): boolean {
    if (!date) return false;
    return date.getTime() < Date.now();
  }
}
