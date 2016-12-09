var express=require('express');
var mongoose=require('mongoose');
var User = require('../model/user');
var App = require('../model/app');
var Event = require('../model/event');
var config = require('../config');
var auth = require('../controller/auth');
var Event=require('../model/event')
var sender = require('../controller/sender');

var router = express.Router();
mongoose.createConnection(config.database);

//auth middleware
router.use(auth.is_logged);


//del//all apps
router.post('/',function(req,res){
	App.find({},function(err,result){
		return res.json(result)
	})
});

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
				
				user.save(function(err){
					console.log(err);
				});
				
				
			})
		}
	})
});

//subscribe user to app
//req must have body.app_id
router.post('/app/subscribe',auth.is_admin,function(req,res){

	
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

/*submit error*/

router.post('/app/errorlog',function(req,res){
	
	
	//get application name
	var appID = req.body.app_id;
	
	var event = new Event(req.body.event);


	var userId=req.user._id
	var query = {"_id":userId};
	
	
	User.findOne(query).populate('admin_apps').populate('subscribed_apps').exec(function(err,user){
		if(err){
			console.log(err);
			res.json({success:false});
		} else if(!user){
			res.json({success:false, msg:"Error in user fetching"});
		} else{
			
			//put app id into event object
			event.app = appID;
			//save the event 
			console.log(event);
			event.save(function(err){
				if(err){
					console.log(err);
					res.json({success:false});
				}else{
					//SEND ERROR TO EMAILS
					res.json({success:true});
				}
			});
				

			
		}
	});
});



module.exports= router;