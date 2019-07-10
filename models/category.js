/*jshint esversion: 6 */

const mongoose = require('mongoose');
var Counter = require('./counter');
var Schema = mongoose.Schema;

let CategorySchema = Schema({
    
    id: { type: Number, required: false},
    name: { type:String,required: false },
    createdAt: {
        type: Date,
        required: false,
        default : Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
    
},{runSettersOnQuery: true,usePushEach: true} 
// 'runSettersOnQuery' is used to implement the specifications in our model schema such as the 'trim' option
);

CategorySchema.pre('save', function(next){
    var doc = this; 
    Counter.findByIdAndUpdate({_id: 'category'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        if(!counter){
            var incCounter = new Counter();
            incCounter._id = "category";
            incCounter.seq = 1;
            incCounter.save(function(err){
                if(err)
                    return next(err);

                doc.id = incCounter.seq;
                next();
            })
        }else{
            doc.id = counter.seq;
            next();
        }
    });
});



CategorySchema.methods.toWeb = function (pw) {
    return this.toJSON();
};
// create the model for users and expose it to our app
module.exports = mongoose.model('Category', CategorySchema);