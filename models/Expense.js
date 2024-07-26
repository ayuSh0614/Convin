const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  description: String,
  totalAmount: {
    type: Number,
    required: true,
  },
  splitType: {
    type: String,
    enum: ['exact', 'percent', 'equal'],
    required: true,
  },
  splitDetails: {
    type: Map,
    of: Number,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
