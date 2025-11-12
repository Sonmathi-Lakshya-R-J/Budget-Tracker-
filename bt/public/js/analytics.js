import { analyticsAPI } from './api.js';

let monthlyChart = null;
let categoryChart = null;
let trendsChart = null;

// Initialize analytics
export const initAnalytics = async () => {
  await loadAnalytics();
};

// Load all analytics data
const loadAnalytics = async () => {
  try {
    const currentYear = new Date().getFullYear();
    
    // Load monthly comparison
    const monthlyData = await analyticsAPI.getMonthlyComparison(currentYear);
    renderMonthlyChart(monthlyData);
    
    // Load category expenses
    const categoryData = await analyticsAPI.getCategoryExpenses();
    renderCategoryChart(categoryData);
    
    // Load spending trends
    const trendsData = await analyticsAPI.getSpendingTrends(6);
    renderTrendsChart(trendsData);
    
    // Load top categories
    const topCategories = await analyticsAPI.getTopCategories(5);
    renderTopCategories(topCategories);
  } catch (error) {
    console.error('Failed to load analytics:', error);
  }
};

// Render monthly income vs expense chart
const renderMonthlyChart = (data) => {
  const ctx = document.getElementById('monthly-chart');
  if (!ctx) return;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const incomeData = [];
  const expenseData = [];

  for (let i = 1; i <= 12; i++) {
    incomeData.push(data[i]?.income || 0);
    expenseData.push(data[i]?.expense || 0);
  }

  if (monthlyChart) {
    monthlyChart.destroy();
  }

  monthlyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: 'rgba(76, 175, 80, 0.7)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 1
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: 'rgba(244, 67, 54, 0.7)',
          borderColor: 'rgba(244, 67, 54, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '₹' + value.toFixed(0);
            }
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    }
  });
};

// Render category expense pie chart
const renderCategoryChart = (data) => {
  const ctx = document.getElementById('category-chart');
  if (!ctx) return;

  const categories = Object.keys(data);
  const amounts = Object.values(data);

  if (categories.length === 0) {
    ctx.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No expense data available</p>';
    return;
  }

  // Generate colors
  const colors = generateColors(categories.length);

  if (categoryChart) {
    categoryChart.destroy();
  }

  categoryChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categories,
      datasets: [{
        data: amounts,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'right'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
};

// Render spending trends line chart
const renderTrendsChart = (data) => {
  const ctx = document.getElementById('trends-chart');
  if (!ctx) return;

  const dates = Object.keys(data).sort();
  const amounts = dates.map(date => data[date]);

  if (dates.length === 0) {
    ctx.parentElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No trend data available</p>';
    return;
  }

  if (trendsChart) {
    trendsChart.destroy();
  }

  trendsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates.map(date => new Date(date).toLocaleDateString()),
      datasets: [{
        label: 'Daily Spending',
        data: amounts,
        borderColor: 'rgba(33, 150, 243, 1)',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '₹' + value.toFixed(0);
            }
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    }
  });
};

// Render top categories
const renderTopCategories = (categories) => {
  const container = document.getElementById('top-categories');
  if (!container) return;

  if (categories.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No category data available</p>';
    return;
  }

  container.innerHTML = categories.map((cat, index) => `
    <div class="category-item">
      <span><strong>${index + 1}.</strong> ${cat.category}</span>
      <span style="font-weight: bold; color: var(--expense-color);">₹${cat.amount.toFixed(2)}</span>
    </div>
  `).join('');
};

// Generate colors for charts
const generateColors = (count) => {
  const colors = [
    'rgba(33, 150, 243, 0.7)',
    'rgba(76, 175, 80, 0.7)',
    'rgba(255, 152, 0, 0.7)',
    'rgba(156, 39, 176, 0.7)',
    'rgba(244, 67, 54, 0.7)',
    'rgba(0, 188, 212, 0.7)',
    'rgba(255, 87, 34, 0.7)',
    'rgba(63, 81, 181, 0.7)',
    'rgba(205, 220, 57, 0.7)',
    'rgba(233, 30, 99, 0.7)'
  ];

  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  return result;
};

// Refresh analytics (called when transactions change)
export const refreshAnalytics = async () => {
  await loadAnalytics();
};

