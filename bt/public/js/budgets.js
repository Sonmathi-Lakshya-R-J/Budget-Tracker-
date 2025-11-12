import { budgetsAPI } from './api.js';

let allBudgets = [];
let editingBudgetId = null;

// Initialize budgets module
export const initBudgets = async () => {
  await loadBudgets();
  await loadBudgetProgress();
  setupBudgetForm();
  setupAddBudgetButton();
};

// Load budgets
const loadBudgets = async () => {
  try {
    const now = new Date();
    allBudgets = await budgetsAPI.getAll({
      year: now.getFullYear(),
      month: now.getMonth() + 1
    });
    renderBudgets(allBudgets);
  } catch (error) {
    console.error('Failed to load budgets:', error);
  }
};

// Render budgets
const renderBudgets = (budgets) => {
  const container = document.getElementById('budget-list');
  if (!container) return;

  if (budgets.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No budgets set. Create one to get started!</p>';
    return;
  }

  container.innerHTML = budgets.map(budget => `
    <div class="budget-item">
      <div class="budget-header">
        <h4>${budget.category}</h4>
        <span class="budget-amount">₹${budget.amount.toFixed(2)} / ${budget.period}</span>
      </div>
      <div style="margin-top: 10px;">
        <button class="edit-btn" onclick="editBudget('${budget._id}')" style="margin-right: 10px;">Edit</button>
        <button class="delete-btn" onclick="deleteBudget('${budget._id}')">Delete</button>
      </div>
    </div>
  `).join('');
};

// Load budget progress
const loadBudgetProgress = async () => {
  try {
    const now = new Date();
    const progress = await budgetsAPI.getProgress(now.getFullYear(), now.getMonth() + 1);
    renderBudgetProgress(progress);
  } catch (error) {
    console.error('Failed to load budget progress:', error);
  }
};

// Render budget progress
const renderBudgetProgress = (progress) => {
  const container = document.getElementById('budget-progress');
  if (!container) return;

  if (progress.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No budget progress data available</p>';
    return;
  }

  container.innerHTML = progress.map(item => {
    const percentage = Math.min(item.percentage, 100);
    const isOver = item.isOverBudget;
    
    return `
      <div class="budget-item">
        <div class="budget-header">
          <h4>${item.category}</h4>
          <span class="budget-amount">₹${item.spent.toFixed(2)} / ₹${item.budgetAmount.toFixed(2)}</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar ${isOver ? 'over-budget' : ''}" style="width: ${percentage}%">
            ${percentage.toFixed(1)}%
          </div>
        </div>
        <div class="budget-details">
          <span>Remaining: ₹${item.remaining.toFixed(2)}</span>
          ${isOver ? '<span style="color: var(--danger-color); font-weight: bold;">⚠️ Over Budget!</span>' : ''}
        </div>
      </div>
    `;
  }).join('');
};

// Setup budget form
const setupBudgetForm = () => {
  const form = document.getElementById('budget-form');
  const cancelBtn = document.getElementById('cancel-budget-btn');
  
  // Set default year to current year
  const now = new Date();
  document.getElementById('budget-year').value = now.getFullYear();
  document.getElementById('budget-month').value = now.getMonth() + 1;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const budget = {
      category: document.getElementById('budget-category').value,
      amount: parseFloat(document.getElementById('budget-amount').value),
      period: document.getElementById('budget-period').value,
      month: document.getElementById('budget-month').value ? parseInt(document.getElementById('budget-month').value) : undefined,
      year: parseInt(document.getElementById('budget-year').value)
    };

    try {
      if (editingBudgetId) {
        await budgetsAPI.update(editingBudgetId, budget);
        editingBudgetId = null;
        cancelBtn.classList.add('hidden');
      } else {
        await budgetsAPI.create(budget);
      }

      form.reset();
      document.getElementById('budget-year').value = now.getFullYear();
      document.getElementById('budget-month').value = now.getMonth() + 1;
      await loadBudgets();
      await loadBudgetProgress();
    } catch (error) {
      alert('Failed to save budget: ' + error.message);
    }
  });

  cancelBtn.addEventListener('click', () => {
    editingBudgetId = null;
    form.reset();
    cancelBtn.classList.add('hidden');
    const now = new Date();
    document.getElementById('budget-year').value = now.getFullYear();
    document.getElementById('budget-month').value = now.getMonth() + 1;
  });
};

// Setup add budget button
const setupAddBudgetButton = () => {
  const addBtn = document.getElementById('add-budget-btn');
  const form = document.getElementById('budget-form');
  
  addBtn.addEventListener('click', () => {
    form.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('budget-category').focus();
  });
};

// Edit budget
window.editBudget = async (id) => {
  const budget = allBudgets.find(b => b._id === id);
  if (!budget) return;

  editingBudgetId = id;

  document.getElementById('budget-category').value = budget.category;
  document.getElementById('budget-amount').value = budget.amount;
  document.getElementById('budget-period').value = budget.period;
  document.getElementById('budget-month').value = budget.month || '';
  document.getElementById('budget-year').value = budget.year;
  
  document.getElementById('cancel-budget-btn').classList.remove('hidden');
  
  document.getElementById('budget-form').scrollIntoView({ behavior: 'smooth' });
};

// Delete budget
window.deleteBudget = async (id) => {
  if (!confirm('Are you sure you want to delete this budget?')) return;

  try {
    await budgetsAPI.delete(id);
    await loadBudgets();
    await loadBudgetProgress();
  } catch (error) {
    alert('Failed to delete budget: ' + error.message);
  }
};

// Refresh budgets (called when transactions change)
export const refreshBudgets = async () => {
  await loadBudgets();
  await loadBudgetProgress();
};

