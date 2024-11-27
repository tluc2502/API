var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const mongoose = require('mongoose');
require('./models/usermodels');
require('./models/sinhvienModels');
require('./models/sanphamModels');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var SinhVienRouter = require('./routes/SinhVien');
var mailRouter = require('./routes/mail');
var SanphamRouter = require('./routes/sanpham');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb+srv://tluc2502:tluc2502@pro103.j7t5g.mongodb.net/pro103')
  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch(err => console.log('>>>>>>>>> DB Error: ', err));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sinhvien', SinhVienRouter);
app.use('/mail', mailRouter);
app.use('/sanpham', SanphamRouter);

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
