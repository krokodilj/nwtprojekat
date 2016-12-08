var nodemailer = require('nodemailer');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"errorMonitor', // sender address
    to: 'diskozub@hotmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ', // plaintext body
    html: '<b>Hello world</b>' // html body
};

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