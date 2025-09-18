import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/Appicon';
import Button from '../../components/ui/Button';
import TransactionTable from './components/TransactionTable';
import FilterToolbar from './components/FilterToolbar';
import TransactionModal from './components/TransactionModal.jsx';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    type: '',
    category: '',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 10;

  // Mock transaction data
  const mockTransactions = [
    {
      id: 1,
      amount: 2500.00,
      type: 'income',
      category: 'Salary',
      date: '2024-09-01',
      notes: 'Monthly salary payment'
    },
    {
      id: 2,
      amount: 45.50,
      type: 'expense',
      category: 'Food & Dining',
      date: '2024-09-02',
      notes: 'Lunch at downtown restaurant'
    },
    {
      id: 3,
      amount: 120.00,
      type: 'expense',
      category: 'Transportation',
      date: '2024-09-03',
      notes: 'Monthly metro pass'
    },
    {
      id: 4,
      amount: 800.00,
      type: 'income',
      category: 'Freelance',
      date: '2024-09-04',
      notes: 'Web development project payment'
    },
    {
      id: 5,
      amount: 89.99,
      type: 'expense',
      category: 'Shopping',
      date: '2024-09-05',
      notes: 'New running shoes'
    },
    {
      id: 6,
      amount: 25.00,
      type: 'expense',
      category: 'Entertainment',
      date: '2024-09-06',
      notes: 'Movie tickets'
    },
    {
      id: 7,
      amount: 150.00,
      type: 'expense',
      category: 'Bills & Utilities',
      date: '2024-09-07',
      notes: 'Electricity bill'
    },
    {
      id: 8,
      amount: 75.00,
      type: 'expense',
      category: 'Healthcare',
      date: '2024-09-08',
      notes: 'Doctor consultation'
    },
    {
      id: 9,
      amount: 500.00,
      type: 'income',
      category: 'Investment',
      date: '2024-09-09',
      notes: 'Dividend payment'
    },
    {
      id: 10,
      amount: 32.50,
      type: 'expense',
      category: 'Food & Dining',
      date: '2024-09-10',
      notes: 'Grocery shopping'
    },
    {
      id: 11,
      amount: 200.00,
      type: 'expense',
      category: 'Transportation',
      date: '2024-09-11',
      notes: 'Car maintenance'
    },
    {
      id: 12,
      amount: 60.00,
      type: 'expense',
      category: 'Entertainment',
      date: '2024-09-12',
      notes: 'Concert tickets'
    },
    {
      id: 13,
      amount: 1200.00,
      type: 'income',
      category: 'Freelance',
      date: '2024-09-13',
      notes: 'Mobile app development'
    },
    {
      id: 14,
      amount: 95.00,
      type: 'expense',
      category: 'Bills & Utilities',
      date: '2024-09-14',
      notes: 'Internet bill'
    },
    {
      id: 15,
      amount: 40.00,
      type: 'expense',
      category: 'Other',
      date: '2024-09-15',
      notes: 'Miscellaneous expenses'
    }
  ];

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Salary',
    'Freelance',
    'Investment',
    'Other'
  ];

  // Load mock data
  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTransactions(mockTransactions);
      setIsLoading(false);
    };

    loadTransactions();
  }, []);

  // Filter and sort transactions
  const processedTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply filters
    if (filters?.dateFrom) {
      filtered = filtered?.filter(t => t?.date >= filters?.dateFrom);
    }
    if (filters?.dateTo) {
      filtered = filtered?.filter(t => t?.date <= filters?.dateTo);
    }
    if (filters?.type) {
      filtered = filtered?.filter(t => t?.type === filters?.type);
    }
    if (filters?.category) {
      filtered = filtered?.filter(t => t?.category === filters?.category);
    }
    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase();
      filtered = filtered?.filter(t => 
        t?.category?.toLowerCase()?.includes(searchLower) ||
        t?.notes?.toLowerCase()?.includes(searchLower) ||
        t?.amount?.toString()?.includes(searchLower)
      );
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (sortConfig?.key === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortConfig?.key === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = aValue?.toString()?.toLowerCase() || '';
        bValue = bValue?.toString()?.toLowerCase() || '';
      }

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [transactions, filters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(processedTransactions?.length / itemsPerPage);
  const paginatedTransactions = processedTransactions?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      type: '',
      category: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev?.filter(t => t?.id !== id));
    }
  };

  const handleSaveTransaction = (transactionData) => {
    if (editingTransaction) {
      // Update existing transaction
      setTransactions(prev => 
        prev?.map(t => t?.id === editingTransaction?.id ? transactionData : t)
      );
    } else {
      // Add new transaction
      setTransactions(prev => [...prev, transactionData]);
    }
  };

  const handleExport = (format) => {
    const dataToExport = processedTransactions?.map(t => ({
      Date: t?.date,
      Type: t?.type,
      Category: t?.category,
      Amount: t?.amount,
      Notes: t?.notes || ''
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(dataToExport?.[0])?.join(','),
        ...dataToExport?.map(row => Object.values(row)?.join(','))
      ]?.join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
      a?.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const json = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date()?.toISOString()?.split('T')?.[0]}.json`;
      a?.click();
      URL.revokeObjectURL(url);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-text-secondary">Loading transactions...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
              <p className="text-text-secondary mt-1">
                Track and manage your income and expenses
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={handleAddTransaction}
                iconName="Plus"
                iconPosition="left"
                size="lg"
              >
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Filter Toolbar */}
          <FilterToolbar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
            resultsCount={processedTransactions?.length}
            onClearFilters={handleClearFilters}
          />

          {/* Transaction Table */}
          <TransactionTable
            transactions={paginatedTransactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            sortConfig={sortConfig}
            onSort={handleSort}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          {/* Empty State */}
          {processedTransactions?.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Receipt" size={48} className="mx-auto text-text-secondary mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No transactions found
              </h3>
              <p className="text-text-secondary mb-6">
                {transactions?.length === 0 
                  ? "Get started by adding your first transaction" :"Try adjusting your filters to see more results"
                }
              </p>
              {transactions?.length === 0 && (
                <Button
                  onClick={handleAddTransaction}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Your First Transaction
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        transaction={editingTransaction}
        categories={categories}
      />
    </div>
  );
};

export default TransactionsPage;