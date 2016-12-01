var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('App',new Schema({
	name:{
		type:String,
		required:true,
		unique:true
	},
	stack:[String],
	version:String,
	repo:String,
	events:[{
		type:Schema.Types.ObjectId ,
		ref:'Event'
	}],
	_admin:{
		type:Number,
		ref:'User'
	}


	

	
}));