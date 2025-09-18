import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/Appicon';
import Button from '../../components/ui/Button';
import BudgetCard from './components/BudgetCard';
import BudgetSummary from './components/BudgetSummary.jsx';
import CreateBudgetModal from './components/CreateBudgetModal';
import BudgetChart from './components/BudgetChart';

const BudgetsPage = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('category');

  // Mock data for budgets
  const mockBudgets = [
    {
      id: 1,
      category: "Food & Dining",
      allocated: 800,
      spent: 650,
      remaining: 150,
      period: "September 2025",
      icon: "Utensils",
      color: "bg-orange-500",
      recentTransactions: [
        { id: 1, description: "Grocery Store", amount: 85.50, date: "Sep 14, 2025" },
        { id: 2, description: "Restaurant Dinner", amount: 45.00, date: "Sep 13, 2025" },
        { id: 3, description: "Coffee Shop", amount: 12.75, date: "Sep 12, 2025" }
      ]
    },
    {
      id: 2,
      category: "Transportation",
      allocated: 400,
      spent: 420,
      remaining: -20,
      period: "September 2025",
      icon: "Car",
      color: "bg-blue-500",
      recentTransactions: [
        { id: 4, description: "Gas Station", amount: 65.00, date: "Sep 14, 2025" },
        { id: 5, description: "Uber Ride", amount: 25.50, date: "Sep 13, 2025" },
        { id: 6, description: "Parking Fee", amount: 15.00, date: "Sep 11, 2025" }
      ]
    },
    {
      id: 3,
      category: "Shopping",
      allocated: 600,
      spent: 480,
      remaining: 120,
      period: "September 2025",
      icon: "ShoppingBag",
      color: "bg-purple-500",
      recentTransactions: [
        { id: 7, description: "Online Purchase", amount: 125.00, date: "Sep 13, 2025" },
        { id: 8, description: "Clothing Store", amount: 89.99, date: "Sep 10, 2025" },
        { id: 9, description: "Electronics", amount: 199.99, date: "Sep 8, 2025" }
      ]
    },
    {
      id: 4,
      category: "Entertainment",
      allocated: 300,
      spent: 180,
      remaining: 120,
      period: "September 2025",
      icon: "Film",
      color: "bg-pink-500",
      recentTransactions: [
        { id: 10, description: "Movie Tickets", amount: 28.00, date: "Sep 12, 2025" },
        { id: 11, description: "Streaming Service", amount: 15.99, date: "Sep 1, 2025" },
        { id: 12, description: "Concert Tickets", amount: 85.00, date: "Sep 5, 2025" }
      ]
    },
    {
      id: 5,
      category: "Bills & Utilities",
      allocated: 500,
      spent: 475,
      remaining: 25,
      period: "September 2025",
      icon: "Receipt",
      color: "bg-red-500",
      recentTransactions: [
        { id: 13, description: "Electricity Bill", amount: 125.50, date: "Sep 1, 2025" },
        { id: 14, description: "Internet Bill", amount: 79.99, date: "Sep 1, 2025" },
        { id: 15, description: "Water Bill", amount: 45.25, date: "Sep 3, 2025" }
      ]
    },
    {
      id: 6,
      category: "Healthcare",
      allocated: 200,
      spent: 85,
      remaining: 115,
      period: "September 2025",
      icon: "Heart",
      color: "bg-green-500",
      recentTransactions: [
        { id: 16, description: "Pharmacy", amount: 35.50, date: "Sep 10, 2025" },
        { id: 17, description: "Doctor Visit", amount: 49.50, date: "Sep 7, 2025" }
      ]
    }
  ];

  // Initialize budgets
  useEffect(() => {
    setBudgets(mockBudgets);
  }, []);

  // Calculate summary data
  const summaryData = {
    totalBudgeted: budgets?.reduce((sum, budget) => sum + budget?.allocated, 0),
    totalSpent: budgets?.reduce((sum, budget) => sum + budget?.spent, 0),
    totalRemaining: budgets?.reduce((sum, budget) => sum + budget?.remaining, 0),
    utilizationPercentage: budgets?.length > 0 
      ? (budgets?.reduce((sum, budget) => sum + budget?.spent, 0) / budgets?.reduce((sum, budget) => sum + budget?.allocated, 0)) * 100 
      : 0,
    budgetGrowth: 12.5,
    spendingIncrease: 8.3,
    daysRemaining: 16
  };

  // Filter and sort budgets
  const filteredAndSortedBudgets = budgets?.filter(budget => filterCategory === 'all' || budget?.category === filterCategory)?.sort((a, b) => {
      switch (sortBy) {
        case 'spent':
          return b?.spent - a?.spent;
        case 'remaining':
          return b?.remaining - a?.remaining;
        case 'utilization':
          return (b?.spent / b?.allocated) - (a?.spent / a?.allocated);
        default:
          return a?.category?.localeCompare(b?.category);
      }
    });

  const handleCreateBudget = (budgetData) => {
    setBudgets(prev => [...prev, budgetData]);
  };

  const handleEditBudget = (budget) => {
    // Navigate to edit budget or open edit modal
    console.log('Edit budget:', budget);
  };

  const handleDeleteBudget = (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      setBudgets(prev => prev?.filter(budget => budget?.id !== budgetId));
    }
  };

  const handleViewDetails = (budget) => {
    // Navigate to detailed budget view or transactions filtered by category
    navigate(`/transactions?category=${encodeURIComponent(budget?.category)}`);
  };

  const categories = ['all', ...new Set(budgets.map(budget => budget.category))];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Budget Management</h1>
              <p className="mt-2 text-muted-foreground">
                Track and manage your monthly budgets with real-time spending insights
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Create Budget
              </Button>
            </div>
          </div>

          {/* Budget Summary */}
          <BudgetSummary summaryData={summaryData} />

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            {/* Filters */}
            <div className="flex flex-wrap items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="Filter" size={16} className="text-muted-foreground" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e?.target?.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {categories?.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e?.target?.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="category">Sort by Category</option>
                  <option value="spent">Sort by Spent</option>
                  <option value="remaining">Sort by Remaining</option>
                  <option value="utilization">Sort by Utilization</option>
                </select>
              </div>
            </div>

            {/* Chart Type Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
              >
                <Icon name="BarChart3" size={16} />
              </Button>
              <Button
                variant={chartType === 'pie' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('pie')}
              >
                <Icon name="PieChart" size={16} />
              </Button>
            </div>
          </div>

          {/* Budget Chart */}
          <div className="mb-8">
            <BudgetChart budgets={filteredAndSortedBudgets} chartType={chartType} />
          </div>

          {/* Budget Cards Grid */}
          {filteredAndSortedBudgets?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedBudgets?.map((budget) => (
                <BudgetCard
                  key={budget?.id}
                  budget={budget}
                  onEdit={handleEditBudget}
                  onDelete={handleDeleteBudget}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Icon name="PieChart" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No budgets found</h3>
              <p className="text-muted-foreground mb-6">
                {filterCategory === 'all' 
                  ? "Get started by creating your first budget to track your spending."
                  : `No budgets found for "${filterCategory}". Try a different filter or create a new budget.`
                }
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Create Your First Budget
              </Button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-12 bg-card border border-border rounded-lg p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/transactions')}
                iconName="Receipt"
                iconPosition="left"
                className="justify-start"
              >
                View All Transactions
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                iconName="LayoutDashboard"
                iconPosition="left"
                className="justify-start"
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(true)}
                iconName="Target"
                iconPosition="left"
                className="justify-start"
              >
                Set New Goal
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/profile-settings')}
                iconName="Settings"
                iconPosition="left"
                className="justify-start"
              >
                Budget Settings
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* Create Budget Modal */}
      <CreateBudgetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBudget={handleCreateBudget}
      />
    </div>
  );
};

export default BudgetsPage;