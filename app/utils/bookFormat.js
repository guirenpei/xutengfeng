'use strict';
/* eslint no-console: 0 */

const StoryDetail = require('../models/storyDetail');
const IP = require('../models/ips');
const Analyse = require('../utils/analyse');
const request = require('request-promise');
const iconv = require('iconv-lite');

// let ips;
// let ipNo = 0;

exports.billboard = function *() {
  let data = {
    recommend: [{}],
    click: [{}]
  };
  data.recommend = yield StoryDetail.find({}).sort({allrecommend: -1}).limit(10).exec();
  data.click = yield StoryDetail.find({}).sort({allclick: -1}).limit(10).exec();
  return data;
};
exports.chapters = function *(story) {
  // ips = yield IP.find({}).exec();
  let res;
  let chapters = [];
  // let proxy = ips[ipNo++].proxy;
  // if (ipNo >= ips.length) {
  //   ipNo = 0;
  // }
  console.log(`准备爬取${story.link}`);
  // console.log(`使用的代理是${proxy}`);
  try {
    res = yield request({
      url: story.link,
      timeout: 3000,
      gzip: true,
      encoding: null,
    });
    chapters = Analyse.analyseCategory(iconv.decode(res, 'gbk'));
  } catch (error) {
    console.log('爬取失败，原因是：');
    console.log(error.message);
  }
  return chapters;
};
exports.content = function *(link, _id) {
  const book = yield StoryDetail.findById(_id);
  const res = yield request({
    url: `${book.link}${link}`,
    timeout: 3000,
    gzip: true,
    encoding: null,
  });
  const content = Analyse.analyseContent(iconv.decode(res, 'gbk'));
  return {book: book, content: content};
};