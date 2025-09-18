import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DataManagementSection = () => {
  const [loading, setLoading] = useState({
    backup: false,
    exportCSV: false,
    exportJSON: false,
    restore: false
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const dataStats = {
    transactions: 1247,
    budgets: 12,
    categories: 15,
    groups: 3,
    lastBackup: "2025-09-10 14:30:00"
  };

  const handleExport = async (format) => {
    const loadingKey = format === 'csv' ? 'exportCSV' : 'exportJSON';
    setLoading(prev => ({ ...prev, [loadingKey]: true }));
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock data for download
      const mockData = {
        transactions: [
          {
            id: 1,
            date: "2025-09-15",
            amount: -45.50,
            category: "Groceries",
            description: "Weekly grocery shopping",
            type: "expense"
          },
          {
            id: 2,
            date: "2025-09-14",
            amount: 3200.00,
            category: "Salary",
            description: "Monthly salary",
            type: "income"
          }
        ],
        budgets: [
          {
            id: 1,
            category: "Groceries",
            budgetAmount: 400.00,
            spentAmount: 285.50,
            month: "2025-09"
          }
        ]
      };

      let content, filename, mimeType;

      if (format === 'csv') {
        // Convert to CSV format
        const csvContent = [
          'Date,Amount,Category,Description,Type',
          ...mockData?.transactions?.map(t => 
            `${t?.date},${t?.amount},${t?.category},"${t?.description}",${t?.type}`
          )
        ]?.join('\n');
        
        content = csvContent;
        filename = `budget-tracker-data-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
        mimeType = 'text/csv';
      } else {
        // JSON format
        content = JSON.stringify(mockData, null, 2);
        filename = `budget-tracker-data-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
        mimeType = 'application/json';
      }

      // Create and trigger download
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL?.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      window.URL?.revokeObjectURL(url);

      setSuccess(`Data exported successfully as ${format?.toUpperCase()}!`);
    } catch (err) {
      setError(`Failed to export data as ${format?.toUpperCase()}. Please try again.`);
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleBackup = async () => {
    setLoading(prev => ({ ...prev, backup: true }));
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      setSuccess('Data backup completed successfully!');
    } catch (err) {
      setError('Failed to create backup. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, backup: false }));
    }
  };

  const handleRestore = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    if (!file?.name?.endsWith('.json')) {
      setError('Please select a valid JSON backup file');
      return;
    }

    setLoading(prev => ({ ...prev, restore: true }));
    setError('');

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2500));
      setSuccess('Data restored successfully from backup!');
    } catch (err) {
      setError('Failed to restore data. Please check your backup file.');
    } finally {
      setLoading(prev => ({ ...prev, restore: false }));
      // Reset file input
      event.target.value = '';
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
      {/* Data Overview */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Data Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{dataStats?.transactions?.toLocaleString()}</div>
            <div className="text-sm text-text-secondary">Transactions</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{dataStats?.budgets}</div>
            <div className="text-sm text-text-secondary">Budgets</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{dataStats?.categories}</div>
            <div className="text-sm text-text-secondary">Categories</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{dataStats?.groups}</div>
            <div className="text-sm text-text-secondary">Groups</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-blue-600" />
            <span className="text-sm text-blue-700">
              Last backup: {new Date(dataStats.lastBackup)?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      {/* Export Data */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Export Data</h3>
        <p className="text-sm text-text-secondary mb-4">
          Download your financial data in different formats for external use or record keeping.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={20} className="text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">CSV Format</h4>
                <p className="text-sm text-text-secondary">Spreadsheet compatible format</p>
              </div>
            </div>
            <Button
              variant="outline"
              fullWidth
              loading={loading?.exportCSV}
              onClick={() => handleExport('csv')}
              iconName="Download"
              iconPosition="left"
            >
              Export as CSV
            </Button>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="Code" size={20} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">JSON Format</h4>
                <p className="text-sm text-text-secondary">Structured data format</p>
              </div>
            </div>
            <Button
              variant="outline"
              fullWidth
              loading={loading?.exportJSON}
              onClick={() => handleExport('json')}
              iconName="Download"
              iconPosition="left"
            >
              Export as JSON
            </Button>
          </div>
        </div>
      </div>
      {/* Backup & Restore */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Backup & Restore</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Backup */}
          <div>
            <h4 className="font-medium text-foreground mb-2">Create Backup</h4>
            <p className="text-sm text-text-secondary mb-4">
              Create a complete backup of all your financial data including transactions, budgets, and settings.
            </p>
            <Button
              variant="default"
              fullWidth
              loading={loading?.backup}
              onClick={handleBackup}
              iconName="Shield"
              iconPosition="left"
            >
              Create Backup
            </Button>
          </div>

          {/* Restore */}
          <div>
            <h4 className="font-medium text-foreground mb-2">Restore Data</h4>
            <p className="text-sm text-text-secondary mb-4">
              Restore your data from a previous backup file. This will replace all current data.
            </p>
            <label className="block">
              <Button
                variant="outline"
                fullWidth
                loading={loading?.restore}
                iconName="Upload"
                iconPosition="left"
                asChild
              >
                Select Backup File
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleRestore}
                className="hidden"
                disabled={loading?.restore}
              />
            </label>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-700">
              <strong>Warning:</strong> Restoring data will permanently replace all current data. 
              Make sure to create a backup before restoring.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagementSection;