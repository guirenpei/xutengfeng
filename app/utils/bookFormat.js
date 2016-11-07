'use strict'
const StoryDetail = require('../models/storyDetail')
exports.billboard = function *(){
	let data = {
		'recommend' : [{}],
		'click' : [{}]
	}
	data.recommend = yield StoryDetail.find({}).sort({allrecommend: -1}).limit(10).exec();
	data.click = yield StoryDetail.find({}).sort({allclick: -1}).limit(10).exec();
	return data;
}