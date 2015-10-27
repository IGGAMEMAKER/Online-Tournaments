var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'ololo', // Your email id
            pass: '00000' // Your password
        }
    });
var text = 'Hello world from \n\n' + 'Gaga!';
//from: 'borat@best.ru', // sender address
var mailOptions = {
    
    to: '0000g@mail.ru', // list of receivers
    subject: 'Шаблон письма 2', // Subject line
    text: text //, // plaintext body
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        //res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
        //res.json({yo: info.response});
    };
});