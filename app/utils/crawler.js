var http = require('http');
var url = 'http://www.biquku.com/xiaoshuodaquan/';
var StoryCategory = require('../models/storyCategory');
var cheerio = require('cheerio');
var iconv = require('iconv-lite')
var fs = require('fs');
exports.crawlerAll = function(){
	http.get(url, function(res){
	    var html = '';
	    res.on('data', function(data){
	    	html += iconv.decode(data, 'GBK')
	    })
	    res.on('end',function(){
	        var storiesMessage = crawlerChapter(html);
	        printInfo(storiesMessage);
	    })
	}).on('error', function(){
	    console.log('爬取页面错误');
	});
}
function crawlerChapter(html){
	var $ = cheerio.load(html);
	var stories = $('.novellist');
	var data = [];
	stories.map(function(i,el){
		var player = $(this);
		var categoryname = player.find('h2').text().trim();
		var categories = player.find('ul li');
		categories.map(function(j,el){
			var li = $(this);
			var storyname = li.find('a').text().trim();
			var _author = li.text().trim();
			var author = _author.split('/')[1];
			var link = li.find('a').attr('href').trim();
			var number = link.subString(22,23);
			var storyData = {
				number : i,
				categoryname : categoryname,
				storyname : storyname,
				author : author,
				link : link
			};
			data.push(storyData);
		});
	});
	return data;
}
function printInfo(data){
	data.forEach(function(story){
		var _story = new StoryCategory(story)
		_story.save(function(err,story){
			if(err){
			console.log(err);
		}
		})
	})
	console.log('ok');
}
