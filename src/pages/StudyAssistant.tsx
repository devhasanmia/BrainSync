import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Target,
  Clock,
  Flame,
} from "lucide-react";
import { toast } from "sonner";

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
  type: "focus" | "break";
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
    { id: "1", title: "Math Homework", subject: "Math" },
    { id: "2", title: "Read History Chapter 5", subject: "History" },
    { id: "3", title: "Biology Flashcards", subject: "Biology" },
    { id: "4", title: "Physics Problem Set", subject: "Physics" },
  ];

  const [tasks] = useState<StudyTask[]>(fakeTasks);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 min
  const [currentMode, setCurrentMode] = useState<"focus" | "break">("focus");
  const [sessionCount, setSessionCount] = useState(0);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const [pomodoroSettings] = useState<PomodoroSettings>({
    focusTime: 1,
    breakTime: 5,
    longBreakTime: 15,
    sessionsUntilLongBreak: 4,
  });

  // Timer effect
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
        ? tasks.find((t) => t.id === selectedTask)?.subject || "General"
        : "General",
      duration:
        currentMode === "focus"
          ? pomodoroSettings.focusTime
          : pomodoroSettings.breakTime,
      type: currentMode,
      completedAt: new Date().toISOString(),
    };

    setSessions((prev) => [sessionData, ...prev]);

    if (currentMode === "focus") {
      const newSessionCount = sessionCount + 1;
      setSessionCount(newSessionCount);

      if (newSessionCount % pomodoroSettings.sessionsUntilLongBreak === 0) {
        setCurrentMode("break");
        setTimeLeft(pomodoroSettings.longBreakTime * 60);
        toast.success("Focus session complete! Time for a long break!");
      } else {
        setCurrentMode("break");
        setTimeLeft(pomodoroSettings.breakTime * 60);
        toast.success("Focus session complete! Take a short break!");
      }
    } else {
      setCurrentMode("focus");
      setTimeLeft(pomodoroSettings.focusTime * 60);
      toast.success("Break over! Back to focus!");
    }
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () =>
    setTimeLeft(
      currentMode === "focus"
        ? pomodoroSettings.focusTime * 60
        : pomodoroSettings.breakTime * 60
    );

  const switchMode = (mode: "focus" | "break") => {
    setIsRunning(false);
    setCurrentMode(mode);
    setTimeLeft(
      mode === "focus"
        ? pomodoroSettings.focusTime * 60
        : pomodoroSettings.breakTime * 60
    );
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Calculate total focus time today
  const today = new Date().toDateString();
  const todaySessions = sessions.filter(
    (s) => new Date(s.completedAt).toDateString() === today
  );
  const totalMinutesToday = todaySessions
    .filter((s) => s.type === "focus")
    .reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Smart Study Assistant
          </h1>
          <p className="text-gray-600 mt-1">
            Pomodoro timer with progress tracking and daily summary
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm col-span-2">
          <div className="text-center">
            {/* Mode Buttons */}
            <div className="flex justify-center space-x-2 mb-4">
              <button
                onClick={() => switchMode("focus")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentMode === "focus"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Focus
              </button>
              <button
                onClick={() => switchMode("break")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentMode === "break"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Break
              </button>
            </div>

            {/* Timer Circle */}
            <div
              className={`w-48 h-48 mx-auto rounded-full flex items-center justify-center border-8 transition-colors ${
                currentMode === "focus"
                  ? "border-blue-200 bg-blue-50"
                  : "border-green-200 bg-green-50"
              }`}
            >
              <div className="text-center">
                <div
                  className={`text-4xl font-bold mb-2 ${
                    currentMode === "focus" ? "text-blue-600" : "text-green-600"
                  }`}
                >
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {currentMode === "focus" ? "Focus Time" : "Break Time"}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4 mt-6">
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    currentMode === "focus"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
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

            {/* Task Select */}
            {currentMode === "focus" && (
              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Study Task (Optional)
                </label>
                <select
                  value={selectedTask || ""}
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

        {/* Daily Summary */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col items-center justify-center">
          <Flame className="h-10 w-10 text-red-500 mb-2" />
          <p className="text-lg font-semibold text-gray-800">Today’s Study</p>
          <p className="text-2xl font-bold text-blue-600">
            {Math.floor(totalMinutesToday / 60)}h {totalMinutesToday % 60}m
          </p>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Today’s Sessions
        </h3>
        {todaySessions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No sessions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaySessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      session.type === "focus"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {session.type === "focus" ? (
                      <Target className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {session.type === "focus"
                        ? "Focus Session"
                        : "Break Time"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {session.subject}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {session.duration} min
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(session.completedAt).toLocaleTimeString()}
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
