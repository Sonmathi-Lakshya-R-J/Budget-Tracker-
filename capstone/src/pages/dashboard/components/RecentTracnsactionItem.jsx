import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentTransactionItem = ({ transaction }) => {
  const { type, category, amount, description, date, icon } = transaction;
  const isIncome = type === 'income';
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-smooth">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isIncome ? 'bg-success text-success-foreground' : 'bg-secondary text-secondary-foreground'
        }`}>
          <Icon name={icon} size={18} />
        </div>
        <div>
          <h4 className="font-medium text-foreground">{description}</h4>
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <span>{category}</span>
            <span>•</span>
            <span>{formatDate(date)}</span>
          </div>
        </div>
      </div>
      <div className={`font-semibold ${
        isIncome ? 'text-success' : 'text-foreground'
      }`}>
        {isIncome ? '+' : '-'}₹{Math.abs(amount)?.toLocaleString()}
      </div>
    </div>
  );
};

export default RecentTransactionItem;