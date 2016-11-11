'use strict'
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
//routes
// var Index = require('../app/controllers/index')
// var User = require('../app/controllers/user')
// var Movie = require('../app/controllers/movie')
// var Comment = require('../app/controllers/comment')
// var Category = require('../app/controllers/category')
// var Photo = require('../app/controllers/photo')
const Story = require('../app/controllers/story')

// var Auth = require('../checkLogin')


module.exports = function(app){
	app.use(function(req, res, next){
	    res.locals.user = req.session.user;
	    next();
	});
	//Blog
	// app.get('/',Index.blog)
	//Story
	app.get('/story',Story.home) //网站主页
	// app.get('/story/type/:id',Story.type) //网站类型页面
	// app.get('/story/all',Story.all) //网站所有小说
	app.get('/story/summary/:_id', Story.summary) //小说简介页面
	// app.get('/story/category/:_id',Story.category) //小说目录
	// app.get('/story/content/:link',Story.content) //小说内容
	// app.get('/story/search/:keyname',Story.search) //小说搜索
	// app.post('/story/update',Story.update) //更新全部小说，需要一个按钮
}