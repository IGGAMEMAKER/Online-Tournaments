var nodemailer = require('nodemailer');
var Promise = require('bluebird');

var sender = require('./requestSender');
var Stats = sender.Stats;

var auth;
var transporter;

var canSend=0;

this.set = function(mailAuth, Log){
    if (!mailAuth){
        if (Log) Log('NO MAIL CONFIGS!!!', 'Err');
        return;
    }
    canSend=1;

    auth = mailAuth;
    console.log(auth);

    transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: mailAuth.user, // Your email id
                pass: mailAuth.pass // Your password
            }
        });
}

//var text = 'Hello world from \n\n' + 'Gaga!';
//from: 'borat@best.ru', // sender address

/*var mailOptions = {
    
    to: '0000g@mail.ru', // list of receivers
    subject: 'Шаблон письма 2', // Subject line
    text: text //, // plaintext body
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
};*/
//from:auth.user,

this.sendStd = function(to, subject, text, html, res){
    var mailOptions = {
        to: to,
        subject: subject,
        text: text
    }
    console.error('sendStd: '+ JSON.stringify(mailOptions) );
    
    //if (canSend){
    transporter.sendMail(mailOptions, function (error, info){
        if(error){
            console.error(error);
            //return {result:0, error:error};
            if (res) res.json({yo: 'error', Message:error});
            Stats('MailFail', {});
        }else{

            console.error('Message sent: ' + info.response);
            //return {result:1 };
            if (res) res.json({yo: info.response});
        };
    });
    /*}
    else{
        console.error('Can not send Message');
    }*/
}

this.send = function(msg){
    return new Promise(function (resolve, reject){

        var mailOptions = {
            from:auth.user,
            to: msg.to,
            subject: msg.subject,
            html: msg.text||msg.html||'Hola! no Message!'
        }

        if (canSend){
            Stats('Mail', {});
            transporter.sendMail(mailOptions, function (error, info){
                if(error){
                    console.log(error);
                    msg.error = error;
                    Stats('MailFail', {});
                    reject(msg);


                    //return {result:0, error:error};
                    //res.json({yo: 'error'});
                }else{
                    console.log('Message sent: ' + info.response);
                    
                    resolve(msg);
                    //return {result:1 };
                    //res.json({yo: info.response});
                };
            });
        }
        else{
            console.error('Can not send Message');
            reject(msg);
        }
    });
    //function (to, subject, text, html){}
}