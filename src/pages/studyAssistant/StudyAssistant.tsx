import { StatsCard } from "@/components/ui/StatsCard";
import StatsCardSkeleton from "@/components/ui/StatsCardSkeleton";
import { useGetStudySessionQuery } from "@/redux/features/studyAssistant/studyAssistantApi";
import { Calendar, Clock, Coffee, Activity } from "lucide-react";
import PomodoroSetting from "./PomodoroSetting";

const StudyAssistant = () => {
  const { data: metadatas, isLoading } = useGetStudySessionQuery("");
  const metadata = metadatas?.data?.metadata;
  const sessions = metadatas?.data?.data || [];

  return (
    <div className="p-6 space-y-10">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <StatsCardSkeleton key={idx} />
          ))
        ) : (
          <>
            <StatsCard
              title="Total Sessions"
              value={metadata?.totalSessions ?? 0}
              icon={Calendar}
              color="blue"
              subtitle="count"
            />
            <StatsCard
              title="Total Focus Time"
              value={metadata?.totalFocusTimeFormatted ?? "0h 0m"}
              icon={Clock}
              color="green"
              subtitle="time"
            />
            <StatsCard
              title="Total Break Time"
              value={metadata?.totalBreakTimeFormatted ?? "0h 0m"}
              icon={Coffee}
              color="purple"
              subtitle="time"
            />
            <StatsCard
              title="Today's Focus Time"
              value={metadata?.todayFocusTimeFormatted ?? "0h 0m"}
              icon={Clock}
              color="teal"
              subtitle="time"
            />
            <StatsCard
              title="Week Focus Time"
              value={metadata?.weekFocusTimeFormatted ?? "0h 0m"}
              icon={Activity}
              color="red"
              subtitle="time"
            />
            <StatsCard
              title="Month Focus Time"
              value={metadata?.monthFocusTimeFormatted ?? "0h 0m"}
              icon={Activity}
              color="orange"
              subtitle="time"
            />
          </>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Pomodoro Timer + Features */}
        <PomodoroSetting metadata={metadata} />

        {/* Right Column: Today's Study History */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md max-h-[600px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
            Today's Study History
          </h2>
          {isLoading ? (
            <ul className="space-y-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center p-4 bg-gray-100 dark:bg-slate-700 rounded-lg animate-pulse"
                >
                  <div className="space-y-2 w-full">
                    <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-slate-600 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 w-10 bg-gray-300 dark:bg-slate-600 rounded"></div>
                </li>
              ))}
            </ul>
          ) : sessions.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No sessions today
            </p>
          ) : (
            <ul className="space-y-4">
              {sessions.map((session: any) => (
                <li
                  key={session._id}
                  className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.studyTask}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {session.type}
                    </p>
                  </div>
                  <div className="text-right text-gray-900 dark:text-white">
                    <p className="font-semibold">{session.duration} min</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyAssistant;
