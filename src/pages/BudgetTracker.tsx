import { TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { useDeleteBudgetMutation, useGetAllbudgetQuery } from '@/redux/features/budgetTracker/budgetTrackerApi';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Loading from '@/components/ui/Loading';

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

const COLORS = ['#4ade80', '#f87171']; // Income=green, Expense=red

export function BudgetTracker() {
  const { data: budgets, isLoading } = useGetAllbudgetQuery('');

  const [deleteBudget] = useDeleteBudgetMutation()
  if (isLoading) return <Loading/>;
  if (!budgets || !budgets.data) return <p className="text-center">No data available</p>;

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
    <div className="space-y-6 p-4">
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
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <p className="text-sm font-medium text-green-600 mb-1">Total Income</p>
          <p className="text-3xl font-bold text-green-800">${metadata.totalIncome.toFixed(2)}</p>
        </div>

        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <p className="text-sm font-medium text-red-600 mb-1">Total Expenses</p>
          <p className="text-3xl font-bold text-red-800">${metadata.totalExpenses.toFixed(2)}</p>
        </div>

        <div
          className={`${metadata.currentBalance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'
            } rounded-xl p-6 border`}
        >
          <p
            className={`text-sm font-medium mb-1 ${metadata.currentBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}
          >
            Current Balance
          </p>
          <p
            className={`text-3xl font-bold ${metadata.currentBalance >= 0 ? 'text-blue-800' : 'text-orange-800'
              }`}
          >
            ${Math.abs(metadata.currentBalance).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Income vs Expenses</h3>
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
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Category-wise Summary</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }} barSize={20}>
              {/* Grid lines */}
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeWidth={0.2} />

              {/* X Axis */}
              <XAxis
                dataKey="category"
                axisLine={{ stroke: '#d1d5db', strokeWidth: 0.2 }}
                tickLine={{ stroke: '#d1d5db', strokeWidth: 0.2 }}
              />

              {/* Y Axis */}
              <YAxis
                axisLine={{ stroke: '#d1d5db', strokeWidth: 0.2 }}
                tickLine={{ stroke: '#d1d5db', strokeWidth: 0.2 }}
              />

              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="amount" fill="#3b82f6" barSize={20} />
            </BarChart>
          </ResponsiveContainer>



        </div>
      </div>
      <div className="space-y-3">
        {entries.map(entry => (
          <div
            key={entry._id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`p-2 rounded-lg ${entry.budgetType === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}
              >
                {entry.budgetType === 'Income' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">{entry.description || entry.category}</p>
                <p className="text-sm text-gray-600">{entry.category}</p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-1">
              <p
                className={`font-semibold ${entry.budgetType === 'Income' ? 'text-green-600' : 'text-red-600'
                  }`}
              >
                {entry.budgetType === 'Income' ? '+' : '-'}${entry.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
              <button
                onClick={async () => {
                  try {
                    await deleteBudget(entry._id).unwrap();
                  } catch (err) {
                    console.error('Delete failed:', err);
                    alert('Failed to delete entry!');
                  }
                }}
                className="text-red-500 hover:text-red-700 flex items-center space-x-1 text-sm"
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
