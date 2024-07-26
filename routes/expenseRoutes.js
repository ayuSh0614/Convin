const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middlewares/auth');

router.post('/', auth, expenseController.addExpense);
router.get('/balance/:userId', auth, expenseController.getBalanceSheet);

module.exports = router;
