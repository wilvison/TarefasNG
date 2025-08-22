import React from 'react';
import './App.css';
import EisenhowerMatrix from './components/EisenhowerMatrix';

function App() {
  return (
    <div className="App">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">TarefasNG</h1>
              <span className="ml-2 text-sm text-gray-500">Task Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome back!</span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                Profile
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="min-h-screen bg-gray-50">
        <EisenhowerMatrix />
      </main>
    </div>
  );
}

export default App;
