const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

/** DB setting */
// mongodb connect
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

// Database: create english-edu database and connect
const databaseUrl = 'mongodb://localhost:27017/english-edu';
const connect = mongoose.connect(databaseUrl,
    {useMongoClient: true}
);
// automatically increase primary key
autoIncrement.initialize(connect);

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log('mongodb connection success!');
});

// Router
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware setting
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 업로드 path 추가
app.use('/uploads', express.static('uploads'));

// Routing
app.use('/learn', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
