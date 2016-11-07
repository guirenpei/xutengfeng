var mmComment = require('../models/mmComment');
var mmPic = require('../models/mmPic');
var Category = require('../models/category');
var _ = require('underscore')
var fs = require('fs')
var path = require('path')

exports.detail = function(req,res){
	var id = req.params.id;
	mmPic.update({_id : id},{$inc : {pv : 1}},function(err){
		if(err){
			console.log(err)
		}
	})
	mmPic.findById(id,function(err,mmpic){
		mmComment
			.find({mmpic:id})
			.populate('from','username')
			.populate('reply.from reply.to','username')
			.exec(function(err,mmComments){
				var _mmComments = []
				if(mmComments){
					_mmComments = mmComments
				}
				// console.log('mmComments.reply.to:')
				// console.log(mmComments.reply.to)
				res.render('detail',{
			   	title : 'imooc' + mmpic.title,
			   	mmpic : mmpic,
			   	mmComments : _mmComments
		   	})
		})
	})
}
//admin update mmpic
exports.update = function(req,res){
	var id = req.params.id;
	console.log('upodate+id');
	console.log(id);
	if(id){
		Movie.findById(id,function(err,movie){
			Category.find({},function(err,categories){
				res.render('admin',{
					title : 'imooc 后台更新页',
					movie : movie,
					categories : categories
				})
			})
		})
	}
}
// admin poster
exports.savePhoto = function(req,res,next){
	var posterData = req.files.uploadPic
	console.log(posterData)
	var filePath = posterData.path
	var originalFilename = posterData.originalFilename
	console.log('req.files')
	console.log(req.files)
	if(originalFilename){
		fs.readFile(filePath,function(err,data){
			var timeStamp = Date.now()
			var type = posterData.type.split('/')[1]
			var poster = timeStamp + '.' + type
			console.log(poster)
			var newPath = path.join(__dirname,'../../','/public/upload/' + poster)
			fs.writeFile(newPath,data,function(err){
				req.poster = poster
				next()
			})
		})
	}else{
		next()
	}
}

	//admin post movie
exports.save = function(req,res){
	var id = req.body.mmPic._id;
	var mmPicObj = req.body.mmPic;
	var _mmPic
	if(req.poster){
		console.log('poster')
		console.log(req.poster)
		mmPicObj.src = req.poster
	}
	// !== 'undefined' && id !== '' && id !== null
	if(id){
		mmPic.findById(id,function(err,mmPic){
			if(err){
				console.log(err);
			}
			console.log('mmPicObj');
			console.log(mmPicObj);
			_mmPic = _.extend(mmPic,mmPicObj);
			_mmPic.save(function(err,mmPic){
			if(err){
					console.log(err);
				}
				res.redirect('/photo/' + mmPic._id);
			})
		})
	}else{
		_mmPic = new mmPic(mmPicObj)
		console.log('_mmPic')
		console.log(_mmPic)
		_mmPic.save(function(err,mmPic){
			if(err){
				console.log(err);
			}
			res.redirect('/photo/' + mmPic._id);
		})
	}
}
// exports.list = function(req,res){
// 	// var movies = [{
// 	// 	doctor: "何塞·帕迪里亚",
// 	// 	_id : 1,
// 	// 	country: "美国",
// 	// 	title: "机械战警",
// 	// 	year: 2014,
// 	// 	poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
// 	// 	language: "英语",
// 	// 	flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
// 	// 	summary: "底特律是世界闻名的汽车城，这里的机械工业已经到了出神入化的地步。墨菲（彼得•威勒 Peter Weller 饰）" + 
// 	// 		"是底特律的一个普通警察，既没有非凡身手、也没有高超技术。一次，他执行任务时被一伙暴徒暴打致死，"+
// 	// 		"从此他的人生轨迹改变了。底特律的科学家没能救活他的身体，却能将他的头脑和机械完美地合二为一。"+
// 	// 		"墨菲成了一个有着人类头脑和机械身体的机械警察！身上配备了各种武器、能应付各种各样的暴力活动的墨菲"+
// 	// 		"成了底特律警察的王牌。然而墨菲发生意外后他的家人却神秘失踪了，墨菲打击罪恶之余一直在竭力寻找家人。"+
// 	// 		"令人意外的是，墨菲的机械身体却是操控在一伙利益集团手中。他们一直都在利用墨菲干着各种罪恶勾当……"
// 	// }];
// 	Movie.fetch(function(err,movies){
// 		if(err){
// 			console.log(err)
// 		}
// 		res.render('list',{
//     	title : 'list 列表页',
//     	movies : movies
//     	});
// 	});
// }
// //list delete movie
// exports.del = function(req,res){
// 	var id = req.query.id;
// 	console.log('delete uid');
// 	console.log(id);
// 	if(id){
// 		Movie.remove({_id : id},function(err,movie){
// 			if(err){
// 				console.log(err);
// 				res.json({success : 0});
// 			}else{
// 				res.json({success : 1});
// 			}
// 		})
// 	}
// }
exports.new = function(req,res){
	var mmPic = {
		src: "",
		alt: "",
		caption: "",
		desc: ""
	};
	res.render('mmBlog/add_pic',{
		title : '后台录入页',
  	mmPic : mmPic
	});
}