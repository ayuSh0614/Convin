const Expense = require('../models/Expense');
const Joi = require('joi');

// Adding an expense
exports.addExpense = async (req, res) => {
  const schema = Joi.object({
    description: Joi.string(),
    totalAmount: Joi.number().positive().required(),
    splitType: Joi.string().valid('exact', 'percent', 'equal').required(),
    splitDetails: Joi.object().pattern(Joi.string(), Joi.number().positive()).required(),
    participants: Joi.array().items(Joi.string().hex().length(24)).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Balance sheet generation
exports.getBalanceSheet = async (req, res) => {
  try {
    const expenses = await Expense.find({ participants: req.params.userId });
    // Logic for calculating balance sheets
    res.json(expenses);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
