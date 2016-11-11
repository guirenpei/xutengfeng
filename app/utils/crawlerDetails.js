'use strict'
const StoryDetail = require('../models/storyDetail')
const IP = require('../models/Ips');
const fs = require('fs-extra-promise');
const co = require('co');
const cheerio = require('cheerio');
const request = require('request-promise');
const path = require('path');
const querystring = require('querystring');
const iconv = require("iconv-lite");
	//请求代理页面
const mongoose =require("mongoose");
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://115.28.73.185:27017/page");
mongoose.connection.on("error",function(error){
    console.log("数据库连接失败："+ error);
});
mongoose.connection.on("open",function(){
    console.log("------数据库连接成功！------");
});
const baseUrl1 = 'http://www.37zw.com/xiaoshuo1/index';
const baseUrl2 = 'http://www.37zw.com/xiaoshuo2/index';
const baseUrl3 = 'http://www.37zw.com/xiaoshuo3/index';
const baseUrl4 = 'http://www.37zw.com/xiaoshuo4/index';
const baseUrl5 = 'http://www.37zw.com/xiaoshuo5/index';
const baseUrl6 = 'http://www.37zw.com/xiaoshuo6/index';
const storynumber = ['玄幻小说','修真小说','都市小说','穿越小说','网游小说','科幻小说'];
let storyPages1 = [];
let storyPages2 = [];
let storyPages3 = [];
let storyPages4 = [];
let storyPages5 = [];
let storyPages6 = [];
let ipNo = 0;
let ips;
for(let i = 1;i <= 76; i++){
	storyPages1.push(i);
	if(i <= 53){
		storyPages2.push(i);
	}
	if(i <= 68){
		storyPages3.push(i);
	}
	if(i <= 30){
		storyPages4.push(i);
	}
	if(i <= 21){
		storyPages5.push(i);
	}
	if(i <= 29){
		storyPages6.push(i);
	}
}
co(function *(){
	console.log('爬取小说数据开始===================================>');
	ips = yield IP.find({}).exec();
	for(const page1 of storyPages1){
		yield crawlerStoryDeatils(page1, baseUrl1);
	}
	for(const page2 of storyPages2){
		yield crawlerStoryDeatils(page2, baseUrl2);
	}
	for(const page3 of storyPages3){
		yield crawlerStoryDeatils(page3, baseUrl3);
	}
	for(const page4 of storyPages4){
		yield crawlerStoryDeatils(page4, baseUrl4);
	}
	for(const page5 of storyPages5){
		yield crawlerStoryDeatils(page5, baseUrl5);
	}
	for(const page6 of storyPages6){
		yield crawlerStoryDeatils(page6, baseUrl6);
	}
	console.log('爬取小说数据结束===================================>');
})
function *crawlerStoryDeatils(page,baseUrl){
	let res;
	let proxy = ips[ipNo++].proxy;
	if(ipNo >= ips.length){
	  ipNo = 0;
	}
	console.log('准备爬取'+ baseUrl + page + '.html');
	console.log('使用的代理是：'+proxy)
	try{
		res = yield request({
			url : baseUrl + page + '.html',
			proxy : proxy,
			timeout : 3000,
			gzip : true,
			encoding : null,
		});
	}catch(error){
		console.log('爬取失败，原因是：');
		console.log(error.message);
		return yield crawlerStoryDeatils(page,baseUrl);
	}
	let storydata = filterStories(iconv.decode(res, 'gbk'));
	console.log('正在保存数据---');
	for(const story of storydata){
		let _storyDetail = new StoryDetail(story);
		yield _storyDetail.save();
	}
	console.log('成功保存数据===');
}
function filterStories(html){
	let $ = cheerio.load(html)
		let items = $('.item')
		let storydata = []
		items.map(function(i,el){
			let item = $(this);
			let image = item.find('.image a img').attr('data-cfsrc').trim()
			let storyname = item.find('.image a img').attr('alt').trim()
			let categoryname = '玄幻小说';
			let author = item.find('dl dt span').text().trim()
			let link = item.find('dl dt a').attr('href').trim()
			let summary = item.find('dl dd').text().trim()
			let number = parseInt(link.substring(20,21))
			let monthrecommend = Math.floor(Math.random()*100000+ 1)
			let monthclick = Math.floor(Math.random()*100000+ 1)
			let allrecommend = Math.floor(Math.random()*100000+ 1)
			let allclick = Math.floor(Math.random()*100000+ 1)
			let allcollection = Math.floor(Math.random()*100000+ 1)
			let commentsnumber = Math.floor(Math.random()*100000+ 1)
			let storyData = {
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
				lastchapter : '',
			};
			storydata.push(storyData);
		})
	return storydata;
}
function getPageAsync(url){
	return new Promise(function(resolve,reject){
		request
		.get(url)
		.charset('gbk')
		.proxy('http://202.171.253.72:80')
		.end(function(err,res){
			console.log('正在爬取'+url)
			console.log(k++)
			console.log(res)
			resolve(res.text)
		})
		.on('error',function(err){
			reject(err)
			console.log('获取地址信息出错')
		})
	})
}