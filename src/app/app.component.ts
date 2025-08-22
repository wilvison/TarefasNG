import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <header style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 10px;">{{ title }}</h1>
        <p style="color: #666; font-size: 16px;">Gerencie suas tarefas de forma simples e eficiente</p>
      </header>
      
      <app-task-list></app-task-list>
      
      <footer style="text-align: center; margin-top: 40px; padding: 20px; color: #999; font-size: 14px;">
        <p>&copy; 2024 TarefasNG - Gerenciador de Tarefas</p>
      </footer>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TarefasNG';
}