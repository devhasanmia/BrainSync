import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, AlertCircle, Edit2, Trash2, Calendar } from 'lucide-react';
import type { StudyTask } from '../types';

const SUBJECTS = ['Mathematics', 'Science', 'History', 'Literature', 'Geography', 'Computer Science', 'Other'];

// Demo data
const DEMO_TASKS: StudyTask[] = [
  {
    id: '1',
    title: 'Algebra Homework',
    subject: 'Mathematics',
    description: 'Complete exercises 5–10 from chapter 2',
    priority: 'high',
    deadline: new Date().toISOString().split('T')[0], // today
    estimatedHours: 2,
    completed: false,
  },
  {
    id: '2',
    title: 'Read World War II Chapter',
    subject: 'History',
    description: 'Read pages 45–60 and take notes',
    priority: 'medium',
    deadline: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // 2 days later
    estimatedHours: 1,
    completed: false,
  },
  {
    id: '3',
    title: 'Science Project Draft',
    subject: 'Science',
    description: 'Write introduction and hypothesis',
    priority: 'low',
    deadline: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], // 1 day overdue
    estimatedHours: 3,
    completed: false,
  },
];

interface TaskFormData {
  title: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  estimatedHours: string;
}

export function StudyPlanner() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    subject: SUBJECTS[0],
    description: '',
    priority: 'medium',
    deadline: '',
    estimatedHours: '',
  });

  // load demo tasks
  useEffect(() => {
    setTasks(DEMO_TASKS);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTask) {
      // update
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...editingTask, ...formData, estimatedHours: Number(formData.estimatedHours) } : t));
    } else {
      // add new
      const newTask: StudyTask = {
        id: Date.now().toString(),
        ...formData,
        estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined,
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }
    resetForm();
  };

  const toggleTaskCompletion = (taskId: string, completed: boolean) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed } : t));
  };

  const handleEdit = (task: StudyTask) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      subject: task.subject,
      description: task.description || '',
      priority: task.priority,
      deadline: task.deadline,
      estimatedHours: task.estimatedHours?.toString() || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subject: SUBJECTS[0],
      description: '',
      priority: 'medium',
      deadline: '',
      estimatedHours: '',
    });
    setEditingTask(null);
    setIsFormOpen(false);
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'pending':
        return !task.completed;
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date() && new Date(deadline).toDateString() !== new Date().toDateString();
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Study Planner</h1>
                        <p className="text-gray-600 mt-1">Break down your study goals into manageable tasks</p>
                    </div>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Task</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex space-x-2">
                    {[
                        { key: 'all', label: 'All Tasks' },
                        { key: 'pending', label: 'Pending' },
                        { key: 'completed', label: 'Completed' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === key
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Task Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total Tasks</p>
                                <p className="text-2xl font-bold text-blue-800">{tasks.length}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600">Pending</p>
                                <p className="text-2xl font-bold text-orange-800">
                                    {tasks.filter(t => !t.completed).length}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500" />
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Completed</p>
                                <p className="text-2xl font-bold text-green-800">
                                    {tasks.filter(t => t.completed).length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Tasks List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No tasks found</p>
                            <p className="text-sm text-gray-400">Create your first study task to get started</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`p-6 transition-colors ${task.completed ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4 flex-1">
                                            <button
                                                onClick={() => toggleTaskCompletion(task.id, !task.completed)}
                                                className={`mt-1 p-1 rounded-full transition-colors ${task.completed
                                                        ? 'text-green-600 bg-green-100'
                                                        : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                                    }`}
                                            >
                                                <CheckCircle className={`h-5 w-5 ${task.completed ? 'fill-current' : ''}`} />
                                            </button>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className={`text-lg font-semibold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                                        {task.title}
                                                    </h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                                        {task.priority}
                                                    </span>
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                        {task.subject}
                                                    </span>
                                                </div>

                                                {task.description && (
                                                    <p className={`text-sm mb-3 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {task.description}
                                                    </p>
                                                )}

                                                <div className="flex items-center space-x-4 text-sm">
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        <span className={`${isOverdue(task.deadline) && !task.completed ? 'text-red-600 font-medium' : 'text-gray-500'
                                                            }`}>
                                                            {new Date(task.deadline).toLocaleDateString()}
                                                        </span>
                                                        {!task.completed && (
                                                            <span className={`ml-2 ${getDaysUntilDeadline(task.deadline) < 0
                                                                    ? 'text-red-600'
                                                                    : getDaysUntilDeadline(task.deadline) <= 3
                                                                        ? 'text-orange-600'
                                                                        : 'text-gray-500'
                                                                }`}>
                                                                ({getDaysUntilDeadline(task.deadline) < 0
                                                                    ? `${Math.abs(getDaysUntilDeadline(task.deadline))} days overdue`
                                                                    : getDaysUntilDeadline(task.deadline) === 0
                                                                        ? 'Due today'
                                                                        : `${getDaysUntilDeadline(task.deadline)} days left`
                                                                })
                                                            </span>
                                                        )}
                                                    </div>

                                                    {task.estimatedHours && (
                                                        <div className="flex items-center space-x-1">
                                                            <Clock className="h-4 w-4 text-gray-400" />
                                                            <span className="text-gray-500">{task.estimatedHours}h estimated</span>
                                                        </div>
                                                    )}

                                                    {isOverdue(task.deadline) && !task.completed && (
                                                        <div className="flex items-center space-x-1 text-red-600">
                                                            <AlertCircle className="h-4 w-4" />
                                                            <span className="font-medium">Overdue</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 ml-4">
                                            <button
                                                onClick={() => handleEdit(task)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(task.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add/Edit Task Modal */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                {editingTask ? 'Edit Task' : 'Add New Task'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {SUBJECTS.map((subject) => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                        <select
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.estimatedHours}
                                            onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                                    <input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        {editingTask ? 'Update Task' : 'Add Task'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }