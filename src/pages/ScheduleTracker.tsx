import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, MapPin, User } from 'lucide-react';
import type { Class } from '../types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316'];

// ডেমো ডাটা
const DEMO_CLASSES: Class[] = [
  {
    id: '1',
    subject: 'Mathematics',
    instructor: 'Dr. Rahman',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    location: 'Room 101',
    color: COLORS[0],
  },
  {
    id: '2',
    subject: 'Physics',
    instructor: 'Prof. Karim',
    day: 'Wednesday',
    startTime: '11:00',
    endTime: '12:30',
    location: 'Room 202',
    color: COLORS[1],
  },
  {
    id: '3',
    subject: 'English Literature',
    instructor: 'Ms. Akter',
    day: 'Friday',
    startTime: '14:00',
    endTime: '15:30',
    location: 'Room 303',
    color: COLORS[2],
  },
  {
    id: '22',
    subject: 'English Literature',
    instructor: 'Ms. Akter',
    day: 'Friday',
    startTime: '14:00',
    endTime: '15:30',
    location: 'Room 303',
    color: COLORS[2],
  },
  {
    id: '5',
    subject: 'English Literature',
    instructor: 'Ms. Akter',
    day: 'Friday',
    startTime: '14:00',
    endTime: '15:30',
    location: 'Room 303',
    color: COLORS[2],
  },
];

interface ClassFormData {
  subject: string;
  instructor: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  color: string;
}

export function ScheduleTracker() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState<ClassFormData>({
    subject: '',
    instructor: '',
    day: 'Monday',
    startTime: '',
    endTime: '',
    location: '',
    color: COLORS[0],
  });

  // ডেমো ডাটা লোড করা হবে
  useEffect(() => {
    setClasses(DEMO_CLASSES);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingClass) {
      // Update mode
      setClasses(classes.map(c => c.id === editingClass.id ? { ...editingClass, ...formData } : c));
    } else {
      // Add mode
      const newClass: Class = {
        id: Date.now().toString(),
        ...formData,
      };
      setClasses([...classes, newClass]);
    }

    resetForm();
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setFormData({
      subject: classItem.subject,
      instructor: classItem.instructor,
      day: classItem.day,
      startTime: classItem.startTime,
      endTime: classItem.endTime,
      location: classItem.location || '',
      color: classItem.color,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (classId: string) => {
    setClasses(classes.filter(c => c.id !== classId));
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      instructor: '',
      day: 'Monday',
      startTime: '',
      endTime: '',
      location: '',
      color: COLORS[0],
    });
    setEditingClass(null);
    setIsFormOpen(false);
  };

  const getClassesForDay = (day: string) => {
    return classes
      .filter(c => c.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Class Schedule</h1>
                    <p className="text-gray-600 mt-1">Manage your weekly class schedule</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Class</span>
                </button>
            </div>

            {/* Weekly Schedule Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {DAYS.map((day) => (
                    <div key={day} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4 text-center">{day}</h3>
                        <div className="space-y-2">
                            {getClassesForDay(day).map((classItem) => (
                                <div
                                    key={classItem.id}
                                    className="p-3 rounded-lg border-l-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                    style={{ borderLeftColor: classItem.color }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-sm text-gray-800">{classItem.subject}</h4>
                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() => handleEdit(classItem)}
                                                className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                                            >
                                                <Edit2 className="h-3 w-3" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(classItem.id)}
                                                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1 text-xs text-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <Clock className="h-3 w-3" />
                                            <span>{classItem.startTime} - {classItem.endTime}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <User className="h-3 w-3" />
                                            <span>{classItem.instructor}</span>
                                        </div>
                                        {classItem.location && (
                                            <div className="flex items-center space-x-1">
                                                <MapPin className="h-3 w-3" />
                                                <span>{classItem.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Class Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            {editingClass ? 'Edit Class' : 'Add New Class'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                                <input
                                    type="text"
                                    value={formData.instructor}
                                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                                <select
                                    value={formData.day}
                                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {DAYS.map((day) => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <input
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Room number, building, etc."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                <div className="flex space-x-2">
                                    {COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color })}
                                            className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-gray-600' : 'border-gray-300'
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editingClass ? 'Update Class' : 'Add Class'}
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