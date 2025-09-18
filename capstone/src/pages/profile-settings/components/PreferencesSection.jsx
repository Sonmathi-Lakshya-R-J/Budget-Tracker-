import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PreferencesSection = () => {
  const [preferences, setPreferences] = useState({
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
    theme: 'light',
    notifications: {
      email: true,
      push: false,
      budgetAlerts: true,
      weeklyReports: true
    }
  });

  const [customCategories, setCustomCategories] = useState([
    { id: 1, name: "Groceries", color: "#10B981", type: "expense" },
    { id: 2, name: "Transportation", color: "#3B82F6", type: "expense" },
    { id: 3, name: "Entertainment", color: "#8B5CF6", type: "expense" },
    { id: 4, name: "Salary", color: "#059669", type: "income" },
    { id: 5, name: "Freelance", color: "#DC2626", type: "income" }
  ]);

  const [newCategory, setNewCategory] = useState({ name: '', color: '#10B981', type: 'expense' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' }
  ];

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US Format)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (European Format)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO Format)' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ];

  const themeOptions = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' },
    { value: 'auto', label: 'Auto (System)' }
  ];

  const categoryColors = [
    '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field, checked) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev?.notifications,
        [field]: checked
      }
    }));
  };

  const handleAddCategory = () => {
    if (!newCategory?.name?.trim()) {
      setError('Category name is required');
      return;
    }

    const category = {
      id: Date.now(),
      name: newCategory?.name?.trim(),
      color: newCategory?.color,
      type: newCategory?.type
    };

    setCustomCategories(prev => [...prev, category]);
    setNewCategory({ name: '', color: '#10B981', type: 'expense' });
    setSuccess('Category added successfully!');
  };

  const handleDeleteCategory = (categoryId) => {
    setCustomCategories(prev => prev?.filter(cat => cat?.id !== categoryId));
    setSuccess('Category deleted successfully!');
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Preferences saved successfully!');
    } catch (err) {
      setError('Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <Icon name="CheckCircle" size={16} className="text-green-600" />
          <span className="text-sm text-green-700">{success}</span>
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <Icon name="AlertCircle" size={16} className="text-red-600" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}
      {/* General Preferences */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">General Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Currency"
            options={currencyOptions}
            value={preferences?.currency}
            onChange={(value) => handlePreferenceChange('currency', value)}
          />

          <Select
            label="Date Format"
            options={dateFormatOptions}
            value={preferences?.dateFormat}
            onChange={(value) => handlePreferenceChange('dateFormat', value)}
          />

          <Select
            label="Language"
            options={languageOptions}
            value={preferences?.language}
            onChange={(value) => handlePreferenceChange('language', value)}
          />

          <Select
            label="Theme"
            options={themeOptions}
            value={preferences?.theme}
            onChange={(value) => handlePreferenceChange('theme', value)}
          />
        </div>
      </div>
      {/* Notification Preferences */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <Checkbox
            label="Email Notifications"
            description="Receive important updates via email"
            checked={preferences?.notifications?.email}
            onChange={(e) => handleNotificationChange('email', e?.target?.checked)}
          />

          <Checkbox
            label="Push Notifications"
            description="Get real-time notifications on your device"
            checked={preferences?.notifications?.push}
            onChange={(e) => handleNotificationChange('push', e?.target?.checked)}
          />

          <Checkbox
            label="Budget Alerts"
            description="Notify when approaching or exceeding budget limits"
            checked={preferences?.notifications?.budgetAlerts}
            onChange={(e) => handleNotificationChange('budgetAlerts', e?.target?.checked)}
          />

          <Checkbox
            label="Weekly Reports"
            description="Receive weekly spending summary reports"
            checked={preferences?.notifications?.weeklyReports}
            onChange={(e) => handleNotificationChange('weeklyReports', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Custom Categories */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Custom Categories</h3>
        
        {/* Add New Category */}
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium text-foreground mb-3">Add New Category</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Category name"
                value={newCategory?.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e?.target?.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={newCategory?.type}
              onChange={(e) => setNewCategory(prev => ({ ...prev, type: e?.target?.value }))}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <Button
              variant="default"
              size="sm"
              onClick={handleAddCategory}
              iconName="Plus"
              iconPosition="left"
            >
              Add
            </Button>
          </div>
          
          {/* Color Picker */}
          <div className="mt-3">
            <p className="text-sm text-text-secondary mb-2">Choose color:</p>
            <div className="flex flex-wrap gap-2">
              {categoryColors?.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 transition-smooth ${
                    newCategory?.color === color ? 'border-foreground' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Existing Categories */}
        <div className="space-y-3">
          {customCategories?.map((category) => (
            <div key={category?.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category?.color }}
                />
                <span className="font-medium text-foreground">{category?.name}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  category?.type === 'income' ?'bg-green-100 text-green-700' :'bg-red-100 text-red-700'
                }`}>
                  {category?.type}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteCategory(category?.id)}
                iconName="Trash2"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="default"
          loading={loading}
          onClick={handleSavePreferences}
          iconName="Save"
          iconPosition="left"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default PreferencesSection;