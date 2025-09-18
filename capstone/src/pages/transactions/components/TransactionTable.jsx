import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionTable = ({ 
  transactions, 
  onEdit, 
  onDelete, 
  sortConfig, 
  onSort,
  currentPage,
  totalPages,
  onPageChange 
}) => {
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      setSelectedTransactions(transactions?.map(t => t?.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleSelectTransaction = (id) => {
    setSelectedTransactions(prev => 
      prev?.includes(id) 
        ? prev?.filter(t => t !== id)
        : [...prev, id]
    );
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = `₹${Math.abs(amount)?.toLocaleString()}`;
    
    return type === 'income' ? `+${formattedAmount}` : `-${formattedAmount}`;
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Bills & Utilities': 'bg-red-100 text-red-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Salary': 'bg-emerald-100 text-emerald-800',
      'Freelance': 'bg-cyan-100 text-cyan-800',
      'Investment': 'bg-indigo-100 text-indigo-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors?.[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-soft">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedTransactions?.length === transactions?.length}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort('amount')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Amount</span>
                  <Icon name={getSortIcon('amount')} size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort('type')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Type</span>
                  <Icon name={getSortIcon('type')} size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort('category')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Category</span>
                  <Icon name={getSortIcon('category')} size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => onSort('date')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Date</span>
                  <Icon name={getSortIcon('date')} size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <span className="text-sm font-medium text-foreground">Notes</span>
              </th>
              <th className="text-right px-4 py-3 w-24">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions?.map((transaction) => (
              <tr key={transaction?.id} className="hover:bg-muted/50 transition-smooth">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedTransactions?.includes(transaction?.id)}
                    onChange={() => handleSelectTransaction(transaction?.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${
                    transaction?.type === 'income' ? 'text-success' : 'text-destructive'
                  }`}>
                    {formatAmount(transaction?.amount, transaction?.type)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={transaction?.type === 'income' ? 'TrendingUp' : 'TrendingDown'} 
                      size={16}
                      className={transaction?.type === 'income' ? 'text-success' : 'text-destructive'}
                    />
                    <span className="text-sm capitalize">{transaction?.type}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction?.category)}`}>
                    {transaction?.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-text-secondary">{formatDate(transaction?.date)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-text-secondary truncate max-w-32 block">
                    {transaction?.notes || '-'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(transaction)}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(transaction?.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 p-4">
        {transactions?.map((transaction) => (
          <div key={transaction?.id} className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTransactions?.includes(transaction?.id)}
                  onChange={() => handleSelectTransaction(transaction?.id)}
                  className="rounded border-border"
                />
                <span className={`font-semibold text-lg ${
                  transaction?.type === 'income' ? 'text-success' : 'text-destructive'
                }`}>
                  {formatAmount(transaction?.amount, transaction?.type)}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(transaction)}
                  className="h-8 w-8"
                >
                  <Icon name="Edit" size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(transaction?.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={transaction?.type === 'income' ? 'TrendingUp' : 'TrendingDown'} 
                    size={16}
                    className={transaction?.type === 'income' ? 'text-success' : 'text-destructive'}
                  />
                  <span className="text-sm capitalize text-text-secondary">{transaction?.type}</span>
                </div>
                <span className="text-sm text-text-secondary">{formatDate(transaction?.date)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction?.category)}`}>
                  {transaction?.category}
                </span>
              </div>
              
              {transaction?.notes && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-text-secondary">{transaction?.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="text-sm text-text-secondary">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Icon name="ChevronLeft" size={16} />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;