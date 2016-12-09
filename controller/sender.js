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
    
    send: function (type, obj, users) {
        console.log(obj);
        if(type=='subscribe'){
            // setup e-mail data 
            var mailOptions = {
                from: 'errorMonitor 👥', // sender address
                to: users.email, // list of receivers
                subject: 'Subcribe on application', // Subject line
                text: 'Hi, you are subscribed on application '+ obj.name, // plaintext body
                html: '<p>Hi,</p><p>you are subcribed on application by '.concat(obj.admin.email,'</p><p>Name: ',obj.name,
                     '</p><p>Stack: ',obj.stack,'</p><p>Version: ',obj.version,'</p>')
            };

        }else if(type=='error'){
            // setup e-mail data 
            var mailOptions = {
                from: 'errorMonitor 👥', // sender address
                to: users.toString(), 
                subject: 'Error on application '+obj.app.name, // Subject line
                text: 'Date: '+ obj.date, // plaintext body
                html: '<p>Hi,</p><p>this is notification for error on application '.concat(obj.app.name,'</p><p>Stack      : ',
                        obj.stack,'</p><p>Fragment   : ',obj.fragment,'</p><p>Date       : ',obj.date,'</p>')
            };
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