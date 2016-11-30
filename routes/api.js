var express=require('express');
var mongoose=require('mongoose');

var router = express.Router();
mongoose.connect('mongodb://localhost:27017/nwtprojekat');





module.exports= router;