var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../model/user');

var Auth={
	is_logged:function(req,res,next){
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
	  	
	},

	is_admin:function(req,res,next){

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


}
module.exports=Auth