import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterToolbar = ({ 
  filters, 
  onFiltersChange, 
  onExport, 
  resultsCount,
  onClearFilters 
}) => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const transactionTypes = [
    { value: '', label: 'All Types' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' }
  ];

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Food & Dining', label: 'Food & Dining' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Shopping', label: 'Shopping' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Bills & Utilities', label: 'Bills & Utilities' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Salary', label: 'Salary' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Investment', label: 'Investment' },
    { value: 'Other', label: 'Other' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = () => {
    return filters?.dateFrom || filters?.dateTo || filters?.type || filters?.category || filters?.search;
  };

  const handleExport = (format) => {
    onExport(format);
    setExportDropdownOpen(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-soft p-4 mb-6">
      {/* Desktop Filters */}
      <div className="hidden md:block">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Date Range */}
          <div className="flex items-center space-x-2">
            <Input
              type="date"
              label="From"
              value={filters?.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
              className="w-40"
            />
            <Input
              type="date"
              label="To"
              value={filters?.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
              className="w-40"
            />
          </div>

          {/* Type Filter */}
          <div className="min-w-32">
            <label className="block text-sm font-medium text-foreground mb-1">Type</label>
            <select
              value={filters?.type}
              onChange={(e) => handleFilterChange('type', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              {transactionTypes?.map(type => (
                <option key={type?.value} value={type?.value}>{type?.label}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="min-w-40">
            <label className="block text-sm font-medium text-foreground mb-1">Category</label>
            <select
              value={filters?.category}
              onChange={(e) => handleFilterChange('category', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              {categories?.map(category => (
                <option key={category?.value} value={category?.value}>{category?.label}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-64">
            <Input
              type="search"
              label="Search"
              placeholder="Search transactions..."
              value={filters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
            />
          </div>
        </div>

        {/* Results and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-text-secondary">
              {resultsCount} transaction{resultsCount !== 1 ? 's' : ''} found
            </span>
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-destructive hover:text-destructive"
              >
                <Icon name="X" size={16} />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              iconName="Download"
              iconPosition="left"
            >
              Export
              <Icon name="ChevronDown" size={16} className="ml-2" />
            </Button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevated z-50">
                <div className="py-1">
                  <button
                    onClick={() => handleExport('csv')}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name="FileText" size={16} />
                    <span>Export as CSV</span>
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name="Code" size={16} />
                    <span>Export as JSON</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Filters */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            iconName="Filter"
            iconPosition="left"
          >
            Filters
            {hasActiveFilters() && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </Button>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">
              {resultsCount} found
            </span>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              >
                <Icon name="Download" size={16} />
              </Button>

              {exportDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-popover border border-border rounded-lg shadow-elevated z-50">
                  <div className="py-1">
                    <button
                      onClick={() => handleExport('csv')}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                    >
                      <Icon name="FileText" size={14} />
                      <span>CSV</span>
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                    >
                      <Icon name="Code" size={14} />
                      <span>JSON</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Panel */}
        {isFilterPanelOpen && (
          <div className="space-y-4 pb-4 border-t border-border pt-4">
            <Input
              type="search"
              label="Search"
              placeholder="Search transactions..."
              value={filters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="From"
                value={filters?.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
              />
              <Input
                type="date"
                label="To"
                value={filters?.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                <select
                  value={filters?.type}
                  onChange={(e) => handleFilterChange('type', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  {transactionTypes?.map(type => (
                    <option key={type?.value} value={type?.value}>{type?.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                <select
                  value={filters?.category}
                  onChange={(e) => handleFilterChange('category', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  {categories?.map(category => (
                    <option key={category?.value} value={category?.value}>{category?.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters() && (
              <Button
                variant="ghost"
                fullWidth
                onClick={() => {
                  onClearFilters();
                  setIsFilterPanelOpen(false);
                }}
                className="text-destructive hover:text-destructive"
              >
                <Icon name="X" size={16} />
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>
      {/* Overlay for mobile export dropdown */}
      {exportDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setExportDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default FilterToolbar;