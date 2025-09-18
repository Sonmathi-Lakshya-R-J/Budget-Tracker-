import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const handleAddTransaction = () => {
    navigate('/transactions');
  };

  const handleCreateGroup = () => {
    // Navigate to group creation (would be implemented in future)
    console.log('Create group functionality to be implemented');
  };

  const handleViewBudgets = () => {
    navigate('/budgets');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Button 
          variant="default" 
          fullWidth 
          iconName="Plus" 
          iconPosition="left"
          onClick={handleAddTransaction}
        >
          Add Transaction
        </Button>
        <Button 
          variant="outline" 
          fullWidth 
          iconName="Users" 
          iconPosition="left"
          onClick={handleCreateGroup}
        >
          Create Group
        </Button>
        <Button 
          variant="secondary" 
          fullWidth 
          iconName="PieChart" 
          iconPosition="left"
          onClick={handleViewBudgets}
        >
          View Budgets
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;