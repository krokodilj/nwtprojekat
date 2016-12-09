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
		required:true,
		default: Date.now 
	},
	version:String,
	app: { 
		type: Schema.Types.ObjectId,
		 ref: 'App' 
		}

	
})

schema.pre('save',function(next){
	this.date=new Date();

	next();
});

module.exports = mongoose.model('Event',schema);
