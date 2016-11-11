'use strict'
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// 引入建立 session 必备的模块
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose =require("mongoose");
const logger = require('morgan');
//定义路由
const routes = require('./config/routes')
mongoose.connect("mongodb://115.28.73.185:27017/page");
mongoose.connection.on("error",function(error){
    console.log("数据库连接失败："+ error);
});
mongoose.connection.on("open",function(){
    console.log("------数据库连接成功！------");
});
// 生成一个 express 实例
const app = express();
// 设置视图文件存放目录
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'html' );
app.engine( '.html', require( 'ejs' ).__express );
// app.set('view engine', 'ejs');
// 设置静态文件存放目录
app.use(express.static(path.join(__dirname, 'public')));
// 解析 urlencoded 请求体必备
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.locals.moment = require('moment');
app.use(session({
  key: 'session',
  secret: 'Keboard cat',
  cookie: {maxAge: 1000 * 60 * 60 * 24},
  store: new MongoStore({
    db: 'page',
    mongooseConnection: mongoose.connection
  }),
  resave: false,
  saveUninitialized: true,
}));
if('development' === app.get('env')){
    //打开调试模式
    app.set('showStackError',true);
    //在控制台打印 路由信息
    app.use(logger(':method :url :status'));
    //不再压缩html页面代码，也就是F12打开后的页面代码
    app.locals.pretty = true;
    mongoose.set('debug',true);
}
require('./config/routes')(app);
app.listen(3000, function(req, res) {
    console.log('app is running at port 3000');
});