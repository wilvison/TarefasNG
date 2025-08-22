import { Injectable } from '@angular/core';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Bem-vindo ao TarefasNG!',
      description: 'Esta é uma tarefa de exemplo. Você pode adicionar, editar e marcar tarefas como concluídas.',
      completed: false,
      createdAt: new Date()
    },
    {
      id: 2,
      title: 'Configurar projeto Angular',
      description: 'Configurar a estrutura básica do projeto Angular para gerenciamento de tarefas.',
      completed: true,
      createdAt: new Date(Date.now() - 86400000) // 1 day ago
    }
  ];
  private nextId = 3;

  constructor() { }

  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(title: string, description: string): void {
    const newTask: Task = {
      id: this.nextId++,
      title,
      description,
      completed: false,
      createdAt: new Date()
    };
    this.tasks.unshift(newTask);
  }

  toggleTask(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }

  getCompletedCount(): number {
    return this.tasks.filter(t => t.completed).length;
  }

  getTotalCount(): number {
    return this.tasks.length;
  }
}