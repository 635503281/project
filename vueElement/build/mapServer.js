var express = require('express');
var path = require('path');
var http = require('http');

const port = '3030';
const static = "../public";

var app = express();

// view engine setup
app.set('views', path.join(__dirname, static));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, static)));

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With,Token,name");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    if(req.method=="OPTIONS") res.send(200);
    next();
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.set('port', port);
var server = http.createServer(app);
server.listen(port,function(){
    console.log(`地图服务器启动了：http://localhost:${port}`);
});

  