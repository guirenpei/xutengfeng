'use strict'
const fs = require('fs-extra-promise');
const co = require('co');
const cheerio = require('cheerio');
const request = require('request-promise');
const path = require('path');
const querystring = require('querystring');
co(function* (){
	yield* searchResults('遮天');
})
function analyseSearch(html){
	let books = [];
	if(html == undefined){
		console.log('html');
		console.log(html);
		return books;
	}else{
		let $ = cheerio.load(html);
		let lists = $('.result-list .result-item');
		let storynumber = ['玄幻小说','修真小说','都市小说','穿越小说','网游小说','科幻小说']
		lists.map(function(i,el){
			let item = $(this)
			let image = item.find('.result-game-item-pic a img').attr('src').trim()
			let storyname = item.find('.result-game-item-pic a img').attr('alt').trim().replace('<em>','').replace('</em>','');
			let author = item.find('.result-game-item-detail .result-game-item-info p:first-child span:last-child').text().trim()
			let link = item.find('.result-game-item-detail h3 a').attr('href').trim()
			let summary = item.find('.result-game-item-detail .result-game-item-desc').text().trim()
			let number = parseInt(link.substring(20,21))
			let lastchapter = item.find('.result-game-item-detail .result-game-item-info p:last-child a').text().trim()
			let categoryname = storynumber[number]
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
				lastchapter : lastchapter,
			};
			books.push(storyData)
		})
		return books;
	}
}
function analyseSearchKanShu(html) {
	let $ = cheerio.load(html);
	let lists = $('.shu_box');
	let books = [];
	const quanben = 'http://quanxiaoshuo.com/';
	let storynumber = ['玄幻小说','修真小说','都市小说','穿越小说','网游小说','科幻小说'];
	lists.map(function(el,i){
		let item = $(this);
		let h2 = item.find('h2 a').text().trim();
		let zuozhe = h2.indexOf('作者：');
		let wang = h2.indexOf('- 看书网');
		let image = '';
		let storyname = h2.substring(0,zuozhe).trim();
		let author = h2.substring(zuozhe + 3,wang).trim();
		let link = item.find('h2 a').attr('href').trim();
		let summary = item.find('.p_xinxi').text().trim();
		let number = 0;
		let lastchapter = '';
		let categoryname = storynumber[number]
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
			lastchapter : lastchapter,
		};
		books.push(storyData)
	})
	return books;
}
function analyseKanshuImage(html){
	let $ = cheerio.load(html);
	let image = $('.pd .xx_left1 img').attr('src');
	return image;
}
function *saveData(data){
	let name = 'search' + new Date().getTime();
	let newPath = path.join(__dirname,'../public/logs/' + name +'.txt');
	return yield fs.writeFileAsync(newPath, JSON.stringify(data), { encoding: 'utf-8', flag: 'a' });
}
function *searchResults(keyword){
	let search = querystring.escape(keyword);
	let results = [];
	try{
		let res1 = yield request({
			url : 'http://so.37zw.com/cse/search?q='+ search+'&click=1&s=2041213923836881982',
			timeout : 3000,
		});
		let res2 = yield request({
			url : 'http://zhannei.baidu.com/cse/search?s=287293036948159515&q=' + search,
			timmeout : 3000,
		})
		let res3 = yield request({
			url : 'http://so.23wx.com/cse/search?q='+ search +'&click=1&entry=1&s=15772447660171623812&nsid=',
			timeout : 3000,
		})
		let res4 = yield request({
			url : 'http://zhannei.baidu.com/cse/search?s=10977942222484467615&q=' + search,
			timeout : 3000,
		})
		let res5 = yield request({
			url : 'http://so.kanshu.com/search/searchlist.php?&keys='+ search +'&sort=1',
			timeout : 3000,
		});
		yield isNull(results,yield getResult(analyseSearch(res1)));
		yield isNull(results,yield getResult(analyseSearch(res2)));
		yield isNull(results,yield getResult(analyseSearch(res3)));
		yield isNull(results,yield getResult(analyseSearch(res4)));
		yield isNull(results,yield getResult(analyseSearchKanShu(res5)));
	}catch(error){
		console.log(error);
	}
	// let res6 = yield request('http://www.kanshu.com/artinfo/30354.html');//在看书网的连接情况下，搜索并下载图片
	yield saveData(results);
}
function getResult(datas){
	return new Promise((resolve, reject) => {
		let result = {};
		for(const data of datas){
			if(data.storyname == '遮天'){
				result = data;
			}
		}
		resolve(result);
	})
}
function isNull(results,data){
	return new Promise((resolve, reject) => {
		if (typeof data === "object" && !(data instanceof Array)){
	    let hasProp = false;
	    for (let prop in data){
	      hasProp = true;  
	      break;  
	    }
	    if (hasProp){
	      resolve(results.push(data));
	    }else{
				resolve();
	    }  
		}  
	})
}