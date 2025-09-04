import { TrendingUp, TrendingDown, Plus, Trash2, Activity } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { useDeleteBudgetMutation, useGetAllbudgetQuery } from '@/redux/features/budgetTracker/budgetTrackerApi';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Loading from '@/components/ui/Loading';
import { StatsCard } from '@/components/ui/StatsCard';

interface BudgetEntry {
  _id: string;
  user: string;
  budgetType: 'Income' | 'Expense';
  category: string;
  amount: number;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface BudgetMetadata {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  totalEntries: number;
}

const COLORS = ['#4ade80', '#f87171']; 

export function BudgetTracker() {
  const { data: budgets, isLoading } = useGetAllbudgetQuery('');
  const [deleteBudget] = useDeleteBudgetMutation();

  if (isLoading) return <Loading/>;
  if (!budgets || !budgets.data) return <p className="text-center text-gray-500 dark:text-gray-400">No data available</p>;

  const entries: BudgetEntry[] = budgets.data.data;
  const metadata: BudgetMetadata = budgets.data.metadata;

  // Pie Chart Data
  const pieData = [
    { name: 'Income', value: metadata.totalIncome },
    { name: 'Expenses', value: metadata.totalExpenses },
  ];

  // Bar Chart Data: Category-wise sum
  const categoryMap: Record<string, number> = {};
  entries.forEach(entry => {
    if (!categoryMap[entry.category]) categoryMap[entry.category] = 0;
    categoryMap[entry.category] += entry.amount;
  });

  const barData = Object.keys(categoryMap).map(cat => ({
    category: cat,
    amount: categoryMap[cat],
  }));

  return (
    <div className="space-y-6 p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <PageHeader
        title="Budget Tracker"
        subtitle="Track your income and expenses"
        buttonText="Add Budget"
        buttonLink="/dashboard/add-budget"
        icon={Plus}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Income"
          value={`$${metadata.totalIncome.toFixed(2)}`}
          icon={Activity}
          color="green"
          subtitle="Income"
        />
        <StatsCard
          title="Total Expenses"
          value={`$${metadata.totalExpenses.toFixed(2)}`}
          icon={Activity}
          color="red"
          subtitle="Expenses"
        />
        <StatsCard
          title="Current Balance"
          value={`$${metadata.currentBalance.toFixed(2)}`}
          icon={Activity}
          color={metadata.currentBalance >= 0 ? 'blue' : 'orange'}
          subtitle="Balance"
        />
      </div>

      {/* Charts Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Category-wise Summary</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeWidth={0.2} />
              <XAxis dataKey="category" axisLine={{ stroke: '#d1d5db', strokeWidth: 0.2 }} tickLine={{ stroke: '#d1d5db', strokeWidth: 0.2 }} />
              <YAxis axisLine={{ stroke: '#d1d5db', strokeWidth: 0.2 }} tickLine={{ stroke: '#d1d5db', strokeWidth: 0.2 }} />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="amount" fill="#3b82f6" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Entries List */}
      <div className="space-y-3">
        {entries.map(entry => (
          <div
            key={entry._id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${entry.budgetType === 'Income' ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-400'}`}>
                {entry.budgetType === 'Income' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </div>
              <div>
                <p className="font-medium">{entry.description || entry.category}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{entry.category}</p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-1">
              <p className={`font-semibold ${entry.budgetType === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {entry.budgetType === 'Income' ? '+' : '-'}${entry.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(entry.date).toLocaleDateString()}</p>
              <button
                onClick={async () => {
                  try {
                    await deleteBudget(entry._id).unwrap();
                  } catch (err) {
                    console.error('Delete failed:', err);
                    alert('Failed to delete entry!');
                  }
                }}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 flex items-center space-x-1 text-sm"
              >
                <Trash2 className="h-4 w-4" /> <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
