import React, { useState, useEffect } from 'react';
import { Task, QuadrantsResponse } from '../types';
import { tasksAPI } from '../services/api';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';

interface QuadrantProps {
  title: string;
  subtitle: string;
  tasks: Task[];
  quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  color: string;
  onTaskUpdate: () => void;
}

const Quadrant: React.FC<QuadrantProps> = ({ title, subtitle, tasks, quadrant, color, onTaskUpdate }) => (
  <div className={`bg-white rounded-lg shadow-md p-4 border-t-4 ${color}`}>
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{subtitle}</p>
      <span className="text-xs text-gray-500">{tasks.length} tasks</span>
    </div>
    
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {tasks.map((task) => (
        <TaskCard 
          key={task._id} 
          task={task} 
          onUpdate={onTaskUpdate}
        />
      ))}
      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No tasks in this quadrant</p>
        </div>
      )}
    </div>
  </div>
);

const EisenhowerMatrix: React.FC = () => {
  const [quadrants, setQuadrants] = useState<QuadrantsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchQuadrants = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasksByQuadrant();
      setQuadrants(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuadrants();
  }, []);

  const handleTaskUpdate = () => {
    fetchQuadrants();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!quadrants) return null;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Eisenhower Matrix</h1>
            <p className="text-gray-600 mt-2">Organize your tasks by urgency and importance</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            + New Task
          </button>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Q1: Urgent & Important */}
        <Quadrant
          title="Q1 - Do First"
          subtitle="Urgent & Important"
          tasks={quadrants.Q1.tasks}
          quadrant="Q1"
          color="border-red-500"
          onTaskUpdate={handleTaskUpdate}
        />

        {/* Q2: Not Urgent & Important */}
        <Quadrant
          title="Q2 - Schedule"
          subtitle="Not Urgent & Important"
          tasks={quadrants.Q2.tasks}
          quadrant="Q2"
          color="border-yellow-500"
          onTaskUpdate={handleTaskUpdate}
        />

        {/* Q3: Urgent & Not Important */}
        <Quadrant
          title="Q3 - Delegate"
          subtitle="Urgent & Not Important"
          tasks={quadrants.Q3.tasks}
          quadrant="Q3"
          color="border-blue-500"
          onTaskUpdate={handleTaskUpdate}
        />

        {/* Q4: Not Urgent & Not Important */}
        <Quadrant
          title="Q4 - Eliminate"
          subtitle="Not Urgent & Not Important"
          tasks={quadrants.Q4.tasks}
          quadrant="Q4"
          color="border-gray-400"
          onTaskUpdate={handleTaskUpdate}
        />
      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Task Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{quadrants.Q1.count}</div>
            <div className="text-sm text-gray-600">Do First</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{quadrants.Q2.count}</div>
            <div className="text-sm text-gray-600">Schedule</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{quadrants.Q3.count}</div>
            <div className="text-sm text-gray-600">Delegate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{quadrants.Q4.count}</div>
            <div className="text-sm text-gray-600">Eliminate</div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <CreateTaskModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleTaskUpdate}
        />
      )}
    </div>
  );
};

export default EisenhowerMatrix;