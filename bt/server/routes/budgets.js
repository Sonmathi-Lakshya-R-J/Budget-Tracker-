const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const { authenticate } = require('../middleware/auth');

// Get all budgets for user
router.get('/', authenticate, async (req, res) => {
  try {
    const { year, month } = req.query;
    const query = { userId: req.userId };

    if (year) query.year = parseInt(year);
    if (month) query.month = parseInt(month);

    const budgets = await Budget.find(query).sort({ category: 1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get budget by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update budget
router.post('/', authenticate, async (req, res) => {
  try {
    const { category, amount, period, month, year } = req.body;

    if (!category || !amount || !year) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = {
      userId: req.userId,
      category,
      year: parseInt(year),
      period: period || 'monthly'
    };

    if (month) query.month = parseInt(month);

    const budget = await Budget.findOneAndUpdate(
      query,
      {
        userId: req.userId,
        category,
        amount: parseFloat(amount),
        period: period || 'monthly',
        month: month ? parseInt(month) : undefined,
        year: parseInt(year)
      },
      { new: true, upsert: true }
    );

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update budget
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { amount, period, month, year } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        amount: amount ? parseFloat(amount) : undefined,
        period,
        month: month ? parseInt(month) : undefined,
        year: year ? parseInt(year) : undefined
      },
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete budget
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json({ success: true, message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get budget progress (spent vs budget)
router.get('/progress/current', authenticate, async (req, res) => {
  try {
    const now = new Date();
    const year = parseInt(req.query.year) || now.getFullYear();
    const month = parseInt(req.query.month) || now.getMonth() + 1;

    const budgets = await Budget.find({
      userId: req.userId,
      year,
      month: month || { $exists: false },
      period: 'monthly'
    });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expenses = await Transaction.find({
      userId: req.userId,
      type: 'expense',
      date: { $gte: startDate, $lte: endDate }
    });

    const categorySpending = {};
    expenses.forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });

    const progress = budgets.map(budget => {
      const spent = categorySpending[budget.category] || 0;
      const remaining = budget.amount - spent;
      const percentage = (spent / budget.amount) * 100;

      return {
        budgetId: budget._id,
        category: budget.category,
        budgetAmount: budget.amount,
        spent,
        remaining,
        percentage: Math.min(percentage, 100),
        isOverBudget: spent > budget.amount
      };
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

