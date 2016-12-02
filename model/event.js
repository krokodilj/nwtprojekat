var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	stack:{
		type:String,
		required:true,
	},
	fragment:{
		type:String,
		required:true
	},
	date:{
		type:Date,
		required:true
	},
	version:String,
	app: { type: Number, ref: 'App' }

	
})

schema.pre('save',function(next){
	this.date=new Date();

	next();
});

module.exports = mongoose.model('Event',schema);
