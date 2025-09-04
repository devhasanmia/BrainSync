import { useState, useEffect, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Target,
  Clock,
  Flame,
  CalendarDays,
  ListTodo,
  Hourglass,
  Coffee,
  LineChart, // New icon for chart
} from "lucide-react";
import { toast } from "sonner";
import { useGetStudySessionQuery } from "@/redux/features/studyAssistant/studyAssistantApi";

// Chart.js imports
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StudyTask {
  id: string;
  title: string;
  completed?: boolean;
}

interface StudySession {
  _id: string;
  userId: string;
  studyTask: string;
  duration: number; // minutes
  type: "focus" | "break";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface StudyMetadata {
  totalSessions: number;
  totalFocusTime: number; // in minutes
  totalBreakTime: number; // in minutes
  todayFocusTime: number; // in minutes
  weekFocusTime: number; // in minutes
  monthFocusTime: number; // in minutes
}

export function StudyAssistant() {
  const {
    data: studySessionData,
    isLoading,
    isError,
  } = useGetStudySessionQuery("");

  const fakeTasks: StudyTask[] = [
    { id: "1", title: "Math Homework" },
    { id: "2", title: "Read History Chapter 5" },
    { id: "3", title: "Biology Flashcards" },
    { id: "4", title: "Physics Problem Set" },
  ];

  const [tasks] = useState<StudyTask[]>(fakeTasks);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [currentMode, setCurrentMode] = useState<"focus" | "break">("focus");
  const [sessionCount, setSessionCount] = useState(0);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const [customFocusTime, setCustomFocusTime] = useState(25);
  const [customBreakTime, setCustomBreakTime] = useState(5);
  const [longBreakTime] = useState(15);
  const [sessionsUntilLongBreak] = useState(4);

  const [metadata, setMetadata] = useState<StudyMetadata>({
    totalSessions: 0,
    totalFocusTime: 0,
    totalBreakTime: 0,
    todayFocusTime: 0,
    weekFocusTime: 0,
    monthFocusTime: 0,
  });

  useEffect(() => {
    setTimeLeft(customFocusTime * 60);
  }, [customFocusTime]);

  useEffect(() => {
    if (studySessionData?.data?.data && studySessionData.data.data.length > 0) {
      const apiSessions: StudySession[] = studySessionData.data.data.map(
        (session: any) => ({
          _id: session._id,
          userId: session.userId,
          studyTask: session.studyTask,
          duration: session.duration,
          type: session.type,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
          __v: session.__v,
        })
      );
      setSessions((prevSessions) => {
        const newApiSessions = apiSessions.filter(
          (apiSession) =>
            !prevSessions.some(
              (prevSession) => prevSession._id === apiSession._id
            )
        );
        return [...prevSessions, ...newApiSessions];
      });
    }

    if (studySessionData?.data?.metadata) {
      setMetadata(studySessionData.data.metadata);
    }
  }, [studySessionData]);

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
      _id: Math.random().toString(36).slice(2),
      userId: "local_user_id",
      studyTask: selectedTask || "General Study",
      duration: currentMode === "focus" ? customFocusTime : customBreakTime,
      type: currentMode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };

    setSessions((prev) => [sessionData, ...prev]);

    setMetadata((prevMetadata) => ({
      ...prevMetadata,
      totalSessions: prevMetadata.totalSessions + 1,
      totalFocusTime:
        prevMetadata.totalFocusTime +
        (currentMode === "focus" ? customFocusTime : 0),
      totalBreakTime:
        prevMetadata.totalBreakTime +
        (currentMode === "break" ? customBreakTime : 0),
      todayFocusTime:
        prevMetadata.todayFocusTime +
        (currentMode === "focus" ? customFocusTime : 0),
      weekFocusTime:
        prevMetadata.weekFocusTime +
        (currentMode === "focus" ? customFocusTime : 0), // Assuming weekFocusTime also updates
      monthFocusTime:
        prevMetadata.monthFocusTime +
        (currentMode === "focus" ? customFocusTime : 0), // Assuming monthFocusTime also updates
    }));

    if (currentMode === "focus") {
      const newSessionCount = sessionCount + 1;
      setSessionCount(newSessionCount);

      if (newSessionCount % sessionsUntilLongBreak === 0) {
        setCurrentMode("break");
        setTimeLeft(longBreakTime * 60);
        toast.success("Focus session complete! Time for a long break!");
      } else {
        setCurrentMode("break");
        setTimeLeft(customBreakTime * 60);
        toast.success("Focus session complete! Take a short break!");
      }
    } else {
      setCurrentMode("focus");
      setTimeLeft(customFocusTime * 60);
      toast.success("Break over! Back to focus!");
    }
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () =>
    setTimeLeft(
      currentMode === "focus" ? customFocusTime * 60 : customBreakTime * 60
    );

  const switchMode = (mode: "focus" | "break") => {
    setIsRunning(false);
    setCurrentMode(mode);
    setTimeLeft(mode === "focus" ? customFocusTime * 60 : customBreakTime * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatMinutesToHoursAndMinutes = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const today = new Date().toDateString();
  const todaySessions = sessions.filter(
    (s) => new Date(s.createdAt).toDateString() === today
  );

  // --- Chart Data Calculation ---
  const chartData = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Go back 6 days to include today

    const dailyFocusTime: { [key: string]: number } = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      dailyFocusTime[date.toDateString()] = 0;
    }

    sessions.forEach((session) => {
      if (session.type === "focus") {
        const sessionDate = new Date(session.createdAt).toDateString();
        if (dailyFocusTime.hasOwnProperty(sessionDate)) {
          dailyFocusTime[sessionDate] += session.duration;
        }
      }
    });

    const labels = Object.keys(dailyFocusTime).map((dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    });
    const data = Object.values(dailyFocusTime);

    return {
      labels,
      datasets: [
        {
          label: "Focus Time (minutes)",
          data,
          backgroundColor: "rgba(99, 102, 241, 0.6)", // Indigo color
          borderColor: "rgba(99, 102, 241, 1)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [sessions]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 14,
            family: "Inter, sans-serif",
          },
        },
      },
      title: {
        display: true,
        text: "Last 7 Days Focus Time",
        font: {
          size: 18,
          family: "Inter, sans-serif",
          weight: "bold",
        },
        color: "#333",
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += formatMinutesToHoursAndMinutes(context.parsed.y);
            }
            return label;
          },
        },
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "Inter, sans-serif",
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Focus Time (minutes)",
          font: {
            size: 14,
            family: "Inter, sans-serif",
            weight: "bold",
          },
          color: "#555",
        },
        ticks: {
          callback: function (value: string | number) {
            return formatMinutesToHoursAndMinutes(Number(value));
          },
          font: {
            size: 12,
            family: "Inter, sans-serif",
          },
        },
        grid: {
          color: "#f0f0f0",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {" "}
      {/* Full width container */}
      <div className="max-w-7xl mx-auto space-y-8">
        {" "}
        {/* Inner max-width container */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Smart Study Assistant
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Boost your productivity with focused study sessions.
            </p>
          </div>
        </div>
        {/* Study Overview (Metadata) - Top Grid */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Your Study Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Total Sessions */}
            <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <ListTodo className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-xl font-semibold text-blue-800">
                {metadata.totalSessions}
              </p>
            </div>

            {/* Total Focus Time */}
            <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <Hourglass className="h-8 w-8 text-purple-600 mb-2" />
              <p className="text-sm text-gray-600">Overall Focus</p>
              <p className="text-xl font-semibold text-purple-800">
                {formatMinutesToHoursAndMinutes(metadata.totalFocusTime)}
              </p>
            </div>

            {/* Total Break Time */}
            <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <Coffee className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-sm text-gray-600">Overall Break</p>
              <p className="text-xl font-semibold text-green-800">
                {formatMinutesToHoursAndMinutes(metadata.totalBreakTime)}
              </p>
            </div>

            {/* Today's Focus Time */}
            <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <Flame className="h-8 w-8 text-yellow-600 mb-2" />
              <p className="text-sm text-gray-600">Today's Focus</p>
              <p className="text-xl font-semibold text-yellow-800">
                {formatMinutesToHoursAndMinutes(metadata.todayFocusTime)}
              </p>
            </div>

            {/* This Week's Focus Time */}
            <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <CalendarDays className="h-8 w-8 text-red-600 mb-2" />
              <p className="text-sm text-gray-600">This Week's Focus</p>
              <p className="text-xl font-semibold text-red-800">
                {formatMinutesToHoursAndMinutes(metadata.weekFocusTime)}
              </p>
            </div>

            {/* This Month's Focus Time */}
            <div className="flex flex-col items-center justify-center p-4 bg-teal-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <CalendarDays className="h-8 w-8 text-teal-600 mb-2" />
              <p className="text-sm text-gray-600">This Month's Focus</p>
              <p className="text-xl font-semibold text-teal-800">
                {formatMinutesToHoursAndMinutes(metadata.monthFocusTime)}
              </p>
            </div>
          </div>
        </div>
        {/* Timer Section - Below Overview */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg flex flex-col lg:flex-row gap-8 items-center justify-around">
          <div className="text-center flex-shrink-0">
            {/* Mode Buttons */}
            <div className="flex justify-center space-x-2 mb-4">
              <button
                onClick={() => switchMode("focus")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  currentMode === "focus"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Focus Time
              </button>
              <button
                onClick={() => switchMode("break")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  currentMode === "break"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Break Time
              </button>
            </div>

            {/* Timer Display */}
            <div
              className={`w-48 h-48 mx-auto rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
                currentMode === "focus"
                  ? "border-blue-300 bg-blue-50"
                  : "border-green-300 bg-green-50"
              }`}
            >
              <div className="text-center">
                <div
                  className={`text-6xl font-extrabold ${
                    currentMode === "focus" ? "text-blue-700" : "text-green-700"
                  }`}
                >
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-3 mt-6">
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    currentMode === "focus"
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                      : "bg-green-600 hover:bg-green-700 text-white shadow-md"
                  }`}
                >
                  <Play className="h-5 w-5" />
                  <span>Start</span>
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-all duration-300 font-semibold shadow-md"
                >
                  <Pause className="h-5 w-5" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={resetTimer}
                className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-300 transition-all duration-300 font-semibold"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Custom Time & Task Selection */}
          <div className="mt-6 lg:mt-0 space-y-4 w-full lg:w-1/2">
            <h4 className="text-lg font-bold text-gray-800 mb-3 text-center lg:text-left">
              Settings
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="focus-time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Focus (min)
                </label>
                <input
                  type="number"
                  id="focus-time"
                  value={customFocusTime}
                  onChange={(e) =>
                    setCustomFocusTime(Math.max(1, parseInt(e.target.value)))
                  }
                  min="1"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="break-time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Break (min)
                </label>
                <input
                  type="number"
                  id="break-time"
                  value={customBreakTime}
                  onChange={(e) =>
                    setCustomBreakTime(Math.max(1, parseInt(e.target.value)))
                  }
                  min="1"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                />
              </div>
              {currentMode === "focus" && (
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Task (Optional)
                  </label>
                  <select
                    value={selectedTask || ""}
                    onChange={(e) => setSelectedTask(e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm"
                  >
                    <option value="">No Specific Task</option>
                    {tasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Chart Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <LineChart className="h-7 w-7 text-indigo-600" />
            Study Progress
          </h3>
          <div className="h-80">
            {" "}
            {/* Fixed height for the chart */}
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
        {/* Recent Sessions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-5">
            Today’s Sessions
          </h3>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading sessions...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error loading sessions.</p>
            </div>
          ) : todaySessions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No sessions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySessions.map((session) => (
                <div
                  key={session._id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-full ${
                        session.type === "focus"
                          ? "bg-blue-200 text-blue-700"
                          : "bg-green-200 text-green-700"
                      }`}
                    >
                      {session.type === "focus" ? (
                        <Target className="h-5 w-5" />
                      ) : (
                        <Coffee className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {session.type === "focus"
                          ? "Focus Session"
                          : "Break Time"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.studyTask
                          ? tasks.find((t) => t.title === session.studyTask)
                              ?.title
                          : "General Study"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-md font-semibold text-gray-800">
                      {session.duration} min
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(session.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
