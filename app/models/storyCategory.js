'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId
var storyCategorySchema = new Schema({
	number : Number,
	categoryname : String,
	storyname : String,
	author : String,
	link : String,
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
storyCategorySchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})
storyCategorySchema.statics = {
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
var storyCategory = mongoose.model('storyCategory',storyCategorySchema)
module.exports = storyCategory