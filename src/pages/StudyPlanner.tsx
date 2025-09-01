import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, Trash2, Calendar, Plus, Edit } from 'lucide-react';
import type { StudyTask } from '../types';
import {
    useGetAllStudyPlannerQuery,
    useDeleteStudyTaskMutation,
    useUpdateStudyTaskMutation
} from '@/redux/features/studyPlanner/studyPlannerApi';
import PageHeader from '@/components/ui/PageHeader';
import { Link } from 'react-router';


export function StudyPlanner() {
    const [tasks, setTasks] = useState<StudyTask[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

    const { data: studyPlanner, isLoading } = useGetAllStudyPlannerQuery("");
    const [deleteTask] = useDeleteStudyTaskMutation();
    const [updateTask] = useUpdateStudyTaskMutation();

    // Load API tasks
    useEffect(() => {
        if (studyPlanner?.data?.data) {
            const apiTasks: StudyTask[] = studyPlanner.data.data.map((task: any) => ({
                id: task._id,
                title: task.title,
                subject: task.subject,
                description: task.description,
                priority: task.priority,
                deadline: new Date(task.deadline).toISOString().split('T')[0],
                estimatedHours: task.estimatedHours ? Number(task.estimatedHours) : undefined,
                completed: task.completed,
            }));
            setTasks(apiTasks);
        }
    }, [studyPlanner]);

    // ---- Toggle task completion ----
    const toggleTaskCompletion = async (task: StudyTask) => {
        try {
            await updateTask({ id: task.id, payload: { completed: !task.completed } }).unwrap();
            setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
        } catch (error) {
            console.error("Failed to update task", error);
        }
    };

    // ---- Delete task ----
    const handleDelete = async (taskId: string) => {
        try {
            await deleteTask(taskId).unwrap();
            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    const filteredTasks = tasks.filter(task => {
        switch (filter) {
            case 'pending': return !task.completed;
            case 'completed': return task.completed;
            default: return true;
        }
    });

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-green-100 text-green-800 border-green-200';
        }
    };

    const isOverdue = (deadline: string) => new Date(deadline) < new Date() && new Date(deadline).toDateString() !== new Date().toDateString();

    if (isLoading) return <p>Loading tasks...</p>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Study Planner"
                subtitle="Organize and track your study tasks"
                buttonText="Add Task"
                buttonLink="/dashboard/add-study-task"
                icon={Plus}
            />


            {/* Filters */}
            <div className="flex space-x-2">
                {['all', 'pending', 'completed'].map((key) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === key
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {key === 'all' ? 'All Tasks' : key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                ))}
            </div>

            {/* Stats */}
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
                            <p className="text-2xl font-bold text-orange-800">{tasks.filter(t => !t.completed).length}</p>
                        </div>
                        <Clock className="h-8 w-8 text-orange-500" />
                    </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600">Completed</p>
                            <p className="text-2xl font-bold text-green-800">{tasks.filter(t => t.completed).length}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No tasks found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredTasks.map((task) => (
                            <div key={task.id} className={`p-6 transition-colors ${task.completed ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <button
                                            onClick={() => toggleTaskCompletion(task)}
                                            className={`
    mt-1 w-8 h-8 rounded-full
    transition-colors duration-300
    border-2 border-gray-300
    ${task.completed
                                                    ? 'bg-green-500 border-green-600'
                                                    : 'bg-white hover:bg-green-100 border-gray-300'
                                                }
    shadow-sm hover:shadow-md
  `}
                                            title={task.completed ? "Mark as Incomplete" : "Mark as Complete"}
                                        />






                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className={`text-lg font-semibold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                                    {task.title}
                                                </h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{task.subject}</span>
                                            </div>

                                            {task.description && (
                                                <p className={`text-sm mb-3 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {task.description}
                                                </p>
                                            )}

                                            <div className="flex items-center space-x-4 text-sm">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span className={`${isOverdue(task.deadline) && !task.completed ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                                        {new Date(task.deadline).toLocaleDateString()}
                                                    </span>
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

                                    <div className="flex items-center space-x-2">
                                        <Link
                                            to={`/dashboard/edit-study-task/${task.id}`}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
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
        </div>
    );
}
