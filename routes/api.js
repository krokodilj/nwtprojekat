var express=require('express');
var mongoose=require('mongoose');
var App = require('../model/app');
//var Event=require('../model/event')

var router = express.Router();
mongoose.createConnection('mongodb://localhost:27017/nwtprojekat');

router.use(function(req,res,next){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if(!token){
		res.json({success:false,msg:"no token provided"});
	}else{
		jwt.verify(token, app.get('superSecret'), function(err, user) {      
      if (err) {
        return res.json({ success: false, msg: 'failed to authenticate' });    
      } else {
        
        req.user = user;    
        next();
      }
    });
	}
  	
});

//del//all apps
router.get('/',function(req,res){
	App.find({},function(err,result){
		res.json(result)
	})
})

//register new app
router.post('/app/add',function(req,res){
	var app=new App(req.body);

	app.save(function(err){
		if(err){
			console.log(err)
			res.json({success:false});
		}else{
			res.json({success:true});
		}
	})
})

//modify app
router.put('/app/modify',function(req,res){

	var name= req.json.name;

	App.find({name},function(err,app){
		if(err){
			res.json({success:false})

		//fail > app not found
		}else if(!app){
			res.json({success:false,msg:"app not found"})
		}else{
			app.stack=req.json.stack;
			app.version=req.json.version;
			app.repo=req.json.repo;
		}
	})
});



module.exports= router;