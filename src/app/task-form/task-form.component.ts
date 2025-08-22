import { Component, EventEmitter, Output } from '@angular/core';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
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

  // UI state
  isSubmitting = false;
  showSuccessMessage = false;
  formErrors: {[key: string]: string} = {};

  constructor(private taskService: TaskService) { }

  onSubmit(): void {
    if (this.validateForm()) {
      this.isSubmitting = true;
      
      // Simulate async operation for better UX
      setTimeout(() => {
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

        // Reset form and show success
        this.resetForm();
        this.showSuccessToast();
        this.taskCreated.emit();
        this.isSubmitting = false;
      }, 1000);
    }
  }

  private validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this.title.trim()) {
      this.formErrors['title'] = 'Título é obrigatório';
      isValid = false;
    } else if (this.title.trim().length < 3) {
      this.formErrors['title'] = 'Título deve ter pelo menos 3 caracteres';
      isValid = false;
    }

    if (this.due_date) {
      const dueDate = new Date(this.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        this.formErrors['due_date'] = 'Data de vencimento não pode ser no passado';
        isValid = false;
      }
    }

    return isValid;
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
    this.formErrors = {};
  }

  private showSuccessToast(): void {
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
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

  getQuadrantColor(): string {
    if (this.is_urgent && this.is_important) {
      return '#e74c3c';
    } else if (!this.is_urgent && this.is_important) {
      return '#27ae60';
    } else if (this.is_urgent && !this.is_important) {
      return '#f39c12';
    } else {
      return '#95a5a6';
    }
  }

  getPriorityPreview(): number {
    return (this.is_urgent ? 2 : 0) + 
           (this.is_important ? 3 : 0) + 
           this.impact_score - 
           this.effort_estimate;
  }

  getTitleFieldClass(): string {
    if (this.formErrors['title']) return 'form-control is-invalid';
    if (this.title.trim().length >= 3) return 'form-control is-valid';
    return 'form-control';
  }

  getDueDateFieldClass(): string {
    if (this.formErrors['due_date']) return 'form-control is-invalid';
    if (this.due_date && !this.formErrors['due_date']) return 'form-control is-valid';
    return 'form-control';
  }

  onTitleInput(): void {
    // Clear error when user starts typing
    if (this.formErrors['title'] && this.title.trim().length >= 3) {
      delete this.formErrors['title'];
    }
  }

  onDueDateChange(): void {
    // Clear error when user changes date
    if (this.formErrors['due_date']) {
      delete this.formErrors['due_date'];
    }
  }
}
