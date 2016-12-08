var express=require('express');
var mongoose=require('mongoose');
var User = require('../model/user');
var App = require('../model/app');
var jwt = require('jsonwebtoken');
var config = require('../config')
//var Event=require('../model/event')
var sender = require('../controller/sender');

var router = express.Router();
mongoose.createConnection(config.database);

//auth middleware
router.use(function(req,res,next){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if(!token){
		res.json({success:false,msg:"no token provided"});
	}else{
		jwt.verify(token, config.secretKey, function(err, user) {      
      if (err) {
        return res.json({ success: false, msg: 'failed to authenticate' });    
      } else {
        
        req.user = user;    
        next();
      }
    });
	}
  	
});


//is admin middleware
var is_admin=function(req,res,next){

	User.findOne({_id:req.user._id}).exec(function(err,user){
		if(err){
			console.log(err)

		//fail > not authorised
		}else if(!(user.admin_apps.indexOf(req.body.app_id)>=0)){
			return res.json({success:false,msg:"not authorised"});			

		//ok 	
		}else{
			next();
		}
		
	})
	
}

//del//all apps
router.post('/',function(req,res){
	App.find({},function(err,result){
		return res.json(result)
	})
})

//register new app
router.post('/app/add',function(req,res){
	var app=new App(req.body);
	app.admin=req.user._id;
	
	app.save(function(err){
		if(err){
			console.log(err)
			res.json({success:false});
		}else{
			res.json({success:true});
			User.findOne({_id:req.user._id},function(err,user){
				user.admin_apps.push(app._id);
				console.log(app._id)
				user.save(function(err){
					console.log(err);
				});
				
				
			})
		}
	})
})

//subscribe user to app
//req must have body.app_id
router.post('/app/subscribe',is_admin,function(req,res){

	
	User.findOne({_id:req.body.user_id},function(err,user){
		
		//if user is already subscribed
		if (user.subscribed_apps.indexOf(req.body.app_id) >= 0) {    				
			return res.json({success:"false",msg:"user is already subscribed"})
		}
		//if its admin user o.O
		if (user.admin_apps.indexOf(req.body.app_id) >= 0) {  
			return res.json({success:false,msg:"wtf you are admin"})
		}
		//add app to user
		user.subscribed_apps.push(req.body.app_id);
		user.save(function(err){

			if(err){
				console.log(err);
				return res.json({success:false})
			}else{
				
				App.findOne({_id:req.body.app_id},function(err,app){

					//add user to app
					app.subscribers.push(req.body.user_id);
					app.save(function(err){
						if(err){
							console.log(err);
							return res.json({success:false})
						}else{
							sender.send('subscribe', app, user);							
							return res.json({success:true})
						}

					})
				})
			}
		})
	})
	
	
});




module.exports= router;