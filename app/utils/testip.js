var cheerio = require('cheerio');
var iconv = require('iconv-lite')
var charset = require('superagent-charset')
var request = charset(require('superagent'))
require('superagent-proxy')(request)
	// 183.131.76.27:8888
	// 119.6.136.122:80
	// 111.155.124.85.8123
	// 60.194.100.51.80
	// 61.178.238.122:63000
	// 39.1.36.64:8080
	// 218.191.25.9:8380
var storynumber = ['玄幻小说','修真小说','都市小说','穿越小说','网游小说','科幻小说']
var storydata = [];
for(var page = 1;page <= 76;page ++){
	request.get('http://www.37zw.com/xiaoshuo1/index'+ page +'.html')
		.charset('gbk')
		.end(function(err,res){
		var $ = cheerio.load(res.text)
		var itms = $('.item')
		items.map(function(i,el){
			var item = $(this)
			var image = item.find('.image a img').attr('src').trim()
			var storyname = item.find('.image a img').attr('alt').trim()
			var categoryname = '玄幻小说'
			var author = item.find('dl dt span').text().trim()
			var link = item.find('dl dt a').attr('href').trim()
			var summary = item.find('dl dd').text().trim()
			var number = link.substring(20,21)
			var storyData = {
				number : number,
				categoryname : storynumber[number],
				storyname : storyname,
				author : author,
				image : image,
				link : link,
				summary : summary
			};
			storydata.push(storyData)
		})
		console.log(storydata);
	})
}
for(var i = 1;i <= 76; i++){
	storyPages.push(i)
	if(i <= 53){
		storyPages2.push(i)
	}
	if(i <= 68){
		storyPages3.push(i)
	}
	if(i <= 30){
		storyPages4.push(i)
	}
	if(i <= 21){
		storyPages5.push(i)
	}
	if(i <= 29){
		storyPages6.push(i)
	}
}
var baseUrl = 'http://www.37zw.com/xiaoshuo1/index'
var baseUrl2 = 'http://www.37zw.com/xiaoshuo2/index'
var baseUrl3 = 'http://www.37zw.com/xiaoshuo3/index'
var baseUrl4 = 'http://www.37zw.com/xiaoshuo4/index'
var baseUrl5 = 'http://www.37zw.com/xiaoshuo5/index'
var baseUrl6 = 'http://www.37zw.com/xiaoshuo6/index'
var storynumber = ['玄幻小说','修真小说','都市小说','穿越小说','网游小说','科幻小说']
var storyPages = []
var storyPages2 = []
var storyPages3 = []
var storyPages4 = []
var storyPages5 = []
var storyPages6 = []
// storyPages2.forEach(function(id){
// 	fetchIpArray.push(getPageAsync(baseUrl2 + id + '.html'))
// })
// storyPages3.forEach(function(id){
// 	fetchIpArray.push(getPageAsync(baseUrl3 + id + '.html'))
// })
// storyPages4.forEach(function(id){
// 	fetchIpArray.push(getPageAsync(baseUrl4 + id + '.html'))
// })
// storyPages5.forEach(function(id){
// 	fetchIpArray.push(getPageAsync(baseUrl5 + id + '.html'))
// })
// storyPages6.forEach(function(id){
// 	fetchIpArray.push(getPageAsync(baseUrl6 + id + '.html'))
// })