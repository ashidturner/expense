/*jshint esversion: 6 */

const express 			= require('express');
const router 			= express.Router();

const UserController 	= require('../controllers/UserController');
const ExpenseController 	= require('../controllers/ExpenseController');

require('../middleware/passport');
const auth = require('../middleware/auth');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"Test API", data:{"version_number":"v1.0.0"}});
});

router.post(    '/register',           UserController.create);                                          // Register user
router.post(    '/users/login',     UserController.login);                                              //User login
router.post(    '/users/category',  auth.required,   UserController.addCategory);                                     //adds a category
router.post(    '/users/budget',  auth.required,   UserController.createBudget);                                     //adds a category
router.post(    '/users/generateSummary',  auth.required,   UserController.generateExpenseAndBudgetSummary);         //get expenses grouped by category and the budget of user

router.post(     '/expense',       auth.required, ExpenseController.createExpense);                    //Creates expense for a particular user
router.put(      '/expense',       auth.required, ExpenseController.updateExpense);                     //Updates expense by expenseID
router.delete(   '/expense',       auth.required, ExpenseController.deleteExpense);                     //deletes expense by expenseID


module.exports = router;
