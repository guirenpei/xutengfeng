'use strict';
/* eslint no-console: 0*/
const cheerio = require('cheerio');

exports.analyseCategory = function(html) {
  const $ = cheerio.load(html);
  const lists = $('#list dl dd');
  let chapLists = [];
  lists.map(function(i, el) {
    let chapterlink = $(this).find('a').attr('href').trim();
    let chapter = $(this).text().trim();
    let story = {
      chapterlink: chapterlink,
      chapter: chapter,
    };
    chapLists.push(story);
  });
  console.log('analyse');
  console.log(chapLists[0]);
  return chapLists;
};
exports.analyseContent = function(html) {
  let $ = cheerio.load(html);
  let chaptername = $('.bookname').find('h1').text().trim();
  let chaptercontent = $('#content').html();
  let next = $('.bottem1 a:contains("下一章")').attr('href').trim();
  let prev = $('.bottem1 a:contains("上一章")').attr('href').trim();
  if (!prev.includes('html')) {
    prev = 'category';
  }
  console.log('next', next);
  console.log('prev', prev);
  let chapterdata = {
    chaptername: chaptername,
    chaptercontent: chaptercontent,
    prev: prev,
    next: next,
  };
  return chapterdata;
};