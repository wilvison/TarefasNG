import axios from 'axios';
import { Task } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then(res => res.data),
    
  register: (name: string, email: string, password: string, organizationName?: string) =>
    api.post('/auth/register', { name, email, password, organizationName }).then(res => res.data),
    
  getProfile: () =>
    api.get('/auth/profile').then(res => res.data),
};

// Tasks API
export const tasksAPI = {
  getTasks: (params?: {
    quadrant?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/tasks', { params }).then(res => res.data),
    
  getTasksByQuadrant: () =>
    api.get('/tasks/quadrants').then(res => res.data),
    
  createTask: (task: Partial<Task>) =>
    api.post('/tasks', task).then(res => res.data),
    
  updateTask: (id: string, task: Partial<Task>) =>
    api.put(`/tasks/${id}`, task).then(res => res.data),
    
  deleteTask: (id: string) =>
    api.delete(`/tasks/${id}`).then(res => res.data),
    
  getTask: (id: string) =>
    api.get(`/tasks/${id}`).then(res => res.data),
};

export default api;