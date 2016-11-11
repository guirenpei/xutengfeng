'use strict';
/* eslint no-console: 0 */

const BookShelf = require('../models/bookshelf');

exports.collect = function *(user, bookId, chapter, chapterlink) {
  const bookshelf = yield BookShelf.findOne({story: bookId, user: user._id});
  let success = 1;
  if (bookshelf) {
    if (!bookshelf.tagchapter && !bookshelf.tagchapterlink && chapter && chapterlink) {
      console.log('chapter');
      console.log(chapter);
      yield BookShelf.update({_id: bookshelf._id}, {$set: {tagchapter: chapter, tagchapterlink: chapterlink}});
      success = 2;// 已保存书签
    } else {
      success = 0;// 该书已经收藏过
    }
  } else {
    const shelf = new BookShelf({
      story: bookId,
      user: user._id,
    });
    yield shelf.save();
  }
  return success;// 已收藏本书
};
