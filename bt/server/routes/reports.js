const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { authenticate } = require('../middleware/auth');

// Generate CSV export
router.get('/export/csv', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    // Generate CSV
    let csv = 'Date,Description,Type,Category,Amount\n';
    transactions.forEach(t => {
      const date = new Date(t.date).toISOString().split('T')[0];
      csv += `${date},"${t.description}",${t.type},${t.category},${t.amount}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate monthly report
router.get('/monthly', authenticate, async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required' });
    }

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

    const transactions = await Transaction.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryExpenses = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
      });

    res.json({
      period: { year: parseInt(year), month: parseInt(month) },
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      categoryExpenses,
      transactionCount: transactions.length,
      transactions: transactions.slice(0, 50) // Limit for response size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate yearly report
router.get('/yearly', authenticate, async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ error: 'Year is required' });
    }

    const startDate = new Date(parseInt(year), 0, 1);
    const endDate = new Date(parseInt(year), 11, 31, 23, 59, 59);

    const transactions = await Transaction.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const monthlyBreakdown = {};
    for (let i = 0; i < 12; i++) {
      monthlyBreakdown[i + 1] = { income: 0, expense: 0 };
    }

    transactions.forEach(t => {
      const month = new Date(t.date).getMonth() + 1;
      if (t.type === 'income') {
        monthlyBreakdown[month].income += t.amount;
      } else {
        monthlyBreakdown[month].expense += t.amount;
      }
    });

    const totalIncome = Object.values(monthlyBreakdown)
      .reduce((sum, m) => sum + m.income, 0);
    const totalExpense = Object.values(monthlyBreakdown)
      .reduce((sum, m) => sum + m.expense, 0);

    const categoryExpenses = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
      });

    res.json({
      year: parseInt(year),
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      monthlyBreakdown,
      categoryExpenses,
      transactionCount: transactions.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

