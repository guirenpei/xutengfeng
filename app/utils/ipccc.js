var cheerio = require('cheerio');
var charset = require('superagent-charset')
var request = charset(require('superagent'))
var StoryDetail = require('../models/storyDetail')
// var Promise = require('bluebird')
require('superagent-proxy')(request)
var mongoose =require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/page");
mongoose.connection.on("error",function(error){
    console.log("数据库连接失败："+ error);
});
mongoose.connection.on("open",function(){
    console.log("------数据库连接成功！------");
});
var storynumber = ['玄幻小说','修真小说','都市小说','穿越小说','网游小说','科幻小说']
var storydata = []
var DBArray = []
function crawlerDetails(html){
	var $ = cheerio.load(html)
		var items = $('.item')
		items.map(function(i,el){
			var item = $(this)
			console.log('item');
			console.log(item.find('.image a img'));
			console.log(item.find('.image a img').attr('src'));
			var image = item.find('.image a img').attr('src').trim()
			var storyname = item.find('.image a img').attr('alt').trim()
			var categoryname = '玄幻小说'
			var author = item.find('dl dt span').text().trim()
			var link = item.find('dl dt a').attr('href').trim()
			var summary = item.find('dl dd').text().trim()
			var number = parseInt(link.substring(20,21))
			var storyData = {
				number : number,
				categoryname : storynumber[number],
				storyname : storyname,
				author : author,
				image : image,
				link : link,
				summary : summary,
				monthrecommend : Math.floor(Math.random()*100000+ 1),
				monthclick : Math.floor(Math.random()*100000 + 1),
				allrecommend : Math.floor(Math.random()*100000 + 1),
				allclick : Math.floor(Math.random()*100000 + 1),
				allcollection : Math.floor(Math.random()*100000 + 1),
				commentsnumber : Math.floor(Math.random()*100000 + 1),
				lastchapter : ''
			};
			storydata.push(storyData)
		})
	return storydata
}
function saveToDataBase(data){
	var _storyDetail = new StoryDetail(data)
		_storyDetail.save(function(err,story){
			if(err){
			}
		}) 
}
request.get('http://www.37zw.com/xiaoshuo6/index'+ 29 +'.html')
		.charset('gbk')
		.end(function(err,res){
		storydata = crawlerDetails(res.text)
		storydata.forEach(function(story){
			saveToDataBase(story)
		})
	})
