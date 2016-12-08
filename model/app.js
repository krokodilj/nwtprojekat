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
	admin:{
		type:Schema.Types.ObjectId,
		ref:'User'
	},
	subscribers:[{
		type:Schema.Types.ObjectId,
		ref:'User'
	}]


	

	
}));