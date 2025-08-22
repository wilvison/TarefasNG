import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { listAnimation, fadeInOut, scaleInOut } from '../animations';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  animations: [listAnimation, fadeInOut, scaleInOut]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle = '';
  newTaskDescription = '';
  showCompleted = true;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasks = this.taskService.getTasks();
  }

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.taskService.addTask(this.newTaskTitle.trim(), this.newTaskDescription.trim());
      this.newTaskTitle = '';
      this.newTaskDescription = '';
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
}