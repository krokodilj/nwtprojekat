var nodemailer = require('nodemailer');
var express = require('express');
var sender = require('../controller/sender');
var router = express.Router();

// send mail with defined transport object
router.post('/',function(req,res){
    
    sender.send();
});

module.exports = router;