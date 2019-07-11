/*jshint esversion: 6 */

const mongoose = require('mongoose');
var Counter = require('./counter');
var Schema = mongoose.Schema;

let ExpenseSchema = Schema({
    id: {type: Number},
    category: {
        type: Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    item:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    isActive: {
        type:Boolean,
        default:true
    },
    createdAt: {
        type: Date,
        required: false,
        default : Date.now

    },
    updatedAt: {
        type: Date,
        required: false,
        default : Date.now

    }
},{runSettersOnQuery: true,usePushEach: true} 
// 'runSettersOnQuery' is used to implement the specifications in our model schema such as the 'trim' option
);

ExpenseSchema.pre('save', function(next){
    var doc = this; 
    Counter.findByIdAndUpdate({_id: 'expense'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        if(!counter){
            var incCounter = new Counter();
            incCounter._id = "expense";
            incCounter.seq = 1;
            incCounter.save(function(err){
                if(err)
                    return next(err)

                doc.id = incCounter.seq;
                next();
            })
        }else{
            doc.id = counter.seq;
            next();
        }
    });
});



ExpenseSchema.methods.toWeb = function (pw) {
    return this.toJSON();
};

// create the model for expenses and expose it to our app
module.exports = mongoose.model('Expense', ExpenseSchema);