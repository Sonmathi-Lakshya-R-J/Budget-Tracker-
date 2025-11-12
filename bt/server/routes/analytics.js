const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { authenticate } = require('../middleware/auth');

// Get monthly income vs expense data
router.get('/monthly-comparison', authenticate, async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31, 23, 59, 59);

    const transactions = await Transaction.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const monthlyData = {};
    for (let i = 0; i < 12; i++) {
      monthlyData[i + 1] = { income: 0, expense: 0 };
    }

    transactions.forEach(t => {
      const month = new Date(t.date).getMonth() + 1;
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expense += t.amount;
      }
    });

    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get category-wise expense breakdown
router.get('/category-expenses', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {
      userId: req.userId,
      type: 'expense'
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query);

    const categoryData = {};
    transactions.forEach(t => {
      categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
    });

    res.json(categoryData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get spending trends over time
router.get('/spending-trends', authenticate, async (req, res) => {
  try {
    const { months = 6 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    const transactions = await Transaction.find({
      userId: req.userId,
      type: 'expense',
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    const trendData = {};
    transactions.forEach(t => {
      const dateKey = t.date.toISOString().split('T')[0];
      trendData[dateKey] = (trendData[dateKey] || 0) + t.amount;
    });

    res.json(trendData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top spending categories
router.get('/top-categories', authenticate, async (req, res) => {
  try {
    const { limit = 5, startDate, endDate } = req.query;
    const query = {
      userId: req.userId,
      type: 'expense'
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query);

    const categoryTotals = {};
    transactions.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const topCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, parseInt(limit));

    res.json(topCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

