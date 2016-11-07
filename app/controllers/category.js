var Category = require('../models/category');

exports.new = function(req,res){
	var category = {
		doctor: "",
		country: "",
		title: "",
		year: "",
		poster:'',
		language: "",
		flash: '',
		summary: ""
	};
	res.render('category_admin',{
	 	title : '后台分类录入页',
	 	category : {}
	 });
}

	//admin post movie
exports.save = function(req,res){
	var _category = req.body.category
	var category = new Category(_category)
	category.save(function(err,category){
		if(err){
			console.log(err);
		}
		res.redirect('/admin/category/list');
	})
}
//admin update movie
exports.update = function(req,res){
	var id = req.params.id;
	console.log('upodate+id');
	console.log(id);
	if(id){
		Movie.findById(id,function(err,movie){
			console.log(movie);
			res.render('admin',{
				title : 'imooc 后台更新页',
				movie : movie
			})
		})
	}
}
//category list page
exports.list = function(req,res){
	Category.fetch(function(err,categories){
		if(err){
			console.log(err)
		}
		res.render('categorylist',{
    	title : '分类列表页',
    	categories : categories
    	});
	});
}
