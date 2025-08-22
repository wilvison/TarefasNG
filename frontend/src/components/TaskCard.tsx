import React, { useState } from 'react';
import { Task } from '../types';
import { tasksAPI } from '../services/api';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      await tasksAPI.updateTask(task._id, { status: newStatus as any });
      onUpdate();
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setIsUpdating(true);
        await tasksAPI.deleteTask(task._id);
        onUpdate();
      } catch (error) {
        console.error('Failed to delete task:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className={`bg-white border rounded-lg p-3 hover:shadow-md transition-shadow ${isOverdue ? 'border-red-300' : 'border-gray-200'}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 text-sm flex-1">{task.title}</h4>
        <div className="flex space-x-1 ml-2">
          <button
            onClick={handleDelete}
            disabled={isUpdating}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            ×
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-1 mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {task.dueDate && (
        <div className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
          Due: {formatDate(task.dueDate)}
          {isOverdue && ' (Overdue)'}
        </div>
      )}

      <div className="mt-2 flex space-x-1">
        {task.status !== 'completed' && (
          <button
            onClick={() => handleStatusChange('completed')}
            disabled={isUpdating}
            className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded"
          >
            Complete
          </button>
        )}
        {task.status !== 'in_progress' && task.status !== 'completed' && (
          <button
            onClick={() => handleStatusChange('in_progress')}
            disabled={isUpdating}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;