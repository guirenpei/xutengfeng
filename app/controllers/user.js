var crypto = require('crypto');
var User = require('../models/user');
exports.logout = function(req,res){
	delete req.session.user;
	res.redirect('/')
}
exports.signup = function(req,res){
	var _user = req.body.user;
	var username = _user.name;
	var password = _user.password;
	var md5 = crypto.createHash('md5');
	var md5password = md5.update(password).digest('hex');
	User.findOne({username:username},function(err,user){
		if(err){
			console.log(err)
		}
		if(user){			
			return res.redirect('/signin')
		}else{
			var user = new User({
				username : username,
				password : md5password
			});
			user.save(function(err,user){
				if(err)	{
					console.log(err);
				}
				console.log(user);
				user.password = null;
		        delete user.password;
		        req.session.user = user;
				res.redirect('/');
			})
		}
	})
}
exports.showSignup = function(req,res){
	res.render('signup',{
		title : '注册页面'
	})
}
exports.showSignin = function(req,res){
	res.render('signin',{
		title : '登录页面'
	})
}
exports.signin = function(req,res){
	var _user = req.body.user;
	var username = _user.name;
	var password = _user.password;
	User.findOne({username : username},function(err,user){
		if(err){
			console.log(err)
		}
		if(!user){
			console.log('用户不存在！');
			console.log(user)
			return res.redirect('/signup')
		}
		//对密码进行md5加密
    var md5 = crypto.createHash('md5')
    var md5password = md5.update(password).digest('hex')
    if(user.password !== md5password) {
      console.log('密码错误！');
      return res.redirect('/signin');    
    }
    console.log('登录成功！');
    // req.session.success = "登录成功！";
    user.password = null;
    delete user.password;
    req.session.user = user;
    return res.redirect('/');
	})
}
	//登录接口
exports.userlist = function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err);
		}
		res.render('userlist',{
	   	title : 'userlist 用户列表页',
	   	users : users
	   	});
	});
}

	//midware for user
exports.signinRequired = function(req,res,next){
	var user = req.session.user
	if(!user){
		return res.redirect('/signin')
	}
	next()
}
	//midware for admin
exports.adminRequired = function(req,res,next){
	var user = req.session.user
	console.log(user)
	// if(user.role <= 10 || user.role == undefined){
	// 	return res.redirect('/signin')
	// }
	next()
}