import React from 'react';
import Icon from '../../../components/AppIcon';

const BudgetSummary = ({ summaryData }) => {
  const formatCurrency = (amount) => {
    return `₹${Math.abs(amount)?.toLocaleString()}`;
  };

  const getUtilizationColor = () => {
    if (summaryData?.utilizationPercentage >= 100) return 'text-destructive';
    if (summaryData?.utilizationPercentage >= 80) return 'text-warning';
    return 'text-success';
  };

  const getUtilizationBgColor = () => {
    if (summaryData?.utilizationPercentage >= 100) return 'bg-destructive';
    if (summaryData?.utilizationPercentage >= 80) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Budgeted */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Budgeted</p>
            <p className="text-2xl font-bold text-card-foreground">
              {formatCurrency(summaryData?.totalBudgeted)}
            </p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Target" size={24} className="text-primary" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <Icon name="TrendingUp" size={16} className="text-success mr-2" />
          <span className="text-sm text-success">
            +{summaryData?.budgetGrowth}% from last month
          </span>
        </div>
      </div>
      {/* Total Spent */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-card-foreground">
              {formatCurrency(summaryData?.totalSpent)}
            </p>
          </div>
          <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
            <Icon name="CreditCard" size={24} className="text-destructive" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <Icon name="TrendingDown" size={16} className="text-destructive mr-2" />
          <span className="text-sm text-destructive">
            +{summaryData?.spendingIncrease}% from last month
          </span>
        </div>
      </div>
      {/* Remaining Budget */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Remaining</p>
            <p className={`text-2xl font-bold ${summaryData?.totalRemaining >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(summaryData?.totalRemaining)}
            </p>
          </div>
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="PiggyBank" size={24} className="text-success" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <Icon name="Calendar" size={16} className="text-muted-foreground mr-2" />
          <span className="text-sm text-muted-foreground">
            {summaryData?.daysRemaining} days left in month
          </span>
        </div>
      </div>
      {/* Budget Utilization */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Utilization</p>
            <p className={`text-2xl font-bold ${getUtilizationColor()}`}>
              {summaryData?.utilizationPercentage?.toFixed(1)}%
            </p>
          </div>
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="PieChart" size={24} className="text-accent" />
          </div>
        </div>
        
        {/* Progress Ring */}
        <div className="relative w-full">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getUtilizationBgColor()}`}
              style={{ width: `${Math.min(summaryData?.utilizationPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">0%</span>
            <span className="text-xs text-muted-foreground">100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;