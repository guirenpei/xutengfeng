'use strict';
/* eslint no-console: 0*/
// var Movie = require('../models/movie');
// var Category = require('../models/category');
const mmPic = require('../models/mmPic');
// exports.index = function(req,res){
// 	// var movies = [{
// 	// 			title : "机械战警",
// 	// 			_id : 1,
// 	// 			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'			
// 	// 		}
// 	Category
// 		.find({})
// 		.populate({path : 'movies',options : {limit : 5}})
// 		.exec(function(err,categories){
// 			if(err){
// 				console.log(err);
// 			}
// 			res.render('movie',{
// 		    title : 'movie 首页',
// 		    categories : categories 
// 		  })
// 		})
// }
exports.blog = function(req, res) {
  mmPic.find({})
  .limit(15)
  .exec((err, mmpic) => {
    if (err) {
      console.log(err);
    }
    res.render('mmBlog', {
      title: '你是我的小密密',
      mmpic: mmpic
    });
  });
};
// exports.seal = function(req,res){
// 	res.render('mmSeal')
// }
//search
// exports.search = function(req,res){
// 	var catId = req.query.cat
// 	var page = parseInt(req.query.p,10) || 0
// 	var q = req.query.q
// 	var count = 2
// 	var index = page * count
// 	if(catId){
// 		Category
// 			.find({_id : catId})
// 			.populate({path : 'movies',select : 'title poster'})
// 			// .populate({path : 'movies',options : {limit : 2, skip : index}})
// 			.exec(function(err,categories){
// 				if(err){
// 					console.log(err);
// 				}
// 				var category = categories[0] || {}
// 				var movies = category.movies || []
// 				var results = movies.slice(index, index + count)
// 				res.render('results',{
// 			    title : 'movie 结果列表页面',
// 			    keyword : category.name,
// 			    currentPage : (page + 1),
// 			    query : 'cat=' + catId,
// 			    totalPage : Math.ceil(movies.length / count),
// 			    movies : results
// 			  })
// 			})
// 		}else{
// 			Movie
// 				.find({title: new RegExp(q + '.*','i')})
// 				.exec(function(err,movies){
// 					if(err){
// 						console.log(err);
// 					}
// 					var results = movies.slice(index, index + count)
// 					res.render('results',{
// 				    title : 'movie 结果列表页面',
// 				    keyword : q,
// 				    currentPage : (page + 1),
// 				    query : 'q=' + q,
// 				    totalPage : Math.ceil(movies.length / count),
// 				    movies : results
// 				  })
// 				})
// 		}
// }
