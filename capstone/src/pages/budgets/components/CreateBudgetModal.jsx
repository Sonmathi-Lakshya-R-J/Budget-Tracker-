import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CreateBudgetModal = ({ isOpen, onClose, onCreateBudget }) => {
  const [formData, setFormData] = useState({
    category: '',
    customCategory: '',
    amount: '',
    period: 'monthly',
    rollover: false,
    icon: 'DollarSign',
    color: 'bg-primary'
  });

  const [errors, setErrors] = useState({});
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const predefinedCategories = [
    { name: 'Food & Dining', icon: 'Utensils', color: 'bg-orange-500' },
    { name: 'Transportation', icon: 'Car', color: 'bg-blue-500' },
    { name: 'Shopping', icon: 'ShoppingBag', color: 'bg-purple-500' },
    { name: 'Entertainment', icon: 'Film', color: 'bg-pink-500' },
    { name: 'Bills & Utilities', icon: 'Receipt', color: 'bg-red-500' },
    { name: 'Healthcare', icon: 'Heart', color: 'bg-green-500' },
    { name: 'Education', icon: 'BookOpen', color: 'bg-indigo-500' },
    { name: 'Travel', icon: 'Plane', color: 'bg-teal-500' },
    { name: 'Savings', icon: 'PiggyBank', color: 'bg-emerald-500' },
    { name: 'Other', icon: 'MoreHorizontal', color: 'bg-gray-500' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({
      ...prev,
      category: category?.name,
      icon: category?.icon,
      color: category?.color
    }));
    setIsCustomCategory(false);
  };

  const handleCustomCategoryToggle = () => {
    setIsCustomCategory(!isCustomCategory);
    if (!isCustomCategory) {
      setFormData(prev => ({
        ...prev,
        category: '',
        customCategory: '',
        icon: 'IndianRupee',
        color: 'bg-primary'
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const categoryName = isCustomCategory ? formData?.customCategory : formData?.category;
    if (!categoryName?.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    const budgetData = {
      id: Date.now(),
      category: isCustomCategory ? formData?.customCategory : formData?.category,
      allocated: parseFloat(formData?.amount),
      spent: 0,
      remaining: parseFloat(formData?.amount),
      period: formData?.period,
      rollover: formData?.rollover,
      icon: formData?.icon,
      color: formData?.color,
      createdAt: new Date()?.toISOString(),
      recentTransactions: []
    };
    
    onCreateBudget(budgetData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      category: '',
      customCategory: '',
      amount: '',
      period: 'monthly',
      rollover: false,
      icon: 'IndianRupee',
      color: 'bg-primary'
    });
    setErrors({});
    setIsCustomCategory(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-elevated w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Create New Budget</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">
                Select Category
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCustomCategoryToggle}
              >
                {isCustomCategory ? 'Choose Preset' : 'Custom Category'}
              </Button>
            </div>

            {isCustomCategory ? (
              <Input
                label="Custom Category Name"
                type="text"
                name="customCategory"
                value={formData?.customCategory}
                onChange={handleInputChange}
                placeholder="Enter category name"
                error={errors?.category}
                required
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {predefinedCategories?.map((category) => (
                  <button
                    key={category?.name}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData?.category === category?.name
                        ? 'border-primary bg-primary/10' :'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category?.color}`}>
                        <Icon name={category?.icon} size={16} color="white" />
                      </div>
                      <span className="text-xs font-medium text-center">
                        {category?.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {errors?.category && (
              <p className="text-sm text-destructive">{errors?.category}</p>
            )}
          </div>

          {/* Budget Amount */}
          <Input
            label="Budget Amount"
            type="number"
            name="amount"
            value={formData?.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            error={errors?.amount}
            required
            min="0"
            step="0.01"
          />

          {/* Period Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-card-foreground">
              Budget Period
            </label>
            <div className="flex space-x-4">
              {[
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' }
              ]?.map((period) => (
                <label key={period?.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="period"
                    value={period?.value}
                    checked={formData?.period === period?.value}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="text-sm text-card-foreground">{period?.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rollover Option */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="rollover"
              name="rollover"
              checked={formData?.rollover}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="rollover" className="text-sm text-card-foreground cursor-pointer">
              Roll over unused budget to next period
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
            >
              Create Budget
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBudgetModal;