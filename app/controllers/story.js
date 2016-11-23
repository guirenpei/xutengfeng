'use strict';
/* eslint no-console: 0 */
const StoryDetail = require('../models/storyDetail');
const User = require('../models/user');
const BookShelf = require('../models/bookshelf');
const CollectBook = require('../utils/collectBook');
const co = require('co');
const BookFormat = require('../utils/bookFormat');
const Search = require('../utils/search');
const storynumber = ['玄幻小说', '修真小说', '都市小说', '穿越小说', '网游小说', '科幻小说'];

exports.login = function(req, res) {
  co(function *() {
    let mimi = req.query.mimi;
    let xingmen = req.query.xingmen;
    console.log('mimi', mimi);
    console.log('xingmen', xingmen);
    if (mimi === '叶大伟') {
      res.redirect('/mmBlog');
    } else {
      const user = yield User.findOne({username: xingmen});
      if (user) {
        req.session.user = user;
        res.redirect('/story');
      } else {
        res.redirect('/');
      }
    }
  });
};
exports.collect = function(req, res) {
  co(function *() {
    const user = req.session.user;
    const bookId = req.params._id;
    const chapter = req.params.chapter;
    const chapterlink = req.params.chapterlink;
    const success = yield CollectBook.collect(user, bookId, chapter, chapterlink);
    res.json({success: success});
  });
};
exports.delcollect = function(req, res) {
  co(function *() {
    const user = req.session.user;
    const bookId = req.params._id;
    let success = 0;
    try {
      yield CollectBook.remove({story: bookId, user: user._id});
      success = 1;
    } catch (err) {
      success = 0;
    }
    res.json({success: success});
  });
};
exports.bookshelf = function(req, res) {
  co(function *() {
    const user = req.session.user;
    const shelf = yield BookShelf.find({user: user._id}).populate('story', 'categoryname image storyname author meta.updateAt');
    const shelflast = yield BookShelf.find({user: user._id}).populate('story', 'categoryname image storyname author meta.updateAt').sort({'meta.updateAt': -1});
    console.log('shelf', shelf);
    res.render('story/bookshelf', {
      title: `${user.username}--星门`,
      shelf: shelf || [],
      shelflast: shelflast || [],
    });
  });
};
exports.index = function(req, res) {
  const user = req.session.user;
  res.render('story/index', {
    title: '个人首页 --by mmsecret',
    user: user,
  });
};
exports.search = function(req, res) {
  co(function *() {
    const keyword = req.query.keyword || '';
    const qs = `/${keyword}.*/`;
    let results = yield Search.searchResults(keyword);
    console.log('keyword', keyword);
    console.log('results', results);
    for (const result of results) {
      let story = yield StoryDetail.find({storyname: result.storyname, link: result.link}) || {};
      if (story || story !== {}) {
        yield StoryDetail.update({_id: story._id}, {$set: {story}});
      } else {
        story = new StoryDetail(result);
        yield story.save();
      }
    }
    console.log('results', results);
    res.render('story/search', {
      title: '搜索页面 --星门',
      results: results,
    });
  });
};
exports.content = function(req, res) {
  co(function *() {
    console.log('content', req.session.user);
    const link = req.params.link;
    const _id = req.query._id;
    if (link === 'category') {
      res.redirect(`/story/category/${_id}`);
    } else {
      const user = req.session.user;
      const message = yield BookFormat.content(link, _id);
      yield CollectBook.collect(user, _id, message.content.chaptername, link);
      // console.log('message', message);
      res.render('story/content', {
        title: `${message.content.chaptername}  ${message.book.author}--星门`,
        book: message.book,
        content: message.content,
        prev: message.prev,
        next: message.next,
      });
    }
  });
	// 先取出来小说里面的链接，查看是否kanshu.com的网站
};
exports.summary = function(req, res) {
  co(function *() {
    console.log('summary', req.session.user);
    const _id = req.params._id;
    const user = req.session.user;
    const billboard = yield BookFormat.billboard;
    let story = {};
    try {
      story = yield StoryDetail.findById(_id);
    } catch (err) {
      console.log('这是搜索页面来的');
      story = yield StoryDetail.findOne({storyname: _id});
    }
    const chapters = yield BookFormat.chapters(story);
    res.render('story/summary', {
      title: `${story.storyname}  --星门`,
      billboard: billboard,
      book: story,
      chapters: chapters,
      user: user,
    });
  });
};

exports.category = function(req, res) {
  co(function *() {
    console.log('category', req.session.user);
    const _id = req.params._id;
    const story = yield StoryDetail.findById(_id);
    const chapters = yield BookFormat.chapters(story);
    const total = chapters.length;
    let pagesize = 10;
    let current = 0;
    res.render('story/category', {
      title: `${story.storyname}--星门`,
      book: story,
      chapters: chapters
    });
  });
};
exports.type = function(req, res) {
  co(function *() {
    console.log('type', req.session.user);
    const id = req.params.id;
    const strongrecommend = yield StoryDetail.find({number: id}).sort({allrecommend: -1}).limit(10); // 分类本周强推榜
    const adrecommend = yield StoryDetail.find({number: id}).sort({allcollection: -1}).limit(5); // 分类广告位
    const newbook = yield StoryDetail.find({number: id}).sort({commentsnumber: 1}).limit(6); // 新书精选
    const prime = yield StoryDetail.find({number: id}).sort({commentsnumber: -1}).limit(5); // 热销作品
    const latestbook = yield StoryDetail.find({number: id}).sort({'meta.updateAt': -1}).limit(30); // 分类小说更新
    const billboard = yield BookFormat.billboard;
    res.render('story/story_type', {
      title: storynumber[id],
      strongrecommend: strongrecommend,
      adrecommend: adrecommend,
      newbook: newbook,
      prime: prime,
      latestbook: latestbook,
      billboard: billboard,
    });
  });
};
exports.home = function(req, res) {
  co(function *() {
    const user = req.session.user;
    const pinshu = yield StoryDetail.find({}).sort({allrecommend: -1}).limit(6); // 分类本周强推榜
    const tuijian = yield StoryDetail.find({}).sort({allcollection: -1}).limit(6); // 分类本周强推榜
    const jingpin = yield StoryDetail.find({}).sort({allclick: -1}).limit(6); // 分类本周强推榜
    const quanpin = yield StoryDetail.find({}).sort({monthrecommend: -1}).limit(6); // 分类本周强推榜
    // ['玄幻小说', '修真小说', '都市小说', '穿越小说', '网游小说', '科幻小说'];
    const primexuanhuan = yield StoryDetail.find({number: 0}).sort({commentsnumber: -1}).limit(6); // 热销作品
    const primexiuzhen = yield StoryDetail.find({number: 1}).sort({commentsnumber: -1}).limit(6); // 热销作品
    const primedushi = yield StoryDetail.find({number: 2}).sort({commentsnumber: -1}).limit(6); // 热销作品
    const primechuanyue = yield StoryDetail.find({number: 3}).sort({commentsnumber: -1}).limit(6); // 热销作品
    const primewangyou = yield StoryDetail.find({number: 4}).sort({commentsnumber: -1}).limit(6); // 热销作品
    const primekehuan = yield StoryDetail.find({number: 5}).sort({commentsnumber: -1}).limit(6); // 热销作品
    const latestbook = yield StoryDetail.find({}).sort({'meta.updateAt': -1}).limit(30); // 分类小说更新
    const billboard = yield BookFormat.billboard;
    res.render('story/home', {
      title: '星门小说网',
      user: user,
      billboard: billboard,
      primexuanhuan: primexuanhuan,
      primexiuzhen: primexiuzhen,
      primedushi: primedushi,
      primechuanyue: primechuanyue,
      primewangyou: primewangyou,
      primekehuan: primekehuan,
      latestbook: latestbook,
      pinshu: pinshu,
      tuijian: tuijian,
      jingpin: jingpin,
      quanpin: quanpin,
    });
  });
};
exports.reactData = function(req, res) {
  co(function *() {
    const pinshu = yield StoryDetail.find({}).sort({allrecommend: -1}).limit(6); // 分类本周强推榜
    const tuijian = yield StoryDetail.find({}).sort({allcollection: -1}).limit(6); // 分类本周强推榜
    const jingpin = yield StoryDetail.find({}).sort({allclick: -1}).limit(6); // 分类本周强推榜
    const quanpin = yield StoryDetail.find({}).sort({monthrecommend: -1}).limit(6); // 分类本周强推榜
    // ['玄幻小说', '修真小说', '都市小说', '穿越小说', '网游小说', '科幻小说'];
    const primexuanhuan = yield StoryDetail.find({number: 0}).sort({commentsnumber: -1}).limit(6); // 热销作品
    const primexiuzhen = yield StoryDetail.find({number: 1}).sort({commentsnumber: -1}).limit(6); // 热销作品
    const primedushi = yield StoryDetail.find({number: 2}).sort({commentsnumber: -1}).limit(6); // 热销作品
    const primechuanyue = yield StoryDetail.find({number: 3}).sort({commentsnumber: -1}).limit(6); // 热销作品
    const primewangyou = yield StoryDetail.find({number: 4}).sort({commentsnumber: -1}).limit(6); // 热销作品
    const primekehuan = yield StoryDetail.find({number: 5}).sort({commentsnumber: -1}).limit(6); // 热销作品
    const latestbook = yield StoryDetail.find({}).sort({'meta.updateAt': -1}).limit(30); // 分类小说更新
    // const billboard = yield BookFormat.billboard;
    const data = {
      title: '星门小说网',
      // billboard: billboard,
      primexuanhuan: primexuanhuan,
      primexiuzhen: primexiuzhen,
      primedushi: primedushi,
      primechuanyue: primechuanyue,
      primewangyou: primewangyou,
      primekehuan: primekehuan,
      latestbook: latestbook,
      pinshu: pinshu,
      tuijian: tuijian,
      jingpin: jingpin,
      quanpin: quanpin,
    }
    if (data) {
      res.send({data: data.pinshu, success: true});
    } else {
      res.send({data: data.pinshu, success: false});
    }

  });
}
