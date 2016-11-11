'use strict';
/* eslint no-console: 0*/
const request = require('request-promise');
const charset = require('charset');
const co = require('co');

co(function *() {
  const res = yield request('http://www.xueau.com/');
  console.log(charset(res.headers, res));
});