import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import SummaryWidget from './components/SummaryWidget';
import BudgetProgressCard from './components/BudgetProgressCard';
import RecentTransactionItem from './components/RecentTracnsactionItem';
import SpendingChart from './components/SpendingChart';
import IncomeExpenseChart from './components/IncomeExpenseChart';
import SpendingTrendChart from './components/SpendingTrendChart';
import QuickActions from './components/QuickActions';

const Dashboard = () => {
  const [currentDate] = useState(new Date());

  // Mock data for summary widgets
  const summaryData = {
    totalIncome: 8500,
    totalExpenses: 6200,
    currentSavings: 2300,
    budgetUtilization: 73
  };

  // Mock data for budget progress
  const budgetData = [
    {
      category: "Food & Dining",
      spent: 850,
      budget: 1000,
      icon: "UtensilsCrossed",
      color: "primary"
    },
    {
      category: "Transportation",
      spent: 420,
      budget: 500,
      icon: "Car",
      color: "success"
    },
    {
      category: "Entertainment",
      spent: 380,
      budget: 300,
      icon: "Gamepad2",
      color: "warning"
    },
    {
      category: "Shopping",
      spent: 650,
      budget: 600,
      icon: "ShoppingBag",
      color: "error"
    }
  ];

  // Mock data for recent transactions
  const recentTransactions = [
    {
      id: 1,
      type: "expense",
      category: "Food & Dining",
      amount: -45.50,
      description: "Lunch at Cafe Central",
      date: "2025-09-15",
      icon: "UtensilsCrossed"
    },
    {
      id: 2,
      type: "income",
      category: "Salary",
      amount: 3500,
      description: "Monthly Salary",
      date: "2025-09-14",
      icon: "Banknote"
    },
    {
      id: 3,
      type: "expense",
      category: "Transportation",
      amount: -25.00,
      description: "Uber Ride",
      date: "2025-09-14",
      icon: "Car"
    },
    {
      id: 4,
      type: "expense",
      category: "Shopping",
      amount: -120.00,
      description: "Grocery Shopping",
      date: "2025-09-13",
      icon: "ShoppingCart"
    },
    {
      id: 5,
      type: "expense",
      category: "Entertainment",
      amount: -15.99,
      description: "Netflix Subscription",
      date: "2025-09-12",
      icon: "Play"
    }
  ];

  // Mock data for spending breakdown chart
  const spendingBreakdown = [
    { name: "Food & Dining", value: 850, total: 6200 },
    { name: "Transportation", value: 420, total: 6200 },
    { name: "Entertainment", value: 380, total: 6200 },
    { name: "Shopping", value: 650, total: 6200 },
    { name: "Utilities", value: 320, total: 6200 },
    { name: "Healthcare", value: 180, total: 6200 },
    { name: "Others", value: 400, total: 6200 }
  ];

  // Mock data for income vs expenses chart
  const incomeExpenseData = [
    { month: "Jan", income: 8000, expenses: 5800 },
    { month: "Feb", income: 8200, expenses: 6100 },
    { month: "Mar", income: 8500, expenses: 5900 },
    { month: "Apr", income: 8300, expenses: 6300 },
    { month: "May", income: 8600, expenses: 6000 },
    { month: "Jun", income: 8400, expenses: 6400 },
    { month: "Jul", income: 8700, expenses: 6100 },
    { month: "Aug", income: 8500, expenses: 6200 },
    { month: "Sep", income: 8500, expenses: 6200 }
  ];

  // Mock data for spending trend chart
  const spendingTrendData = [
    { date: "Sep 1", amount: 180 },
    { date: "Sep 3", amount: 220 },
    { date: "Sep 5", amount: 160 },
    { date: "Sep 7", amount: 280 },
    { date: "Sep 9", amount: 190 },
    { date: "Sep 11", amount: 240 },
    { date: "Sep 13", amount: 200 },
    { date: "Sep 15", amount: 210 }
  ];

  const formatCurrency = (amount) => {
    return `₹${Math.abs(amount)?.toLocaleString()}`;
  };

  const calculateTrend = (current, previous) => {
    if (!previous) return { trend: 'neutral', value: '0%' };
    const change = ((current - previous) / previous) * 100;
    return {
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      value: `${Math.abs(change)?.toFixed(1)}%`
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, John!
            </h1>
            <p className="text-text-secondary">
              Here's your financial overview for {currentDate?.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>

          {/* Summary Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryWidget
              title="Total Income"
              amount={formatCurrency(summaryData?.totalIncome)}
              icon="TrendingUp"
              trend="up"
              trendValue="12.5%"
              color="success"
            />
            <SummaryWidget
              title="Total Expenses"
              amount={formatCurrency(summaryData?.totalExpenses)}
              icon="TrendingDown"
              trend="down"
              trendValue="8.2%"
              color="error"
            />
            <SummaryWidget
              title="Current Savings"
              amount={formatCurrency(summaryData?.currentSavings)}
              icon="PiggyBank"
              trend="up"
              trendValue="15.3%"
              color="primary"
            />
            <SummaryWidget
              title="Budget Used"
              amount={`${summaryData?.budgetUtilization}%`}
              icon="Target"
              trend="neutral"
              trendValue="On Track"
              color="warning"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Charts Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Spending Breakdown Chart */}
              <SpendingChart 
                data={spendingBreakdown}
                title="Spending Breakdown by Category"
              />

              {/* Income vs Expenses Chart */}
              <IncomeExpenseChart 
                data={incomeExpenseData}
                title="Monthly Income vs Expenses"
              />

              {/* Spending Trend Chart */}
              <SpendingTrendChart 
                data={spendingTrendData}
                title="Daily Spending Trend"
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <QuickActions />

              {/* Recent Transactions */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium transition-smooth">
                    View All
                  </button>
                </div>
                <div className="space-y-1">
                  {recentTransactions?.slice(0, 5)?.map((transaction) => (
                    <RecentTransactionItem 
                      key={transaction?.id} 
                      transaction={transaction} 
                    />
                  ))}
                </div>
              </div>

              {/* Budget Progress */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Budget Progress</h3>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium transition-smooth">
                    Manage
                  </button>
                </div>
                <div className="space-y-4">
                  {budgetData?.map((budget, index) => (
                    <BudgetProgressCard 
                      key={index}
                      category={budget?.category}
                      spent={budget?.spent}
                      budget={budget?.budget}
                      icon={budget?.icon}
                      color={budget?.color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-foreground mb-4">Financial Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-success mb-1">
                  ₹{(summaryData?.totalIncome - summaryData?.totalExpenses)?.toLocaleString()}
                </div>
                <p className="text-sm text-text-secondary">Net Income This Month</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">
                  ₹{(summaryData?.totalExpenses / 30)?.toFixed(0)}
                </div>
                <p className="text-sm text-text-secondary">Average Daily Spending</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-warning mb-1">
                  {Math.round((summaryData?.currentSavings / summaryData?.totalIncome) * 100)}%
                </div>
                <p className="text-sm text-text-secondary">Savings Rate</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;