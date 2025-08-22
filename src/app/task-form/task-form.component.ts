import { Component, EventEmitter, Output } from '@angular/core';
import { TaskService } from '../task.service';
import { scaleInOut, fadeInOut, slideUpDown } from '../animations';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  animations: [scaleInOut, fadeInOut, slideUpDown]
})
export class TaskFormComponent {
  @Output() taskCreated = new EventEmitter<void>();

  // Form fields
  title = '';
  description = '';
  is_urgent = false;
  is_important = false;
  due_date = '';
  effort_estimate = 3;
  impact_score = 3;
  labels = '';

  constructor(private taskService: TaskService) { }

  onSubmit(): void {
    if (this.title.trim()) {
      const dueDate = this.due_date ? new Date(this.due_date) : undefined;
      const labelArray = this.labels ? this.labels.split(',').map(l => l.trim()).filter(l => l) : [];
      
      this.taskService.addTask(
        this.title.trim(),
        this.description.trim(),
        this.is_urgent,
        this.is_important,
        dueDate,
        this.effort_estimate,
        this.impact_score
      );

      // Add labels if any
      if (labelArray.length > 0) {
        const tasks = this.taskService.getTasks();
        const newTask = tasks[0]; // Last added task (unshift puts it first)
        newTask.labels = labelArray;
      }

      // Reset form
      this.resetForm();
      this.taskCreated.emit();
    }
  }

  private resetForm(): void {
    this.title = '';
    this.description = '';
    this.is_urgent = false;
    this.is_important = false;
    this.due_date = '';
    this.effort_estimate = 3;
    this.impact_score = 3;
    this.labels = '';
  }

  getQuadrantPreview(): string {
    if (this.is_urgent && this.is_important) {
      return 'Q1: Fazer Agora 🔥';
    } else if (!this.is_urgent && this.is_important) {
      return 'Q2: Planejar 📅';
    } else if (this.is_urgent && !this.is_important) {
      return 'Q3: Delegar 👥';
    } else {
      return 'Q4: Eliminar 🗑️';
    }
  }

  getPriorityPreview(): number {
    return (this.is_urgent ? 2 : 0) + 
           (this.is_important ? 3 : 0) + 
           this.impact_score - 
           this.effort_estimate;
  }
}
