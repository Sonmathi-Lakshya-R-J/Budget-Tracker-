import { transactionsAPI } from './api.js';

let allTransactions = [];
let editingTransactionId = null;
let categories = [];

// Initialize transactions module
export const initTransactions = async () => {
  await loadCategories();
  await loadTransactions();
  setupTransactionForm();
  setupFilters();
  setupQuickAdd();
};

// Load categories
const loadCategories = async () => {
  try {
    categories = await transactionsAPI.getCategories();
    updateCategoryDatalist();
    updateCategoryFilter();
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
};

// Update category datalist
const updateCategoryDatalist = () => {
  const datalist = document.getElementById('category-list');
  datalist.innerHTML = '';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    datalist.appendChild(option);
  });
};

// Update category filter
const updateCategoryFilter = () => {
  const filter = document.getElementById('filter-category');
  const currentValue = filter.value;
  filter.innerHTML = '<option value="">All Categories</option>';
  
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    if (cat === currentValue) option.selected = true;
    filter.appendChild(option);
  });
};

// Load transactions
export const loadTransactions = async (filters = {}) => {
  try {
    allTransactions = await transactionsAPI.getAll(filters);
    renderTransactions(allTransactions);
    await updateSummary();
  } catch (error) {
    console.error('Failed to load transactions:', error);
  }
};

// Render transactions
const renderTransactions = (transactions) => {
  const list = document.getElementById('transaction-list');
  list.innerHTML = '';

  if (transactions.length === 0) {
    list.innerHTML = '<li style="text-align: center; padding: 20px; color: var(--text-secondary);">No transactions found</li>';
    return;
  }

  transactions.forEach(transaction => {
    const li = document.createElement('li');
    
    const date = new Date(transaction.date).toLocaleDateString();
    const amount = transaction.amount.toFixed(2);
    
    li.innerHTML = `
      <div class="transaction-info">
        <div class="description">${transaction.description}</div>
        <div class="meta">
          <span>${transaction.category}</span>
          <span>${date}</span>
        </div>
      </div>
      <div class="transaction-amount ${transaction.type}">
        ${transaction.type === 'income' ? '+' : '-'}₹${amount}
      </div>
      <div class="transaction-actions">
        <button class="edit-btn" onclick="editTransaction('${transaction._id}')">Edit</button>
        <button class="delete-btn" onclick="deleteTransaction('${transaction._id}')">Delete</button>
      </div>
    `;
    
    list.appendChild(li);
  });
};

// Update summary
const updateSummary = async () => {
  try {
    const summary = await transactionsAPI.getSummary();
    if (summary) {
      document.getElementById('total-income').textContent = `₹${summary.totalIncome.toFixed(2)}`;
      document.getElementById('total-expense').textContent = `₹${summary.totalExpense.toFixed(2)}`;
      document.getElementById('balance').textContent = `₹${summary.balance.toFixed(2)}`;
    }
  } catch (error) {
    console.error('Failed to update summary:', error);
  }
};

// Setup transaction form
const setupTransactionForm = () => {
  const form = document.getElementById('transaction-form');
  const cancelBtn = document.getElementById('cancel-edit-btn');
  
  // Set default date to today
  document.getElementById('date').valueAsDate = new Date();
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const transaction = {
      description: document.getElementById('description').value,
      amount: parseFloat(document.getElementById('amount').value),
      type: document.getElementById('type').value,
      category: document.getElementById('category').value,
      date: document.getElementById('date').value
    };

    try {
      if (editingTransactionId) {
        await transactionsAPI.update(editingTransactionId, transaction);
        editingTransactionId = null;
        cancelBtn.classList.add('hidden');
        document.getElementById('submit-btn').textContent = 'Add Transaction';
      } else {
        await transactionsAPI.create(transaction);
        // Add to categories if new
        if (!categories.includes(transaction.category)) {
          categories.push(transaction.category);
          updateCategoryDatalist();
          updateCategoryFilter();
        }
      }
      
      form.reset();
      document.getElementById('date').valueAsDate = new Date();
      await loadTransactions();
      // Refresh analytics and budgets
      if (window.refreshAll) {
        await window.refreshAll();
      }
    } catch (error) {
      alert('Failed to save transaction: ' + error.message);
    }
  });

  cancelBtn.addEventListener('click', () => {
    editingTransactionId = null;
    form.reset();
    cancelBtn.classList.add('hidden');
    document.getElementById('submit-btn').textContent = 'Add Transaction';
    document.getElementById('date').valueAsDate = new Date();
  });
};

// Edit transaction
window.editTransaction = async (id) => {
  const transaction = allTransactions.find(t => t._id === id);
  if (!transaction) return;

  editingTransactionId = id;
  
  document.getElementById('description').value = transaction.description;
  document.getElementById('amount').value = transaction.amount;
  document.getElementById('type').value = transaction.type;
  document.getElementById('category').value = transaction.category;
  document.getElementById('date').value = new Date(transaction.date).toISOString().split('T')[0];
  
  document.getElementById('cancel-edit-btn').classList.remove('hidden');
  document.getElementById('submit-btn').textContent = 'Update Transaction';
  
  // Scroll to form
  document.getElementById('transaction-form').scrollIntoView({ behavior: 'smooth' });
};

// Delete transaction
window.deleteTransaction = async (id) => {
  if (!confirm('Are you sure you want to delete this transaction?')) return;

  try {
    await transactionsAPI.delete(id);
    await loadTransactions();
    // Refresh analytics and budgets
    if (window.refreshAll) {
      await window.refreshAll();
    }
  } catch (error) {
    alert('Failed to delete transaction: ' + error.message);
  }
};

// Setup filters
const setupFilters = () => {
  const searchInput = document.getElementById('search-input');
  const typeFilter = document.getElementById('filter-type');
  const categoryFilter = document.getElementById('filter-category');
  const startDateFilter = document.getElementById('filter-start-date');
  const endDateFilter = document.getElementById('filter-end-date');
  const clearBtn = document.getElementById('clear-filters');

  const applyFilters = async () => {
    const filters = {};
    if (typeFilter.value) filters.type = typeFilter.value;
    if (categoryFilter.value) filters.category = categoryFilter.value;
    if (startDateFilter.value) filters.startDate = startDateFilter.value;
    if (endDateFilter.value) filters.endDate = endDateFilter.value;

    await loadTransactions(filters);
  };

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allTransactions.filter(t => 
      t.description.toLowerCase().includes(searchTerm) ||
      t.category.toLowerCase().includes(searchTerm)
    );
    renderTransactions(filtered);
  });

  typeFilter.addEventListener('change', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  startDateFilter.addEventListener('change', applyFilters);
  endDateFilter.addEventListener('change', applyFilters);

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    typeFilter.value = '';
    categoryFilter.value = '';
    startDateFilter.value = '';
    endDateFilter.value = '';
    loadTransactions();
  });
};

// Setup quick add button
const setupQuickAdd = () => {
  const quickAddBtn = document.getElementById('quick-add-btn');
  const form = document.getElementById('transaction-form');
  
  quickAddBtn.addEventListener('click', () => {
    form.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('description').focus();
  });
};

// Export for use in other modules
export { updateSummary };

