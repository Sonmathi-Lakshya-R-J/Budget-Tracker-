import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TransactionModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  transaction = null,
  categories = [] 
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date()?.toISOString()?.split('T')?.[0],
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: Math.abs(transaction?.amount)?.toString(),
        type: transaction?.type,
        category: transaction?.category,
        date: transaction?.date,
        notes: transaction?.notes || ''
      });
    } else {
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        date: new Date()?.toISOString()?.split('T')?.[0],
        notes: ''
      });
    }
    setErrors({});
    setShowNewCategoryInput(false);
    setNewCategory('');
  }, [transaction, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData?.category && !newCategory) {
      newErrors.category = 'Please select or create a category';
    }

    if (!formData?.date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const finalCategory = newCategory || formData?.category;
      const transactionData = {
        ...formData,
        category: finalCategory,
        amount: parseFloat(formData?.amount),
        id: transaction?.id || Date.now()
      };

      await onSave(transactionData);
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewCategory = () => {
    if (newCategory?.trim()) {
      setFormData(prev => ({
        ...prev,
        category: newCategory?.trim()
      }));
      setShowNewCategoryInput(false);
      setNewCategory('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-card rounded-lg shadow-elevated w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Amount */}
          <Input
            type="number"
            label="Amount"
            placeholder="0.00"
            value={formData?.amount}
            onChange={(e) => handleInputChange('amount', e?.target?.value)}
            error={errors?.amount}
            required
            min="0"
            step="0.01"
          />

          {/* Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Transaction Type
            </label>
            <div className="flex bg-muted rounded-lg p-1">
              <button
                type="button"
                onClick={() => handleInputChange('type', 'expense')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-smooth ${
                  formData?.type === 'expense' ?'bg-destructive text-destructive-foreground shadow-sm' :'text-text-secondary hover:text-foreground'
                }`}
              >
                <Icon name="TrendingDown" size={16} />
                <span>Expense</span>
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('type', 'income')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-smooth ${
                  formData?.type === 'income' ?'bg-success text-success-foreground shadow-sm' :'text-text-secondary hover:text-foreground'
                }`}
              >
                <Icon name="TrendingUp" size={16} />
                <span>Income</span>
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            {!showNewCategoryInput ? (
              <div className="space-y-2">
                <select
                  value={formData?.category}
                  onChange={(e) => handleInputChange('category', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories?.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewCategoryInput(true)}
                  iconName="Plus"
                  iconPosition="left"
                  className="w-full"
                >
                  Create New Category
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e?.target?.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddNewCategory}
                  disabled={!newCategory?.trim()}
                >
                  <Icon name="Check" size={16} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowNewCategoryInput(false);
                    setNewCategory('');
                  }}
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            )}
            {errors?.category && (
              <p className="text-sm text-destructive mt-1">{errors?.category}</p>
            )}
          </div>

          {/* Date */}
          <Input
            type="date"
            label="Date"
            value={formData?.date}
            onChange={(e) => handleInputChange('date', e?.target?.value)}
            error={errors?.date}
            required
          />

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              placeholder="Add any additional notes..."
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
            >
              {transaction ? 'Update' : 'Add'} Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;