'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const IpSchema = new Schema({
	proxy : String,
	meta : {
		createAt : {
			type : Date,
			default : Date.now()
		},
		updateAt : {
			type : Date,
			default : Date.now()
		}
	},
});
//每次在存储数据之前都会调用这个方法
IpSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})
IpSchema.statics = {
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
	},
}
const Ip = mongoose.model('Ip',IpSchema)
module.exports= Ip
