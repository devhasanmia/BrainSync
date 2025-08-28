import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// import toast from 'react-hot-toast';
import type { BudgetEntry } from '../types';

// --- Constants ----------------------------------------------------
const INCOME_CATEGORIES = ['Allowance', 'Part-time Job', 'Scholarship', 'Freelance', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Books', 'Entertainment', 'Accommodation', 'Healthcare', 'Other'];
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316'];

// --- Demo Data ---------------------------------------------------
const DEMO_ENTRIES: BudgetEntry[] = [
  { id: '1', type: 'income', category: 'Scholarship', amount: 500, description: 'Monthly Scholarship', date: '2025-07-01' },
  { id: '2', type: 'expense', category: 'Food', amount: 120, description: 'Groceries & snacks', date: '2025-07-03' },
  { id: '3', type: 'expense', category: 'Transport', amount: 45, description: 'Bus tickets', date: '2025-07-05' },
  { id: '4', type: 'income', category: 'Part-time Job', amount: 300, description: 'Tutoring salary', date: '2025-07-08' },
  { id: '5', type: 'expense', category: 'Books', amount: 80, description: 'Programming book', date: '2025-07-10' },
  { id: '6', type: 'expense', category: 'Entertainment', amount: 60, description: 'Movie & snacks', date: '2025-07-12' },
  { id: '7', type: 'income', category: 'Freelance', amount: 200, description: 'Web design project', date: '2025-07-15' },
  { id: '8', type: 'expense', category: 'Accommodation', amount: 250, description: 'Hostel rent', date: '2025-07-20' },
  { id: '9', type: 'expense', category: 'Healthcare', amount: 40, description: 'Medicines', date: '2025-07-22' },
  { id: '10', type: 'expense', category: 'Food', amount: 90, description: 'Restaurant hangout', date: '2025-07-25' },
];

// --- Types -------------------------------------------------------
interface BudgetFormData {
  type: 'income' | 'expense';
  category: string;
  amount: string;
  description: string;
  date: string;
}

// --- Component --------------------------------------------------
export function BudgetTracker() {
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<BudgetFormData>({
    type: 'expense',
    category: 'Food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Load from localStorage or use demo data
  useEffect(() => {
    const savedEntries = localStorage.getItem('budgetEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    } else {
      setEntries(DEMO_ENTRIES);
    }
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('budgetEntries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      return;
    }

    const newEntry: BudgetEntry = {
      id: Date.now().toString(),
      type: formData.type,
      category: formData.category,
      amount,
      description: formData.description,
      date: formData.date,
    };

    setEntries([newEntry, ...entries]);
    resetForm();
  };

  const handleDelete = (entryId: string) => {
    setEntries(entries.filter(e => e.id !== entryId));
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      category: 'Food',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsFormOpen(false);
  };

  const calculateStats = () => {
    const totalIncome = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    return { totalIncome, totalExpenses, currentBalance: totalIncome - totalExpenses };
  };

  const getMonthlyData = () => {
    const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
    entries.forEach(entry => {
      const month = new Date(entry.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!monthlyData[month]) monthlyData[month] = { income: 0, expenses: 0 };
      if (entry.type === 'income') monthlyData[month].income += entry.amount;
      else monthlyData[month].expenses += entry.amount;
    });
    return Object.entries(monthlyData).map(([month, data]) => ({ month, income: data.income, expenses: data.expenses }));
  };

  const getCategoryData = () => {
    const categoryData: { [key: string]: number } = {};
    entries.filter(e => e.type === 'expense').forEach(e => {
      categoryData[e.category] = (categoryData[e.category] || 0) + e.amount;
    });
    return Object.entries(categoryData).map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }));
  };

  const stats = calculateStats();
  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Budget Tracker</h1>
          <p className="text-gray-600 mt-1">Track your income and expenses</p>
        </div>
        <button onClick={() => setIsFormOpen(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" /> <span>Add Entry</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4"><div className="p-3 bg-green-500 text-white rounded-lg"><TrendingUp className="h-6 w-6" /></div></div>
          <p className="text-sm font-medium text-green-600 mb-1">Total Income</p>
          <p className="text-3xl font-bold text-green-800">${stats.totalIncome.toFixed(2)}</p>
        </div>

        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-4"><div className="p-3 bg-red-500 text-white rounded-lg"><TrendingDown className="h-6 w-6" /></div></div>
          <p className="text-sm font-medium text-red-600 mb-1">Total Expenses</p>
          <p className="text-3xl font-bold text-red-800">${stats.totalExpenses.toFixed(2)}</p>
        </div>

        <div className={`${stats.currentBalance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'} rounded-xl p-6 border`}>
          <div className="flex items-center justify-between mb-4"><div className={`p-3 text-white rounded-lg ${stats.currentBalance >= 0 ? 'bg-blue-500' : 'bg-orange-500'}`}><DollarSign className="h-6 w-6" /></div></div>
          <p className={`text-sm font-medium mb-1 ${stats.currentBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Current Balance</p>
          <p className={`text-3xl font-bold ${stats.currentBalance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>${Math.abs(stats.currentBalance).toFixed(2)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Overview */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, '']} />
              <Bar dataKey="income" fill="#10B981" name="Income" />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Categories</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: $${value.toFixed(2)}`}>
                  {categoryData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-[300px] text-gray-500">No expense data available</div>}
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Entries</h3>
        <div className="space-y-3">
          {entries.slice(0, 10).map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${entry.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {entry.type === 'income' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{entry.description || entry.category}</p>
                  <p className="text-sm text-gray-600">{entry.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className={`font-semibold ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleDelete(entry.id)} className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Entry Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Budget Entry</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ 
                  ...formData, 
                  type: e.target.value as 'income' | 'expense',
                  category: e.target.value === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
                })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {(formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" step="0.01" min="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Add a description..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Add Entry</button>
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
