var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var User = require('../model/user');
var config = require('../config')
var auth = require('../controller/auth');

var router = express.Router();
mongoose.connect(config.database);

//auth middleware
//router.use(auth.is_logged);

//del//get all users
router.get('/', function(req, res, next) {

	User.find({}, function(err, users) {
    res.json(users);
  });
});

router.post('/register',function(req,res){
	
	var user = new User(req.body);
	console.log(user);
	user.save(function(err){
		if (err){
			console.log(err)
			res.json({success:false});
		}else{
			res.json({success:true});
		}
	})


});

//authenticate user and return jwt
router.post('/auth',function(req,res){
	
	var query={username:req.body.username} ;
	if (!req.body.username)
		query={email:req.body.email}
		

	User.findOne(query,function(err,user){
		//fail > neki error
		if (err){
			console.log(err)
			res.json({success:false});

		//fail > user not found
		}else if(!user){
			res.json({success:false,msg:"user not found"});

		//fail > password doesnt match
		}else if(user.password != req.body.password){
			res.json({success:false,msg:"password doesnt match"});

		//ok
		}else{
			var token = jwt.sign({username:user.username,email:user.email,_id:user._id},"tajnikljuc");
			res.json({success:true,msg:"stavi ga u pdze",token:token});
		}
	})
});

//returnig data for user dashboard
router.post('/dashboard',auth.is_logged,function(req,res){
	
	User.findOne(req.body).populate('admin_apps').populate('subscribed_apps').exec(function(err,user){

		if(err)
		{
			//log error if any
			console.log(err);
			res.json({success:false});
		} else if(!user){
			res.json({success:false,msg:"problems in finding user"});
		} else{
			//return json with user data
			res.json({success:true, userdata:{_id:user._id, first_name:user.first_name, last_name: user.last_name, email: user.email, username: user.username}
		    , subscribed_apps: user.subscribed_apps, admin_apps: user.admin_apps});
		}
	});	
});

module.exports = router;
