import { TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { useGetAllbudgetQuery } from '@/redux/features/budgetTracker/classScheduleApi';

// --- Types ---
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

// --- Component ---
export function BudgetTracker() {
  const { data: budgets, isLoading } = useGetAllbudgetQuery('');

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (!budgets || !budgets.data) return <p className="text-center">No data available</p>;

  const entries: BudgetEntry[] = budgets.data.data;
  const metadata: BudgetMetadata = budgets.data.metadata;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Budget Tracker</h1>
          <p className="text-gray-600 mt-1">Track your income and expenses</p>
        </div>
        <Link
          to="/dashboard/add-schedule"
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Budget</span>
        </Link>
      </div>

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
          className={`${
            metadata.currentBalance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'
          } rounded-xl p-6 border`}
        >
          <p
            className={`text-sm font-medium mb-1 ${
              metadata.currentBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
            }`}
          >
            Current Balance
          </p>
          <p
            className={`text-3xl font-bold ${
              metadata.currentBalance >= 0 ? 'text-blue-800' : 'text-orange-800'
            }`}
          >
            ${Math.abs(metadata.currentBalance).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Entries</h3>
        <div className="space-y-3">
          {entries.map(entry => (
            <div
              key={entry._id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-lg ${
                    entry.budgetType === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
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
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    entry.budgetType === 'Income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {entry.budgetType === 'Income' ? '+' : '-'}${entry.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
