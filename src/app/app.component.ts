import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <div class="header-brand">
            <img src="assets/logo.svg" alt="NOVAG Logo" class="logo">
            <div class="brand-text">
              <h1>{{ title }}</h1>
              <span class="powered-by">Powered by NOVAG</span>
            </div>
          </div>
          <p class="subtitle">Sistema de Gerenciamento de Tarefas baseado na Matriz de Eisenhower</p>
          
          <nav class="main-nav">
            <button 
              [class.active]="currentView === 'matrix'"
              (click)="setView('matrix')"
              class="nav-btn">
              📊 Matriz de Eisenhower
            </button>
            <button 
              [class.active]="currentView === 'create'"
              (click)="setView('create')"
              class="nav-btn">
              ➕ Criar Tarefa
            </button>
            <button 
              [class.active]="currentView === 'list'"
              (click)="setView('list')"
              class="nav-btn">
              📝 Lista de Tarefas
            </button>
            <button 
              [class.active]="currentView === 'saas'"
              (click)="setView('saas')"
              class="nav-btn">
              ⚙️ SaaS & Configurações
            </button>
          </nav>
        </div>
      </header>
      
      <main class="app-main">
        <!-- Matrix View -->
        <div *ngIf="currentView === 'matrix'">
          <app-eisenhower-matrix></app-eisenhower-matrix>
        </div>
        
        <!-- Create Task View -->
        <div *ngIf="currentView === 'create'">
          <app-task-form (taskCreated)="onTaskCreated()"></app-task-form>
        </div>
        
        <!-- Traditional List View -->
        <div *ngIf="currentView === 'list'">
          <app-task-list></app-task-list>
        </div>
        
        <!-- SaaS Features View -->
        <div *ngIf="currentView === 'saas'">
          <app-saas-features></app-saas-features>
        </div>
      </main>
      
      <footer class="app-footer">
        <p>&copy; 2024 TarefasNG - Sistema SaaS de Produtividade</p>
        <p>Desenvolvido por <strong>NOVAG Tecnologia & Inovação</strong></p>
        <p>Transformando a gestão de tarefas com a Matriz de Eisenhower</p>
      </footer>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TarefasNG';
  currentView: 'matrix' | 'create' | 'list' | 'saas' = 'matrix';

  setView(view: 'matrix' | 'create' | 'list' | 'saas'): void {
    this.currentView = view;
  }

  onTaskCreated(): void {
    // Switch to matrix view after creating a task
    this.currentView = 'matrix';
  }
}