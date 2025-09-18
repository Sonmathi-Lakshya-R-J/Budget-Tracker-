import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div 
        className="flex items-center justify-center cursor-pointer mb-6"
        onClick={() => navigate('/dashboard')}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-soft">
            <Icon name="DollarSign" size={24} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-foreground">BudgetTracker Pro</h1>
            <p className="text-sm text-text-secondary">Take control of your finances</p>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Create Your Account</h2>
        <p className="text-lg text-text-secondary max-w-md mx-auto">
          Join thousands of users who are already managing their finances smarter with our comprehensive budgeting tools.
        </p>
      </div>

      {/* Benefits */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
          <Icon name="TrendingUp" size={16} className="text-success" />
          <span>Track Expenses</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
          <Icon name="PieChart" size={16} className="text-primary" />
          <span>Budget Management</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
          <Icon name="Users" size={16} className="text-accent" />
          <span>Group Expenses</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;