'use strict';
/* eslint no-console: 0 */

const StoryDetail = require('../models/storyDetail');
const chapter = require('../models/chapter');
const IP = require('../models/Ips');
const Analyse = require('../utils/analyse');
const fs = require('fs-extra-promise');
const co = require('co');
const cheerio = require('cheerio');
const request = require('request-promise');
const path = require('path');
const querystring = require('querystring');
const iconv = require("iconv-lite");
const mongoose =require("mongoose");
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://115.28.73.185:27017/page");
mongoose.connection.on("error",function(error){
    console.log("数据库连接失败："+ error);
});
mongoose.connection.on("open",function(){
    console.log("------数据库连接成功！------");
});
let ipNo = 0;
let ips;

co(function *() {
  const stories = yield StoryDetail.find({}).exec();
  ips = yield IP.find({}).exec();
  console.log('爬取小说章节数据开始===================================>');
  for(const story of stories){
    yield crawlerChap(story);
  }
  console.log('爬取小说数据结束===================================>');
})
function *crawlerChap(story){
  let res;
  let _chapter;
  let proxy = ips[ipNo++].proxy;
  if(ipNo >= ips.length){
    ipNo = 0;
  }
  console.log('准备爬取'+ story.link);
  console.log('使用的代理是：'+proxy);
  try{
    res = yield request({
      url : story.link,
      proxy : proxy,
      timeout : 3000,
      gzip : true,
      encoding : null,
    });
  }catch(error){
    console.log('爬取失败，原因是：');
    console.log(error.message);
    return yield crawlerChap(story);
  }
  let chapters = Analyse.analyseCategory(iconv.decode(res, 'utf-8'));
  for(const chapter of chapters){
    _chapter = new Chapter(chapter);
    let chapterId = story.chapter;
    yield _chapter.save();
    if(chapterId){
      console.log('根据storyDetail获得的chapterId:' + chapterId);
      let cat = yield Chapter.findById(chapterId);
      cat.chapters.push(chapter);
      yield cat.save();
      console.log('保存完Chapter');
    } else {
      let cat = new Chapter({
        chapters: chapter,
      });

      let _story = yield cat.save();
      console.log('新建一条Chapter数据，获得的chapterId:' + cat._id);
      _story.chapter = cat._id;
      yield _story.save();
      console.log('保存完storyDetail');
    }
  }
  console.log('成功保存数据===');
}