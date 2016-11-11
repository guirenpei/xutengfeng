'use strict';
/* eslint no-console: 0 */

const IP = require('../models/Ips');
const co = require('co');
const request = require('request-promise');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://115.28.73.185:27017/page');
mongoose.connection.on('error', (error) => {
  console.log(`数据库连接失败：${error}`);
});
mongoose.connection.on('open', () => {
  console.log('------数据库连接成功！------');
});
// 请求代理页面
let ipPages = [];
for (let i = 1; i <= 10; i++) {
  ipPages.push(i);
}
co(function *() {
  console.log('爬取ip开始===================================>');
  let res = yield request('http://api.xicidaili.com/free2016.txt');
  let Ips = res.split(/\r\n/);
  for (const proxy of Ips) {
    try {
			// 代理IP请求，设置超时为3000ms，返回正确即当可用
      console.log(`http://${proxy}`);
      let testip = yield request({
        url: 'http://ip.chinaz.com/getip.aspx',
        proxy: `http://${proxy}`,
        timeout: 3000,
      });
      if (testip.substring(0, 4) === '{ip:') {
        // 存入数据库
        console.log(`proxy:${proxy}`);
        let _ip = new IP({proxy: `http://${proxy}`});
        yield _ip.save((err, ip) => {
          if (err) {
            console.log(err);
          }
        });
      }
    } catch (error) {

    }
  }
  console.log('爬取ip结束===================================>');
});