var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var User = require('../model/user');

var router = express.Router();
mongoose.connect('mongodb://localhost:27017/nwtprojekat');

//del//get all users
router.get('/', function(req, res, next) {

	User.find({}, function(err, users) {
		console.log(users[0].first_name)
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
	console.log(req.body);
	User.findOne(req.body,function(err,user){
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
			var token = jwt.sign(user,"tajnikljuc");
			res.json({success:true,msg:"stavi ga u pdze",token:token});
		}
	})
});

module.exports = router;
