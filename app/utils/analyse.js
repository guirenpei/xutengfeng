var cheerio = require('cheerio');
var querystring = require('querystring')
var url = require('url')
exports.analyseCategory = function(html){
	var $ = cheerio.load(html)
	var lists = $('#list dl dd')
	var chapLists = []
	lists.map(function(i,el){
		var chapterlink = $(this).find('a').attr('href').trim()
		var chapter = $(this).text().trim()
		var story = {
			chapterlink : chapterlink,
			chapter : chapter
		}
		chapLists.push(story)
	})
	console.log('analyse');
	console.log(chapLists[0]);
	return chapLists
}
exports.analyseContent = function(html){
	var $ = cheerio.load(html)
	var chaptername = $('.bookname').find('h1').text().trim()
	var chaptercontent = $('#content').html()
	var chapterdata = {
		chaptername : chaptername,
		chaptercontent : chaptercontent
	}
	return chapterdata
}
exports.analyseSearch = function(html){
	var $ = cheerio.load(html)
	var lists = $('.result-list .result-item')
	var books = []
	var storynumber = ['玄幻小说','修真小说','都市小说','穿越小说','网游小说','科幻小说']
	lists.map(function(i,el){
		var item = $(this)
		var image = item.find('.result-game-item-pic a img').attr('src').trim()
		var storyname = item.find('.result-game-item-pic a img').attr('alt').trim()
		var author = item.find('.result-game-item-detail .result-game-item-info p:first-child span:last-child').text().trim()
		var link = item.find('.result-game-item-detail h3 a').attr('href').trim()
		var summary = item.find('.result-game-item-detail .result-game-item-desc').text().trim()
		var number = parseInt(link.substring(20,21))
		var lastchapter = item.find('.result-game-item-detail .result-game-item-info p:last-child a').text().trim()
		var categoryname = storynumber[number]
		var monthrecommend = Math.floor(Math.random()*100000+ 1)
		var monthclick = Math.floor(Math.random()*100000+ 1)
		var allrecommend = Math.floor(Math.random()*100000+ 1)
		var allclick = Math.floor(Math.random()*100000+ 1)
		var allcollection = Math.floor(Math.random()*100000+ 1)
		var commentsnumber = Math.floor(Math.random()*100000+ 1)
		var storyData = {
			number : number,
			categoryname : categoryname,
			storyname : storyname,
			author : author,
			image : image,
			link : link,
			summary : summary,
			monthrecommend : monthrecommend,
			monthclick : monthclick,
			allrecommend : (allrecommend + 12 * monthrecommend),
			allclick : (allclick + 12 * monthclick),
			allcollection : Math.floor(((allcollection - allclick) > 0 ? allcollection : (allclick * 0.1))),
			commentsnumber : Math.floor(((commentsnumber - allclick) > 0 ? allcollection : (allclick * 0.2))),
			lastchapter : lastchapter
		};
		books.push(storyData)
	})
	return books
}
exports.formatUrl = function(keyname,url){
	var obj = {
		q : keyname,
		click : 1,
		s : '2041213923836881982',
		nsid : ''
	}
	var params = querystring.stringify(obj)
	return url+params
}