var express = require('express');
var mongoose = require('mongoose');
var User = require('../model/user');
var App = require('../model/app');
var Event = require('../model/event');
var config = require('../config');
var auth = require('../controller/auth');
var Event = require('../model/event')
var sender = require('../controller/sender');

var router = express.Router();
mongoose.createConnection(config.database);

//auth middleware
router.use(auth.is_logged);


//del//all apps
router.post('/', function (req, res) {
	App.find({}, function (err, result) {
		return res.json(result)
	})
});

//register new app
router.post('/app/add', function (req, res) {
	var app = new App(req.body);
	app.admin = req.user._id;

	app.save(function (err) {
		if (err) {
			console.log(err)
			res.json({ success: false });
		} else {
			res.json({ success: true });
			User.findOne({ _id: req.user._id }, function (err, user) {
				user.admin_apps.push(app._id);

				user.save(function (err) {
					console.log(err);
				});


			})
		}
	})
});

//subscribe user to app
//req must have body.app_id
router.post('/app/subscribe', auth.is_admin, function (req, res) {


	User.findOne({ _id: req.body.user_id }, function (err, user) {

		//if user is already subscribed
		if (user.subscribed_apps.indexOf(req.body.app_id) >= 0) {
			return res.json({ success: "false", msg: "user is already subscribed" })
		}
		//if its admin user o.O
		if (user.admin_apps.indexOf(req.body.app_id) >= 0) {
			return res.json({ success: false, msg: "wtf you are admin" })
		}
		//add app to user
		user.subscribed_apps.push(req.body.app_id);
		user.save(function (err) {

			if (err) {
				console.log(err);
				return res.json({ success: false })
			} else {

				App.findOne({ _id: req.body.app_id }).populate('admin').exec(function (err, app) {

					//add user to app
					app.subscribers.push(req.body.user_id);
					app.save(function (err) {
						if (err) {
							console.log(err);
							return res.json({ success: false })
						} else {
							sender.send('subscribe', app, user);
							return res.json({ success: true })
						}

					})
				})
			}
		})
	})
});

/*submit error*/

router.post('/app/errorlog', function (req, res) {


	//get application name
	var appID = req.body.app_id;
	var event = new Event(req.body.event);

	//put app id into event object
	event.app = appID;

	//save the event 
	event.save(function (err) {
		if (err) {
			console.log(err);
			res.json({ success: false });
		} else {
			
			App.findOne({ _id: appID }).populate('admin subscribers').exec(function (err, app) {
				//send error to emails
				var users = []
				users.push(app.admin.email)
				for (i = 0; i < app.subscribers.length; i++) {
					users.push(app.subscribers[i].email)
				}

				event.app = app;
				sender.send("error", event, users);

				//update application version if outdated
				if(event.version !== app.version) {
					app.version = event.version;
					app.save();
				}
				res.json({ success: true, event: event });

			})

		}
	});

});

//post a new comment on a comment or event
//must be subscribed or event admin
router.post('/comment', auth.is_subscribed, function (req, res) {
	console.log(req.body);
	require('mongodb').MongoClient.connect(config.database, function (err, db) {
		if (err) {
			res.json({ success: false });
		}
		else {
			var collection = db.collection('comments');
			collection.insert(req.body.comment, function (err, docs) {
				collection.save(req.body.comment, function (err) {
					res.json({ success: true });
					db.close();
				});
			});
		}
	});

});

//get all events for given app_id
router.get('/events',auth.is_logged,function(req,res){
	var appID = req.query.app_id;
	Event.find({ 'app': appID}).exec(function(err,events){
		if(err){
			return res.json({success:false,msg:"Error in fetching events"});
		}
		return res.json({success:true,eventData:{events}});
	});
});

//delete comment
//must be comment author
router.delete('/comment', auth.is_comment_author, function (req, res) {
	require('mongodb').MongoClient.connect(config.database, function (err, db) {
		if (err) {
			return res.json({ success: false, msg: "bad database connection" });
		}
		else {
			var collection = db.collection('comments');
			collection.remove(require('mongodb').ObjectID(req.body.comment._id));
			db.close();
			return res.json({ success: true });
		}
	});
});

module.exports = router;