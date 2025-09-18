import React from 'react';
import Icon from '../../../components/AppIcon';

const BudgetProgressCard = ({ category, spent, budget, icon, color = 'primary' }) => {
  const percentage = Math.min((spent / budget) * 100, 100);
  const isOverBudget = spent > budget;
  
  const progressColor = isOverBudget ? 'bg-error' : percentage > 80 ? 'bg-warning' : 'bg-success';
  const iconColor = isOverBudget ? 'error' : 'primary';

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            iconColor === 'error' ? 'bg-error text-error-foreground' : 'bg-primary text-primary-foreground'
          }`}>
            <Icon name={icon} size={18} />
          </div>
          <div>
            <h4 className="font-medium text-foreground">{category}</h4>
            <p className="text-sm text-text-secondary">
              ₹{spent?.toLocaleString()} / ₹{budget?.toLocaleString()}
            </p>
          </div>
        </div>
        {isOverBudget && (
          <div className="flex items-center space-x-1 text-error">
            <Icon name="AlertTriangle" size={16} />
            <span className="text-xs font-medium">Over Budget</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-text-secondary">{percentage?.toFixed(1)}% used</span>
          <span className={`font-medium ${isOverBudget ? 'text-error' : 'text-text-secondary'}`}>
            ₹{(budget - spent)?.toLocaleString()} remaining
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetProgressCard;