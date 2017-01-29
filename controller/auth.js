var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../model/user');
var App = require('../model/app');
var Comment = require('../model/comment');

var Auth = {
	is_logged: function (req, res, next) {
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		if (req.path === "/app/errorlog") {
			next();
			return ;
		}
		if (!token) {
			res.json({ success: false, msg: "no token provided" });
		} else {
			jwt.verify(token, config.secretKey, function (err, user) {
				if (err) {
					console.log(err)
					return res.json({ success: false, msg: 'failed to authenticate' });
				} else {

					req.user = user;
					next();
				}
			});
		}

	},

	is_admin: function (req, res, next) {

		User.findOne({ _id: req.user._id }).exec(function (err, user) {
			if (err) {
				console.log(err)

				//fail > not authorised
			} else if (!(user.admin_apps.indexOf(req.body.app_id) >= 0)) {
				return res.json({ success: false, msg: "not authorised" });

				//ok 	
			} else {
				next();
			}

		})
	},

	is_subscribed: function (req, res, next) {

		User.findOne({ _id: req.user._id }).exec(function (err, user) {
			//user is app admin
			if (user.admin_apps.indexOf(req.body.app_id) >= 0) {
				next();
			}
			//user is subscribed
			else if (user.subscribed_apps.indexOf(req.body.app_id) >= 0) {
				next();
			}
			//not admin not subscribed
			else {
				return res.json({ success: false, msg: "not subscribed" });
			}
		})
	},

	is_comment_author: function (req, res, next) {
		var id = req.query.id;
		Comment.find({ "_id": id }).populate('author').exec(function (err, comment) {
			if (err) {
				return res.json({ success: false, msg: "No comments" });
			}
			console.log(comment);
			for (var i = 0; i < comment.length; i++) {
				if (comment[i].author._id == req.user._id) {
					next();
					return;
				}
			}
			return res.json({ success: false, msg: "user is not an author of the comment" });
		});

	},

	check_app_token :function(req,res,next){
		var app_id=req.body.app_id

		App.findOne({"_id":app_id},function(err,app){
			if(app==null){
				return res.json({success:false,msg:"no app"})
			}

			if(app.token!=req.body.key){
				return res.json({success:false,msg:"accesdenied"})
			}else{

				next();
			}
		})

	}


}
module.exports = Auth