'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const BookShelfSchema = new Schema({
  story: {
    type: ObjectId,
    ref: 'storyDetail',
  },
  user: {
    type: ObjectId,
    ref: 'user',
  },
  lastchapter: String,
  lastchapterlink: String,
  tagchapter: String,
  tagchapterlink: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now(),
    },
    updateAt: {
      type: Date,
      default: Date.now(),
    }
  }
});
// 每次在存储数据之前都会调用这个方法
BookShelfSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});
BookShelfSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .sort('meta.updateAt')
      .exec(cb);
  }
};
const BookShelf = mongoose.model('BookShelf', BookShelfSchema);
module.exports = BookShelf;