var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let session=require('express-session');
var passport=require('passport');
var bodyParser=require('body-parser');
let moment=require('moment');
const url=require('url')



var indexRouter = require('./routes/index');
var postRouter = require('./routes/post');
let categoryRouter=require('./routes/category')

const db = require('monk')('mongodb://127.0.0.1:27017/')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//local data 
app.locals.moment=moment
app.locals.truncateText=(text,num)=>{
  return  text.substring(0,num)
}
app.locals.urlFormater=(urlString)=>{
  return url.format(urlString)
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret:'secret',
  saveUninitialized:true,
  resave:true
}))

app.use(bodyParser.urlencoded({ extended: false}))
// passport init
app.use(passport.initialize())
app.use(passport.session())

//connect flash
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', indexRouter);
app.use('/post', postRouter);
app.use('/category', categoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
