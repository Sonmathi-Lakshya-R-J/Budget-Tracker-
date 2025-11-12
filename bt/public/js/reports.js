import { reportsAPI } from './api.js';

// Initialize reports module
export const initReports = () => {
  setupMonthlyReport();
  setupYearlyReport();
  setupCSVExport();
};

// Setup monthly report
const setupMonthlyReport = () => {
  const btn = document.getElementById('generate-monthly-report');
  const monthInput = document.getElementById('report-month');
  const yearInput = document.getElementById('report-year');
  const content = document.getElementById('monthly-report-content');

  // Set defaults
  const now = new Date();
  monthInput.value = now.getMonth() + 1;
  yearInput.value = now.getFullYear();

  btn.addEventListener('click', async () => {
    const month = parseInt(monthInput.value);
    const year = parseInt(yearInput.value);

    if (!month || !year) {
      alert('Please enter both month and year');
      return;
    }

    if (month < 1 || month > 12) {
      alert('Month must be between 1 and 12');
      return;
    }

    try {
      const report = await reportsAPI.getMonthlyReport(year, month);
      renderMonthlyReport(report);
    } catch (error) {
      alert('Failed to generate report: ' + error.message);
    }
  });
};

// Render monthly report
const renderMonthlyReport = (report) => {
  const content = document.getElementById('monthly-report-content');
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const monthName = monthNames[report.period.month - 1];
  
  let categoryHtml = '';
  if (Object.keys(report.categoryExpenses).length > 0) {
    categoryHtml = '<h4>Category Breakdown:</h4><ul style="list-style: none; padding: 0;">';
    Object.entries(report.categoryExpenses)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, amount]) => {
        categoryHtml += `<li style="padding: 5px 0; border-bottom: 1px solid var(--border-color);">
          <strong>${category}:</strong> ₹${amount.toFixed(2)}
        </li>`;
      });
    categoryHtml += '</ul>';
  }

  content.innerHTML = `
    <h4>${monthName} ${report.period.year} Report</h4>
    <p><strong>Total Income:</strong> ₹${report.totalIncome.toFixed(2)}</p>
    <p><strong>Total Expenses:</strong> ₹${report.totalExpense.toFixed(2)}</p>
    <p><strong>Net Savings:</strong> ₹${report.netSavings.toFixed(2)}</p>
    <p><strong>Transaction Count:</strong> ${report.transactionCount}</p>
    ${categoryHtml}
  `;
};

// Setup yearly report
const setupYearlyReport = () => {
  const btn = document.getElementById('generate-yearly-report');
  const yearInput = document.getElementById('report-year-only');
  const content = document.getElementById('yearly-report-content');

  // Set default
  yearInput.value = new Date().getFullYear();

  btn.addEventListener('click', async () => {
    const year = parseInt(yearInput.value);

    if (!year) {
      alert('Please enter a year');
      return;
    }

    try {
      const report = await reportsAPI.getYearlyReport(year);
      renderYearlyReport(report);
    } catch (error) {
      alert('Failed to generate report: ' + error.message);
    }
  });
};

// Render yearly report
const renderYearlyReport = (report) => {
  const content = document.getElementById('yearly-report-content');
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  let monthlyHtml = '<h4>Monthly Breakdown:</h4><table style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
  monthlyHtml += '<tr style="border-bottom: 2px solid var(--border-color);"><th style="text-align: left; padding: 8px;">Month</th><th style="text-align: right; padding: 8px;">Income</th><th style="text-align: right; padding: 8px;">Expense</th><th style="text-align: right; padding: 8px;">Net</th></tr>';
  
  for (let i = 1; i <= 12; i++) {
    const monthData = report.monthlyBreakdown[i];
    const net = monthData.income - monthData.expense;
    monthlyHtml += `<tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 8px;">${monthNames[i - 1]}</td>
      <td style="text-align: right; padding: 8px; color: var(--income-color);">₹${monthData.income.toFixed(2)}</td>
      <td style="text-align: right; padding: 8px; color: var(--expense-color);">₹${monthData.expense.toFixed(2)}</td>
      <td style="text-align: right; padding: 8px; font-weight: bold;">₹${net.toFixed(2)}</td>
    </tr>`;
  }
  monthlyHtml += '</table>';

  let categoryHtml = '';
  if (Object.keys(report.categoryExpenses).length > 0) {
    categoryHtml = '<h4 style="margin-top: 20px;">Top Categories:</h4><ul style="list-style: none; padding: 0;">';
    Object.entries(report.categoryExpenses)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([category, amount]) => {
        categoryHtml += `<li style="padding: 5px 0; border-bottom: 1px solid var(--border-color);">
          <strong>${category}:</strong> ₹${amount.toFixed(2)}
        </li>`;
      });
    categoryHtml += '</ul>';
  }

  content.innerHTML = `
    <h4>${report.year} Yearly Report</h4>
    <p><strong>Total Income:</strong> ₹${report.totalIncome.toFixed(2)}</p>
    <p><strong>Total Expenses:</strong> ₹${report.totalExpense.toFixed(2)}</p>
    <p><strong>Net Savings:</strong> ₹${report.netSavings.toFixed(2)}</p>
    <p><strong>Transaction Count:</strong> ${report.transactionCount}</p>
    ${monthlyHtml}
    ${categoryHtml}
  `;
};

// Setup CSV export
const setupCSVExport = () => {
  const btn = document.getElementById('export-csv-btn');
  const startDateInput = document.getElementById('export-start-date');
  const endDateInput = document.getElementById('export-end-date');

  btn.addEventListener('click', async () => {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    try {
      await reportsAPI.exportCSV(startDate, endDate);
      alert('CSV file downloaded successfully!');
    } catch (error) {
      alert('Failed to export CSV: ' + error.message);
    }
  });
};

