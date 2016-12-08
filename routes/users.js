var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var User = require('../model/user');
var config = require('../config')

var router = express.Router();
mongoose.connect(config.database);

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

module.exports = router;
