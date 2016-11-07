'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MMPicSchema = new Schema({
	src : String,
	alt : String,
	caption : String,
	desc : String,
	pv : {
		type : Number,
		default : 0
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
MMPicSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})
MMPicSchema.statics = {
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
var MMPic = mongoose.model('MMPic',MMPicSchema)
module.exports = MMPic