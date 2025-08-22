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
  dragOverQuadrant: EisenhowerQuadrant | null = null;
  
  // Touch support properties
  private touchOffset = { x: 0, y: 0 };
  private touchDragElement: HTMLElement | null = null;

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
      
      // Create a custom drag image
      const dragElement = event.target as HTMLElement;
      const rect = dragElement.getBoundingClientRect();
      event.dataTransfer.setDragImage(dragElement, rect.width / 2, rect.height / 2);
    }
    
    // Add visual feedback
    setTimeout(() => {
      const taskElement = event.target as HTMLElement;
      taskElement.classList.add('dragging');
    }, 0);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  onDragEnter(event: DragEvent, quadrant: EisenhowerQuadrant): void {
    event.preventDefault();
    if (this.draggedTask) {
      this.dragOverQuadrant = quadrant;
    }
  }

  onDragLeave(event: DragEvent): void {
    // Only clear if we're leaving the quadrant entirely
    const target = event.target as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement;
    
    if (!target.contains(relatedTarget)) {
      this.dragOverQuadrant = null;
    }
  }

  onDrop(event: DragEvent, targetQuadrant: EisenhowerQuadrant): void {
    event.preventDefault();
    
    if (this.draggedTask) {
      // Only move if dropping in a different quadrant
      if (this.draggedTask.quadrant !== targetQuadrant) {
        this.taskService.moveTaskToQuadrant(this.draggedTask.id, targetQuadrant);
        this.loadTasks();
        
        // Add success feedback
        this.showDropSuccess(targetQuadrant);
      }
      
      this.draggedTask = null;
      this.dragOverQuadrant = null;
    }
  }

  onDragEnd(): void {
    // Remove all visual feedback
    const draggingElements = document.querySelectorAll('.dragging');
    draggingElements.forEach(el => el.classList.remove('dragging'));
    
    this.draggedTask = null;
    this.dragOverQuadrant = null;
  }

  private showDropSuccess(quadrant: EisenhowerQuadrant): void {
    // Visual feedback for successful drop
    const quadrantElement = document.querySelector(`[data-quadrant="${quadrant}"]`);
    if (quadrantElement) {
      quadrantElement.classList.add('drop-success');
      setTimeout(() => {
        quadrantElement.classList.remove('drop-success');
      }, 600);
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

  getQuadrantClass(quadrant: EisenhowerQuadrant): string {
    const baseClass = 'matrix-quadrant';
    let classes = baseClass;
    
    // Add quadrant-specific class
    switch (quadrant) {
      case EisenhowerQuadrant.Q1_DO:
        classes += ' q1-do';
        break;
      case EisenhowerQuadrant.Q2_PLAN:
        classes += ' q2-plan';
        break;
      case EisenhowerQuadrant.Q3_DELEGATE:
        classes += ' q3-delegate';
        break;
      case EisenhowerQuadrant.Q4_ELIMINATE:
        classes += ' q4-eliminate';
        break;
    }
    
    // Add drag over class if applicable
    if (this.dragOverQuadrant === quadrant) {
      classes += ' drag-over';
    }
    
    return classes;
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

  // Touch support methods
  onTouchStart(event: TouchEvent, task: Task): void {
    if (event.touches.length !== 1) return;
    
    event.preventDefault();
    this.draggedTask = task;
    
    const touch = event.touches[0];
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    
    this.touchOffset = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    
    // Create touch drag element
    this.touchDragElement = element.cloneNode(true) as HTMLElement;
    this.touchDragElement.style.position = 'fixed';
    this.touchDragElement.style.zIndex = '9999';
    this.touchDragElement.style.pointerEvents = 'none';
    this.touchDragElement.style.opacity = '0.8';
    this.touchDragElement.style.transform = 'rotate(5deg) scale(0.95)';
    this.touchDragElement.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
    
    document.body.appendChild(this.touchDragElement);
    
    // Add visual feedback to original element
    element.classList.add('dragging');
    
    this.updateTouchDragPosition(touch.clientX, touch.clientY);
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.draggedTask || !this.touchDragElement || event.touches.length !== 1) return;
    
    event.preventDefault();
    const touch = event.touches[0];
    
    this.updateTouchDragPosition(touch.clientX, touch.clientY);
    
    // Check for drop zone
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const quadrantElement = elementBelow?.closest('[data-quadrant]');
    
    if (quadrantElement) {
      const quadrantKey = quadrantElement.getAttribute('data-quadrant') as EisenhowerQuadrant;
      if (quadrantKey && quadrantKey !== this.dragOverQuadrant) {
        this.dragOverQuadrant = quadrantKey;
      }
    } else {
      this.dragOverQuadrant = null;
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (!this.draggedTask) return;
    
    event.preventDefault();
    
    if (event.changedTouches.length === 1) {
      const touch = event.changedTouches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const quadrantElement = elementBelow?.closest('[data-quadrant]');
      
      if (quadrantElement) {
        const targetQuadrant = quadrantElement.getAttribute('data-quadrant') as EisenhowerQuadrant;
        if (targetQuadrant && this.draggedTask.quadrant !== targetQuadrant) {
          this.taskService.moveTaskToQuadrant(this.draggedTask.id, targetQuadrant);
          this.loadTasks();
          this.showDropSuccess(targetQuadrant);
        }
      }
    }
    
    this.cleanupTouchDrag();
  }

  private updateTouchDragPosition(clientX: number, clientY: number): void {
    if (this.touchDragElement) {
      this.touchDragElement.style.left = `${clientX - this.touchOffset.x}px`;
      this.touchDragElement.style.top = `${clientY - this.touchOffset.y}px`;
    }
  }

  private cleanupTouchDrag(): void {
    // Remove visual feedback
    const draggingElements = document.querySelectorAll('.dragging');
    draggingElements.forEach(el => el.classList.remove('dragging'));
    
    // Remove touch drag element
    if (this.touchDragElement) {
      document.body.removeChild(this.touchDragElement);
      this.touchDragElement = null;
    }
    
    this.draggedTask = null;
    this.dragOverQuadrant = null;
  }
}
