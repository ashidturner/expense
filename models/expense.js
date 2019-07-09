const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Counter = require('./counter');
var Schema = mongoose.Schema;
const jwt               = require('jsonwebtoken');

let ExpenseSchema = Schema({
    id: {type: Number},
    category: {
        type:String,
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
    createdAt: {
        type: Date,
        required: false,
        default : Date.now

    },
    userId: {
        type: Number,
        required:true
    },
    updatedAt: {
        type: Date,
        required: false,
        default : Date.now

    }
},{runSettersOnQuery: true,usePushEach: true} 
// 'runSettersOnQuery' is used to implement the specifications in our model schema such as the 'trim' option
)

ExpenseSchema.pre('save', function(next){
    var doc = this; 
    Counter.findByIdAndUpdate({_id: 'expense'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        if(!counter){
            var counter = new Counter();
            counter._id = "expense";
            counter.seq = 1;
            counter.save(function(err){
                if(err)
                    return next(err)

                doc.id = counter.seq;
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