'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId
const storyDetailSchema = new Schema({
	number : Number,
	categoryname : String,
	storyname : String,
	author : String,
	image : String,
	link : String,
	summary : String,
	monthrecommend : Number,
	monthclick : Number,
	allrecommend : Number,
	allclick : Number,
	allcollection : Number,
	commentsnumber : Number,
	lastchapter : String,
	chapter : {
		type : ObjectId,
		ref : 'Chapter',
	},
	meta : {
		createAt : {
			type : Date,
			default : Date.now()
		},
		updateAt : {
			type : Date,
			default : Date.now()
		}
	}
});
//每次在存储数据之前都会调用这个方法
storyDetailSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})
storyDetailSchema.statics = {
	fetch : function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById : function(id,cb){
		return this
			.findOne({_id : id})
			.sort('meta.updateAt')
			.exec(cb)
	}
}
const storyDetail = mongoose.model('storyDetail',storyDetailSchema)
module.exports = storyDetail
