import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Target,
  TrendingUp,
  Clock,
  Flame,
  Award,
} from 'lucide-react';

interface StudyTask {
  id: string;
  title: string;
  subject: string;
  completed?: boolean;
}

interface StudySession {
  id: string;
  taskId?: string | null;
  subject: string;
  duration: number; // minutes
  type: 'focus' | 'break';
  completedAt: string;
}

interface PomodoroSettings {
  focusTime: number;
  breakTime: number;
  longBreakTime: number;
  sessionsUntilLongBreak: number;
}

export function StudyAssistant() {
  // Fake/mock tasks
  const fakeTasks: StudyTask[] = [
    { id: '1', title: 'Math Homework', subject: 'Math' },
    { id: '2', title: 'Read History Chapter 5', subject: 'History' },
    { id: '3', title: 'Biology Flashcards', subject: 'Biology' },
    { id: '4', title: 'Physics Problem Set', subject: 'Physics' },
    { id: '5', title: 'English Essay Draft', subject: 'English' },
    { id: '6', title: 'Chemistry Lab Report', subject: 'Chemistry' },
    { id: '7', title: 'Computer Science Project', subject: 'CS' },
  ];

  // Helper to create sessions on different days
  const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

  const fakeSessions: StudySession[] = [
    {
      id: 's1',
      taskId: '1',
      subject: 'Math',
      duration: 25,
      type: 'focus',
      completedAt: new Date().toISOString(),
    },
    {
      id: 's2',
      subject: 'General',
      duration: 5,
      type: 'break',
      completedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: 's3',
      taskId: '2',
      subject: 'History',
      duration: 25,
      type: 'focus',
      completedAt: daysAgo(1).toISOString(),
    },
    {
      id: 's4',
      taskId: '3',
      subject: 'Biology',
      duration: 25,
      type: 'focus',
      completedAt: daysAgo(1).toISOString(),
    },
    {
      id: 's5',
      subject: 'General',
      duration: 15,
      type: 'break',
      completedAt: daysAgo(1).toISOString(),
    },
    {
      id: 's6',
      taskId: '4',
      subject: 'Physics',
      duration: 50,
      type: 'focus',
      completedAt: daysAgo(2).toISOString(),
    },
    {
      id: 's7',
      taskId: '5',
      subject: 'English',
      duration: 25,
      type: 'focus',
      completedAt: daysAgo(3).toISOString(),
    },
    {
      id: 's8',
      subject: 'General',
      duration: 10,
      type: 'break',
      completedAt: daysAgo(3).toISOString(),
    },
    {
      id: 's9',
      taskId: '6',
      subject: 'Chemistry',
      duration: 40,
      type: 'focus',
      completedAt: daysAgo(5).toISOString(),
    },
    {
      id: 's10',
      taskId: '7',
      subject: 'CS',
      duration: 60,
      type: 'focus',
      completedAt: daysAgo(6).toISOString(),
    },
  ];

  const [tasks] = useState<StudyTask[]>(fakeTasks);
  const [sessions, setSessions] = useState<StudySession[]>(fakeSessions);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [currentMode, setCurrentMode] = useState<'focus' | 'break'>('focus');
  const [sessionCount, setSessionCount] = useState(0);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const [pomodoroSettings] = useState<PomodoroSettings>({
    focusTime: 25,
    breakTime: 5,
    longBreakTime: 15,
    sessionsUntilLongBreak: 4,
  });

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);

    const sessionData: StudySession = {
      id: Math.random().toString(36).slice(2),
      taskId: selectedTask,
      subject: selectedTask
        ? tasks.find((t) => t.id === selectedTask)?.subject || 'General'
        : 'General',
      duration:
        currentMode === 'focus'
          ? pomodoroSettings.focusTime
          : pomodoroSettings.breakTime,
      type: currentMode,
      completedAt: new Date().toISOString(),
    };

    setSessions((prev) => [sessionData, ...prev]);

    if (currentMode === 'focus') {
      const newSessionCount = sessionCount + 1;
      setSessionCount(newSessionCount);

      if (newSessionCount % pomodoroSettings.sessionsUntilLongBreak === 0) {
        setCurrentMode('break');
        setTimeLeft(pomodoroSettings.longBreakTime * 60);
        toast.success('Focus session complete! Time for a long break!', {
          duration: 3000,
        });
      } else {
        setCurrentMode('break');
        setTimeLeft(pomodoroSettings.breakTime * 60);
        toast.success('Focus session complete! Take a short break!', {
          duration: 3000,
        });
      }
    } else {
      setCurrentMode('focus');
      setTimeLeft(pomodoroSettings.focusTime * 60);
      toast.success('Break over! Back to focus!', { duration: 3000 });
    }
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () =>
    setTimeLeft(
      currentMode === 'focus'
        ? pomodoroSettings.focusTime * 60
        : pomodoroSettings.breakTime * 60
    );

  const switchMode = (mode: 'focus' | 'break') => {
    setIsRunning(false);
    setCurrentMode(mode);
    setTimeLeft(
      mode === 'focus'
        ? pomodoroSettings.focusTime * 60
        : pomodoroSettings.breakTime * 60
    );
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  // Stats helpers
  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(
      (s) =>
        new Date(s.completedAt).toDateString() === today && s.type === 'focus'
    );
    return {
      focusTime: todaySessions.reduce((sum, s) => sum + s.duration, 0),
      sessionCount: todaySessions.length,
    };
  };

  const getWeeklyStats = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklySessions = sessions.filter(
      (s) => new Date(s.completedAt) >= weekAgo && s.type === 'focus'
    );
    const focusTime = weeklySessions.reduce((sum, s) => sum + s.duration, 0);
    return Math.round((focusTime / 60) * 10) / 10; // in hours
  };

  const getStreak = () => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const hasSession = sessions.some(
        (s) =>
          new Date(s.completedAt).toDateString() ===
            checkDate.toDateString() && s.type === 'focus'
      );
      if (hasSession) streak++;
      else break;
    }
    return streak;
  };

  const todayStats = getTodayStats();
  const weeklyHours = getWeeklyStats();
  const currentStreak = getStreak();

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Smart Study Assistant</h1>
                <p className="text-gray-600 mt-1">Pomodoro timer with progress tracking and analytics</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pomodoro Timer */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <div className="text-center">
                    <div className="mb-6">
                        <div className="flex justify-center space-x-2 mb-4">
                            <button
                                onClick={() => switchMode('focus')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentMode === 'focus'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Focus
                            </button>
                            <button
                                onClick={() => switchMode('break')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentMode === 'break'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Break
                            </button>
                        </div>

                        <div className={`w-48 h-48 mx-auto rounded-full flex items-center justify-center border-8 transition-colors ${currentMode === 'focus'
                                ? 'border-blue-200 bg-blue-50'
                                : 'border-green-200 bg-green-50'
                            }`}>
                            <div className="text-center">
                                <div className={`text-4xl font-bold mb-2 ${currentMode === 'focus' ? 'text-blue-600' : 'text-green-600'
                                    }`}>
                                    {formatTime(timeLeft)}
                                </div>
                                <div className="text-sm font-medium text-gray-600">
                                    {currentMode === 'focus' ? 'Focus Time' : 'Break Time'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4 mb-6">
                        {!isRunning ? (
                            <button
                                onClick={startTimer}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${currentMode === 'focus'
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                            >
                                <Play className="h-5 w-5" />
                                <span>Start</span>
                            </button>
                        ) : (
                            <button
                                onClick={pauseTimer}
                                className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                            >
                                <Pause className="h-5 w-5" />
                                <span>Pause</span>
                            </button>
                        )}

                        <button
                            onClick={resetTimer}
                            className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            <RotateCcw className="h-5 w-5" />
                            <span>Reset</span>
                        </button>
                    </div>

                    {currentMode === 'focus' && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Study Task (Optional)
                            </label>
                            <select
                                value={selectedTask || ''}
                                onChange={(e) => setSelectedTask(e.target.value || null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                <option value="">General Study</option>
                                {tasks.map((task) => (
                                    <option key={task.id} value={task.id}>
                                        {task.title} ({task.subject})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Study Stats */}
            <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Progress</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <div className="p-3 bg-blue-100 rounded-lg inline-flex mb-2">
                                <Target className="h-6 w-6 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-800">{todayStats.sessionCount}</p>
                            <p className="text-sm text-gray-600">Sessions</p>
                        </div>
                        <div className="text-center">
                            <div className="p-3 bg-purple-100 rounded-lg inline-flex mb-2">
                                <Clock className="h-6 w-6 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-800">{todayStats.focusTime}</p>
                            <p className="text-sm text-gray-600">Minutes</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="p-2 bg-teal-100 rounded-lg">
                                <TrendingUp className="h-4 w-4 text-teal-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Weekly Hours</p>
                                <p className="text-xl font-bold text-gray-800">{weeklyHours}h</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Flame className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Study Streak</p>
                                <p className="text-xl font-bold text-gray-800">{currentStreak} days</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <span>Achievements</span>
                    </h3>
                    <div className="space-y-2">
                        {todayStats.sessionCount >= 1 && (
                            <div className="flex items-center space-x-2 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-gray-700">First session of the day! 🎯</span>
                            </div>
                        )}
                        {todayStats.sessionCount >= 4 && (
                            <div className="flex items-center space-x-2 text-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-700">Productivity champion! 🏆</span>
                            </div>
                        )}
                        {currentStreak >= 7 && (
                            <div className="flex items-center space-x-2 text-sm">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span className="text-gray-700">Week-long streak! 🔥</span>
                            </div>
                        )}
                        {weeklyHours >= 10 && (
                            <div className="flex items-center space-x-2 text-sm">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-gray-700">Study master! ⭐</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Study Sessions</h3>
            {sessions.slice(0, 10).length === 0 ? (
                <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No study sessions yet</p>
                    <p className="text-sm text-gray-400">Start your first Pomodoro session above!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sessions.slice(0, 10).map((session) => (
                        <div
                            key={session.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${session.type === 'focus' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                    {session.type === 'focus' ? <Target className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {session.type === 'focus' ? 'Focus Session' : 'Break Time'}
                                    </p>
                                    <p className="text-sm text-gray-600">{session.subject}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-800">{session.duration} min</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(session.completedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);
}