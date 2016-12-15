var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./config');
var routes = require('./routes/index');
var api = require('./routes/api');

/*Kết nối database*/
// load mongoose package
var mongoose = require('mongoose');
// Use native Node promises
mongoose.Promise = global.Promise;
// connect to MongoDB
// mongoose.connect('mongodb://huuduy005:HuuDuy005lk#@ds031607.mlab.com:31607/sticket')//'mongodb://localhost/HD')
//     .then(() => console.log('Kết nối database thành công' + process.env.MONGOLAB_URI))
//     .catch((err) => console.error(err));
var db = mongoose.connect('mongodb://localhost/HD');//config.database);
//var db = mongoose.connect(config.database);
db
    .then(function () {
        console.log('Kết nối thành công đến' + config.database);
    })
    .catch(function (err) {
        console.error(err);
    });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
