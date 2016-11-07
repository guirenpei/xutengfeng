'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
	username : {
		unique : true,
		type : String
	},
	password : String,
	//0 : normal user
	//1 : verified user
	//2 : professional
	// >10 : admin
	// >50 : super
	role : {
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
userSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})
userSchema.methods = {
	comparePassword : function(_password,cb){

	}
}
userSchema.statics = {
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
const User = mongoose.model('User',userSchema)
module.exports = User