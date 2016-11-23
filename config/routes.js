'use strict';

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
// routes
const Index = require('../app/controllers/index');
// var User = require('../app/controllers/user')
// var Movie = require('../app/controllers/movie')
// var Comment = require('../app/controllers/comment')
// var Category = require('../app/controllers/category')
// var Photo = require('../app/controllers/photo')
const Story = require('../app/controllers/story');
const Auth = require('../app/controllers/checkLogin');

module.exports = function(app) {
  // 设置跨域访问
  app.all('/react/*', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
      res.header("X-Powered-By",' 3.2.1');
      res.header("Content-Type", "application/json;charset=utf-8");
      next();
  });
  app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
  });
	// Blog
  app.get('/mmBlog', Index.blog);

	// Index 页面
  app.get('/', Story.index); // 个人网站分类页面
	// Story
  app.get('/story/login', Story.login);// 小说网站登陆界面
  app.get('/story', Auth.noLogin, Story.home); // 网站主页
  app.get('/story/type/:id', Auth.noLogin, Story.type); // 网站类型页面
	// app.get('/story/all',Story.all) // 网站所有小说
  app.get('/story/summary/:_id', Auth.noLogin, Story.summary); // 小说简介页面
  app.get('/story/category/:_id', Auth.noLogin, Story.category); // 小说目录
  app.get('/story/content/:link', Auth.noLogin, Story.content); // 小说内容
  app.get('/story/search/', Story.search); // 小说搜索
  app.post('/story/collect/:_id', Auth.noLogin, Story.collect);
  app.get('/story/bookshelf', Auth.noLogin, Story.bookshelf);
  // app.post('/story/update',Story.update) // 更新全部小说，需要一个按钮

  // react data
  // react home data
  app.post('/react/story', Story.reactData); // 用react获取 小说网站首页数据



};
