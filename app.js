var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//上线：
//设置静态资源的地址，因为打包后的资源都在/build路径下，所以我们把/build设置成静态资源地址
//把访问"/"这个路径开头的全部拦截下来，设置成静态资源地址，通过中间件的形式做一些转发
app.use("/",express.static(path.resolve('build')))
//使用中间件设置白名单
app.use(function(req,res,next){
  console.log(req.url)
  //如果是这两个路径前缀，就不是渲染文件相关的请求，直接next
  if (req.url.startsWith('/api/')||req.url.startsWith('/static/')) {
    return next()
  }
  //反之，如果不是，就手动渲染index.html文件
  return res.sendFile(path.resolve('build/index.html'))
})



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/users', usersRouter);

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
