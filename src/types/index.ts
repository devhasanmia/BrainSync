export interface Class {
  id: string;
  subject: string;
  instructor: string;
  day: string;
  startTime: string;
  endTime: string;
  location?: string;
  color: string;
  created_at?: string;
  user_id?: string;
}

export interface BudgetEntry {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  created_at?: string;
  user_id?: string;
}

export interface Question {
  id: string;
  type: 'mcq' | 'short' | 'truefalse';
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  created_at?: string;
  user_id?: string;
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  completed: boolean;
  estimatedHours?: number;
  created_at?: string;
  user_id?: string;
}

export interface StudySession {
  id: string;
  taskId?: string;
  subject: string;
  duration: number; // in minutes
  type: 'focus' | 'break';
  completedAt: string;
  created_at?: string;
  user_id?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at?: string;
}