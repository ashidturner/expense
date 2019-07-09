require('./config/config');     
require('./global_functions'); 
const express = require('express');
const passport = require('passport')
var router = express.Router();
let app = express();
// require('./js/index.js')
const logger 	    = require('morgan');
const bodyParser = require('body-parser');



const mongoose   = require('mongoose').set('debug', true);;
const uristring = `${CONFIG.db_dialect}://${CONFIG.db_host}:${CONFIG.db_port}/${CONFIG.db_name}`;

if(process.env.NODE_ENV != 'testing') {
	app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, Content-Type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});


const v1 = require('./routes/v1');

//Passport
app.use(passport.initialize());

//DATABASE
// const models = require("./api/models");

mongoose.Promise = global.Promise;
mongoose.connect(uristring, {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE
},function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});




app.use('/', function(req, res){
  res.statusCode = 200;//send the appropriate status code
  res.json({status:"success", message:"Welcome home", data:{}})
});



app.use('/v1', v1);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message; res.locals.error = req.app.get('env') === 'development' ? err : {};

 	
  // render the error page
  res.status(err.status || 500);
  res.send('error');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// if(process.env.NODE_ENV != 'testing') {
// 	app.listen(5000)
// }

module.exports = app;