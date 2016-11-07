'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId
const CommentSchema = new Schema({
	movie : {
		type : ObjectId,
		ref : 'Movie'
	},
	from : {
		type : ObjectId,
		ref : 'User'
	},
	content : String,
	reply : [{
		from : {
			type : ObjectId,
			ref : 'User'
		},
		to : {
			type : ObjectId,
			ref : 'User'
		},
		content : String
	}],
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
CommentSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})
CommentSchema.statics = {
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
const Comment = mongoose.model('Comment',CommentSchema)
module.exports = Comment