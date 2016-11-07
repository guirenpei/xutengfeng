'use strict'
const StoryCategory = require('../models/storyCategory');
const StoryDetail = require('../models/storyDetail');
const Analyse = require('../utils/analyse');
const fs = require('fs-extra-promise');
const co = require('co');
const request = require('request-promise');
const path = require('path')
const querystring = require('querystring')
const BookFormat = require('../utils/bookFormat')
//分析数据
// const iconv = require('iconv-lite');
// const charset = require('superagent-charset');
// const request = charset(require('superagent'));
// const StoryDetail = require('../models/storyDetail');
// const Promise = require('bluebird');
// require('superagent-proxy')(request);

const storynumber = ['玄幻小说','修真小说','都市小说','穿越小说','网游小说','科幻小说'];
// exports.search = function(req,res){
// 	var keyname = req.params.keyname;
// 	var host = 'so.37zw.com/cse/search';
// 	// var url = Analyse.formatUrl(keyname,host)
// 	// request
// 	// 		.get(host)
// 	// 		.query('q=' + querystring.stringify(keyname))
//  //    	.query('click=1')
//  //    	.query('s=2041213923836881982')
//  //    	.query('nsid=')
// 	// 		.charset('utf-8')
// 	// 		.end(function(err,rep){
// 	// 			// console.log('正在爬取'+url)
// 	// 			var books = Analyse.analyseSearch(rep.text)
// 	// 			var timeStamp = Date.now()
// 	// 			var newPath = path.join(__dirname,'../../','/public/logs/' + timeStamp +'.txt')
// 	// 			fs.writeFile(newPath,JSON.stringify(rep),function(err){
// 	// 				res.render('story/search',{
// 	// 					title : '搜索结果'+ '--星门',
// 	// 					books : books
// 	// 				})
// 	// 			})
// 	// 		})
// 	// 		.on('error',function(err){
// 	// 			console.log(err)
// 	// 		})
// }
// exports.content = function(req,res){
// 	var link = req.params.link;
// 	var _id = req.query._id;
// 	//先取出来小说里面的链接，查看是否kanshu.com的网站
// 	StoryDetail.findById(_id,function(err,story){
// 		request
// 			.get(story.link+link)
// 			.charset('gbk')
// 			.end(function(err,rep){
// 				console.log('正在爬取'+story.link+link)
// 				var content = Analyse.analyseContent(rep.text);
// 				// var content = {
// 				// 	chaptername : '第一章',
// 				// 	chaptercontent : 'cbcbcbcbcbcbcbcbcbcbcbcbcbcacccccccccccccccacacacacacacacacacacacacacaccc'
// 				// }
// 				res.render('story/content',{
// 					title : content.chaptername+' '+ story.author + '--星门',
// 					book : story,
// 					content : content,
// 				})
// 			})
// 			.on('error',function(err){
// 				console.log(err);
// 			})
// 	})
// }
exports.summary = function (req,res){
	var _id = req.params._id;
	var billboard = yield BookFormat.billboard();
	console.log('billboard');
	console.log(billboard);
	StoryDetail
		.find({})
		.sort({allrecommend: -1})
		.limit(10)
		.exec(function(err,story1){
			billboard.recommend = story1
			StoryDetail
				.find({})
				.sort({allclick : -1})
				.limit(10)
				.exec(function(err,story2){
					billboard.click = story2
					StoryDetail.findById(_id,function(err,story3){
						res.render('story/summary',{
							title : story3.storyname + '--星门',
							billboard : billboard,
							book : story3,
						})
					})
			})
		})
}
// exports.category = function(req,res){
// 	var _id = req.params._id;
// 	var chapters = [];
// 	StoryDetail.findById(_id,function(err,story){
// 		request
// 			.get(story.link)
// 			.charset('gbk')
// 			.end(function(err,rep){
// 				console.log('正在爬取'+story.link)
// 				chapters = Analyse.analyseCategory(rep.text);
// 				res.render('story/category',{
// 					title : story.storyname + '--星门',
// 					book : story,
// 					chapters : chapters
// 				})
// 			})
// 			.on('error',function(err){
// 				console.log(err)
// 			})
// 	})
// }
// exports.type = function(req,res){
// 	var id = req.params.id;
// 	var strongrecommend = []; //分类本周强推榜
// 	var adrecommend = []; //分类广告位
// 	var newbook = []; // 新书精选
// 	var prime = []; // 热销作品
// 	var latestbook = []; //分类小说更新
// 	var billboard = {
// 		'recommend' : [{}],
// 		'click' : [{}]
// 	};
// 	StoryDetail
// 		.find({number : id})
// 		.sort({allrecommend : -1})
// 		.limit(10)
// 		.exec(function(err,story1){
// 			strongrecommend = story1
// 			StoryDetail
// 				.find({number : id})
// 				.sort({allcollection : -1})
// 				.limit(5)
// 				.exec(function(err,story2){
// 					adrecommend = story2
// 					StoryDetail
// 						.find({number : id})
// 						.sort({commentsnumber : 1})
// 						.limit(6)
// 						.exec(function(err,story3){
// 							newbook = story3
// 							StoryDetail
// 								.find({number : id})
// 								.sort({commentsnumber : -1})
// 								.limit(5)
// 								.exec(function(err,story4){
// 									prime = story4
// 									StoryDetail
// 										.find({number : id})
// 										.sort({'meta.updateAt' : -1})
// 										.limit(30)
// 										.exec(function(err,story5){
// 											if(err){
// 												console.log(err)
// 											}
// 											latestbook = story5
// 											StoryDetail
// 												.find({})
// 												.sort({allrecommend: -1})
// 												.limit(10)
// 												.exec(function(err,story1){
// 													billboard.recommend = story1
// 													StoryDetail
// 														.find({})
// 														.sort({allclick : -1})
// 														.limit(10)
// 														.exec(function(err,story2){
// 															billboard.click = story2;
// 															res.render('story/story_type',{
// 																title : storynumber[id],
// 																strongrecommend : strongrecommend,
// 																adrecommend : adrecommend,
// 																newbook : newbook,
// 																prime : prime,
// 																latestbook : latestbook,
// 																billboard : billboard,
// 															})
// 														})
// 												})
// 										})
// 								})
// 						})
// 				})
// 		})
// }
exports.home = function(req,res){
	var billboard = {
		'recommend' : [{}],
		'click' : [{}]
	};
	StoryDetail
		.find({})
		.sort({allrecommend: -1})
		.limit(10)
		.exec(function(err,story1){
			billboard.recommend = story1
			StoryDetail
				.find({})
				.sort({allclick : -1})
				.limit(10)
				.exec(function(err,story2){
					billboard.click = story2
					res.render('story/home',{
						title : '遮天小说预制页',
						billboard : billboard,
					});
				})
		})
}
// exports.all = function(req,res){
// 	var cats = []
// 	StoryCategory.find({number:0},function(err,stories){
// 		if(err){
// 			console.log(err)
// 		}
// 		cats.push(stories)
// 		StoryCategory.find({number:1},function(err,stories){
// 			if(err){
// 				console.log(err)
// 			}
// 			cats.push(stories)
// 			StoryCategory.find({number:2},function(err,stories){
// 				if(err){
// 					console.log(err)
// 				}
// 				cats.push(stories)
// 				StoryCategory.find({number:3},function(err,stories){
// 					if(err){
// 						console.log(err)
// 					}
// 					cats.push(stories)
// 					StoryCategory.find({number:4},function(err,stories){
// 						if(err){
// 							console.log(err)
// 						}
// 						cats.push(stories)
// 						StoryCategory.find({number:5},function(err,stories){
// 							if(err){
// 								console.log(err)
// 							}
// 							cats.push(stories)
// 							res.render('story/all',{
// 								title : '遮天小说预制页',
// 								cats : cats
// 							})
// 						})
// 					})
// 				})
// 			})
// 		})
// 	})
// 	// var storyCategory = {
// 	// 	number: 0,
// 	// 	categoryname: "",
// 	// 	storyname: "",
// 	// 	author: "",
// 	// 	link:''
// 	// }
// }
// 	//admin post movie
// exports.save = function(req,res){
// 	var _category = req.body.category
// 	var category = new Category(_category)
// 	category.save(function(err,category){
// 		if(err){
// 			console.log(err);
// 		}
// 		res.redirect('/admin/category/list');
// 	})
// }
// //admin update movie
// exports.update = function(req,res){
// 	console.log('2');
// 	CrawlerAll.crawlerAll()
// }
// //category list page
// exports.list = function(req,res){
// 	Category.fetch(function(err,categories){
// 		if(err){
// 			console.log(err)
// 		}
// 		res.render('categorylist',{
//     	title : '分类列表页',
//     	categories : categories
//     	});
// 	});
// }
