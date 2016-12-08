var nodemailer = require('nodemailer');

// Create a SMTP transport object
var transport = nodemailer.createTransport("SMTP", {
    service: 'Gmail',
    auth: {
        user: "webpwebp@gmail.com",
        pass: "webp1234"
    }
});

var Sender = {
    
    send: function (type, obj, user) {
        if(type=='subscribe'){
            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: '"errorMonitor', // sender address
                to: user.email, // list of receivers
                subject: 'Subcribe on application', // Subject line
                text: 'Hi, you are subscribed on application '+ obj.name, // plaintext body
                html: '<p>Hi,</p>'+ // html body
                     +'<p>you are subcribed on application by '+obj.admin.email+'</p>'+
                     +'<p>Name:'+obj.name+'</p>'+
                     +'<p>Stack:'+obj.stack+'</p>'+
                     +'<p>Version:'+obj.version+'</p>'+
                     +'<p>Repository:'+obj.repo+'</p>'
            };

        }else if(type=='erroro'){
            
        }
        transport.sendMail(mailOptions, function(error, info){
            if(error){
                res.json({success:false,msg:error});
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    }
}

module.exports = Sender;