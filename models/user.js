/*jshint esversion: 6 */

const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Counter = require('./counter');
var Schema = mongoose.Schema;
const jwt               = require('jsonwebtoken');

let UserSchema = Schema({
    id: {type: Number},
    firstName: {
        type: String,
        trim:true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true  
    },
    gender: {
        type: String
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

    },
    mobileNumber:{
        type:String,
        minlength:10
    }
},{runSettersOnQuery: true,usePushEach: true} 
// 'runSettersOnQuery' is used to implement the specifications in our model schema such as the 'trim' option
)

UserSchema.pre('save', function(next){
    var doc = this; 
    Counter.findByIdAndUpdate({_id: 'user'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        if(!counter){
            var incCounter = new Counter();
            incCounter._id = "user";
            incCounter.seq = 1;
            incCounter.save(function(err){
                if(err)
                    return next(err);

                doc.id = incCounter.seq;
                next();
            });
        }else{
            doc.id = counter.seq;
            next();
        }
    });
});
// methods ======================
// generating a hash
UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.getJWT = function () {
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    return "Bearer "+jwt.sign({id:this.id}, CONFIG.jwt_encryption, {expiresIn: expiration_time});
};


UserSchema.methods.toWeb = function (pw) {
    return this.toJSON();
};

UserSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
  
    return jwt.sign({
      email: this.email,
      id: this.id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
  }

UserSchema.methods.toAuthJSON = function() {
    return {
      _id: this._id,
      email: this.email,
      token: this.generateJWT(),
    };
  };
// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema);