var Comment = require('../models/comment');
//Comment
exports.save = function(req,res){
	var _comment = req.body.comment
	var MovieId = _comment.movie
	console.log('_comment.cid')
	console.log(_comment.cid)
	console.log(_comment)
	var comment = new Comment(_comment)
	if(_comment.cid){
		Comment.findById(_comment.cid,function(err,comment){
			var reply = {
				from : _comment.from,
				to : _comment.tid,
				content : _comment.content
			}
			comment.reply.push(reply)
			comment.save(function(err,comment){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/'+MovieId)
			})
		})
	}else{
		console.log('save')
		console.log(comment)
		comment.save(function(err,comment){
			if(err){
				console.log(err)
			}
			res.redirect('/movie/'+MovieId)
		})
	}
}
