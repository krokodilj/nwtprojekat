var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config')
var jwt = require('jsonwebtoken');

module.exports = mongoose.model('App',new Schema({
	name:{
		type:String,
		required:true,
		unique:true
	},
	stack:[String],
	version:String,
	repo:String,
	token:{
		type:String,
		required:true,
		default:Math.random
	},
	admin:{
		type:Schema.Types.ObjectId,
		ref:'User'
	},
	subscribers:[{
		type:Schema.Types.ObjectId,
		ref:'User'
	}]
	
}));

