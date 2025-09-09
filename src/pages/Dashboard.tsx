import {
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
  Clock,
  Activity,
} from "lucide-react";
import { StatsCard } from "../components/ui/StatsCard";
import {
  useGetTodayScheduleQuery,
} from "@/redux/features/classSchedule/classScheduleApi";
import {
  useGetAllStudyPlannerQuery,
} from "@/redux/features/studyPlanner/studyPlannerApi";
import {
  useGetAllbudgetQuery,
} from "@/redux/features/budgetTracker/budgetTrackerApi";
import {
  useGetStudySessionQuery,
} from "@/redux/features/studyAssistant/studyAssistantApi";
import StatsCardSkeleton from "@/components/ui/StatsCardSkeleton";


function ScheduleSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse h-16 rounded-lg bg-gray-100 dark:bg-slate-700"
        ></div>
      ))}
    </div>
  );
}

function StudyProgressSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse h-20 rounded-lg bg-gray-100 dark:bg-slate-700"
        ></div>
      ))}
    </div>
  );
}

const Dashboard = () => {
  const { data: todayClass, isLoading: isClassLoading } =
    useGetTodayScheduleQuery("");
  const { data: studyPlanner, isLoading: isPlannerLoading } =
    useGetAllStudyPlannerQuery("");
  const { data: budgetTracker, isLoading: isBudgetLoading } =
    useGetAllbudgetQuery("");
  const { data: metadatas, isLoading: isStudyLoading } =
    useGetStudySessionQuery("");

  const metadata = metadatas?.data?.metadata;

  const isLoading =
    isClassLoading || isPlannerLoading || isBudgetLoading || isStudyLoading;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's your study overview.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="Today's Classes"
              value={todayClass?.data.length}
              icon={Calendar}
              color="blue"
              subtitle={`${todayClass?.data.length} total classes`}
            />
            <StatsCard
              title="Current Budget"
              value={`$${budgetTracker?.data?.metadata?.currentBalance.toFixed(
                2
              )}`}
              icon={DollarSign}
              color="green"
              subtitle={`$${budgetTracker?.data?.metadata?.totalExpenses.toFixed(
                2
              )} Total Expenses`}
            />
            <StatsCard
              title="Active Tasks"
              value={studyPlanner?.data?.metadata?.pendingTasks}
              icon={Target}
              color="orange"
              subtitle={`${studyPlanner?.data?.metadata?.completedTasks} completed`}
            />
            <StatsCard
              title="Week Focus Time"
              value={metadata?.weekFocusTimeFormatted ?? 0}
              icon={Activity}
              color="red"
              subtitle="time"
            />
          </>
        )}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Schedule */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Today's Schedule
            </h3>
            <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>

          {isClassLoading ? (
            <ScheduleSkeleton />
          ) : todayClass?.data.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No classes scheduled for today
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayClass?.data?.map((classItem: any) => (
                <div
                  key={classItem.id}
                  className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: classItem.color }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      {classItem.subject}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {classItem.instructor}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {classItem.startTime} - {classItem.endTime}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {classItem.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Study Progress */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Study Progress
            </h3>
            <TrendingUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>

          {isPlannerLoading || isStudyLoading ? (
            <StudyProgressSkeleton />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500 text-white rounded-lg">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      Tasks Completed
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total
                    </p>
                  </div>
                </div>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {studyPlanner?.data?.metadata?.completedTasks}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500 text-white rounded-lg">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      Today Focus Time
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total hours
                    </p>
                  </div>
                </div>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {metadata?.todayFocusTimeFormatted}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
