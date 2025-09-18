import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetCard = ({ budget, onEdit, onDelete, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const progressPercentage = Math.min((budget?.spent / budget?.allocated) * 100, 100);
  
  const getProgressColor = () => {
    if (progressPercentage >= 100) return 'bg-destructive';
    if (progressPercentage >= 80) return 'bg-warning';
    return 'bg-success';
  };
  
  const getStatusColor = () => {
    if (progressPercentage >= 100) return 'text-destructive';
    if (progressPercentage >= 80) return 'text-warning';
    return 'text-success';
  };

  const formatCurrency = (amount) => {
    return `₹${Math.abs(amount)?.toLocaleString()}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft hover:shadow-elevated transition-smooth">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${budget?.color}`}>
            <Icon name={budget?.icon} size={20} color="white" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{budget?.category}</h3>
            <p className="text-sm text-muted-foreground">{budget?.period}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(budget)}
            className="h-8 w-8"
          >
            <Icon name="Edit2" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(budget?.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
      {/* Budget Overview */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Allocated</span>
          <span className="font-semibold text-card-foreground">
            {formatCurrency(budget?.allocated)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Spent</span>
          <span className={`font-semibold ${getStatusColor()}`}>
            {formatCurrency(budget?.spent)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Remaining</span>
          <span className={`font-semibold ${budget?.remaining >= 0 ? 'text-success' : 'text-destructive'}`}>
            {formatCurrency(budget?.remaining)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {progressPercentage?.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Status Alert */}
        {progressPercentage >= 100 && (
          <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <Icon name="AlertTriangle" size={16} className="text-destructive" />
            <span className="text-sm text-destructive font-medium">
              Budget exceeded by {formatCurrency(Math.abs(budget?.remaining))}
            </span>
          </div>
        )}
        
        {progressPercentage >= 80 && progressPercentage < 100 && (
          <div className="flex items-center space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <Icon name="AlertCircle" size={16} className="text-warning" />
            <span className="text-sm text-warning font-medium">
              Approaching budget limit
            </span>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-center"
        >
          <span className="text-sm">
            {isExpanded ? 'Hide Details' : 'View Details'}
          </span>
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="ml-2" 
          />
        </Button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="pt-4 border-t border-border space-y-3">
            <h4 className="font-medium text-card-foreground">Recent Transactions</h4>
            <div className="space-y-2">
              {budget?.recentTransactions?.map((transaction) => (
                <div key={transaction?.id} className="flex justify-between items-center py-2">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      {transaction?.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction?.date}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-destructive">
                    -{formatCurrency(transaction?.amount)}
                  </span>
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={() => onViewDetails(budget)}
              className="w-full"
            >
              View All Transactions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetCard;