/*jshint esversion: 8 */

const fs = require('fs');
const Expense = require("../models/expense");
const User = require("../models/user");
const Category = require("../models/category");

/**
 * Creates the expense  
 *
 * @param req
 * @param res
 * @body userId
 * @body categoryId
 * @body amount
 * @body item
 * @returns {Promise<*>}
 */
const createExpense = async function(req,res){
    console.log('creating expense');
    let data = req.body;
    [err,user] = await to(User.findOne({"id":data.userId}));
    if(err) return ReE(res,"Access Denied",403);

    [err,category] = await to(Category.findOne({"id":data.categoryId}));
    if(err) return ReE(res,"Access Denied",403);
    if(!category) return ReE(res,"Category not found",404);
    let expense = new Expense();
    expense.amount = data.amount;
    expense.category = category;
    expense.item = data.item;
    expense.user = user;

    [err,expense] = await to(expense.save());
    if(err) return ReE(res,err,500);
    return ReS(res,{successObject:"expense created successfully"},201);
};

module.exports.createExpense = createExpense;


/**
 * update the expense  
 *
 * @param req
 * @param res
 * @param expenseId
 * @returns {Promise<*>}
 */

const updateExpense =  async function(req,res){
    let body  = req.body;
    let expenseId = req.query.expenseId;
    console.log(expenseId)
    let categoryId = body.categoryId;
    [err,category] = await to(Category.findOne({"id":categoryId}));
    if(err) return ReE(res,"Access Denied",403);
    
    if(!category) return ReE(res, {   errorDescription:"Category not found" },404);
    body.category = category;
    [err,updatedExpense] = await to(Expense.findOneAndUpdate({"id":expenseId},{"$set":body}));
    
    if(err) return ReE(res, {   errorDescription:"Error while updating expense" },500);

    return ReS(res, {successObject: "Updated expense successfully"},204);
}

module.exports.updateExpense = updateExpense;
