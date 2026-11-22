import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CheckCircle, Circle, Clock, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optimistic update
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading tasks...</div>;

  const pendingTasks = tasks.filter(t => t.status !== 'COMPLETED');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-bold text-slate-800">Tasks</h1>
        <div className="text-slate-500 font-medium">
          {pendingTasks.length} pending tasks
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wide">To Do</h2>
        {pendingTasks.length === 0 ? (
          <div className="bg-slate-50 p-8 rounded-xl text-center border border-dashed border-slate-200">
            <p className="text-slate-500 text-lg">No tasks today 🎉</p>
            <p className="text-slate-400 text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-100">
            {pendingTasks.map(task => (
              <TaskRow key={task._id} task={task} onToggle={toggleTaskStatus} />
            ))}
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-400 uppercase tracking-wide">Completed</h2>
          <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100 opacity-75">
            {completedTasks.map(task => (
              <TaskRow key={task._id} task={task} onToggle={toggleTaskStatus} isCompleted />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TaskRow = ({ task, onToggle, isCompleted }) => {
  return (
    <div className={`p-4 flex items-start gap-4 transition-colors ${isCompleted ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
      <button 
        onClick={() => onToggle(task._id, task.status)}
        className={`mt-1 flex-shrink-0 ${isCompleted ? 'text-green-500' : 'text-slate-300 hover:text-blue-500'}`}
      >
        {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
      </button>
      
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold text-lg ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
          {task.title}
        </h3>
        
        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
          {task.dueDate && (
            <span className={`flex items-center ${!isCompleted && new Date(task.dueDate) < new Date() ? 'text-red-500 font-bold' : ''}`}>
              <Clock className="w-4 h-4 mr-1" />
              {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </span>
          )}
          
          {task.emailId && (
            <Link to={`/inbox/${task.emailId._id}`} className="flex items-center text-blue-500 hover:underline">
              <Mail className="w-4 h-4 mr-1" />
              Related Email
            </Link>
          )}
        </div>
      </div>
      
      {!isCompleted && task.priority && (
        <span className={`text-xs px-2 py-1 rounded font-bold tracking-wider ${
          task.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
          task.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-700' :
          'bg-slate-100 text-slate-700'
        }`}>
          {task.priority}
        </span>
      )}
    </div>
  );
};

export default Tasks;
