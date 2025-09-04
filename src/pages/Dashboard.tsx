import { useState } from 'react';
import { Calendar, DollarSign,Target, TrendingUp, Clock } from 'lucide-react';
import { StatsCard } from '../components/ui/StatsCard';
import { useGetTodayScheduleQuery } from '@/redux/features/classSchedule/classScheduleApi';
import { useGetAllStudyPlannerQuery } from '@/redux/features/studyPlanner/studyPlannerApi';
import { useGetAllbudgetQuery } from '@/redux/features/budgetTracker/budgetTrackerApi';

const Dashboard = () => {
  const {data: todayClass} = useGetTodayScheduleQuery("");
  const {data: studyPlanner} = useGetAllStudyPlannerQuery("");
  const {data: budgetTracker } = useGetAllbudgetQuery("")

  const [stats, setStats] = useState({
    totalClasses: 0,
    todayClasses: 0,
    totalBudget: 0,
    monthlyExpenses: 0,
    activeTasks: 0,
    completedTasks: 0,
    studyHours: 0,
    studyStreak: 0,
  });
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your study overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Today's Classes"
          value={todayClass?.data.length}
          icon={Calendar}
          color="blue"
          subtitle={`${todayClass?.data.length} total classes`}
        />
        <StatsCard
          title="Current Budget"
          value={`$${budgetTracker?.data?.metadata?.currentBalance.toFixed(2)}`}
          icon={DollarSign}
          color="green"
          subtitle={`$${budgetTracker?.data?.metadata?.totalExpenses.toFixed(2)} Total Expenses`}
        />
        <StatsCard
          title="Active Tasks"
          value={studyPlanner?.data?.metadata?.pendingTasks}
          icon={Target}
          color="orange"
          subtitle={`${studyPlanner?.data?.metadata?.completedTasks} completed`}
        />
        <StatsCard
          title="Study Hours"
          value={`${stats.studyHours}h`}
          icon={Clock}
          color="purple"
          subtitle="This week"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Today's Schedule</h3>
            <Calendar className="h-5 w-5 text-gray-500" />
          </div>

          {todayClass?.data.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No classes scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayClass?.data?.map((classItem: any) => (
                <div
                  key={classItem.id}
                  className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: classItem.color }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{classItem.subject}</p>
                    <p className="text-sm text-gray-600">{classItem.instructor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      {classItem.startTime} - {classItem.endTime}
                    </p>
                    <p className="text-xs text-gray-500">{classItem.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Study Progress</h3>
            <TrendingUp className="h-5 w-5 text-gray-500" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 text-white rounded-lg">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Tasks Completed</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
              <p className="text-xl font-bold text-blue-600">{studyPlanner?.data?.metadata?.completedTasks}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 text-white rounded-lg">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Focus Time</p>
                  <p className="text-sm text-gray-600">Total hours</p>
                </div>
              </div>
              <p className="text-xl font-bold text-purple-600">{stats.studyHours}h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Dashboard;