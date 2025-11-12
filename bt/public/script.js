// Main application initialization
import { initAuth, setupAuth } from './js/auth.js';
import { initTransactions, loadTransactions } from './js/transactions.js';
import { initAnalytics, refreshAnalytics } from './js/analytics.js';
import { initBudgets, refreshBudgets } from './js/budgets.js';
import { initReports } from './js/reports.js';
import { initTheme } from './js/theme.js';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize theme
  initTheme();
  
  // Setup auth
  setupAuth();
  
  // Check authentication
  const isAuthenticated = await initAuth();
  
  if (isAuthenticated) {
    // Initialize app modules
    await initializeApp();
  }
});

// Initialize app modules
const initializeApp = async () => {
  // Setup navigation tabs
  setupNavigation();
  
  // Initialize modules
  await initTransactions();
  await initAnalytics();
  await initBudgets();
  initReports();
  
  // Refresh analytics and budgets when transactions change
  // This will be called from transactions.js after updates
  window.refreshAll = async () => {
    await refreshAnalytics();
    await refreshBudgets();
  };
};

// Setup navigation between views
const setupNavigation = () => {
  const tabs = document.querySelectorAll('.tab');
  const views = document.querySelectorAll('.view');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const viewName = tab.dataset.view;
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show corresponding view
      views.forEach(v => v.classList.remove('active'));
      const targetView = document.getElementById(`${viewName}-view`);
      if (targetView) {
        targetView.classList.add('active');
        
        // Refresh analytics when switching to analytics view
        if (viewName === 'analytics') {
          refreshAnalytics();
        }
        
        // Refresh budgets when switching to budgets view
        if (viewName === 'budgets') {
          refreshBudgets();
        }
      }
    });
  });
};

// Global function to refresh all data after transaction changes
window.refreshAfterTransactionChange = async () => {
  await loadTransactions();
  await refreshAnalytics();
  await refreshBudgets();
};
