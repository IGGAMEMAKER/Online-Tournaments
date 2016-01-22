//var data = {val1:"hello", val2:{val3:"world"}};
//var dataS = JSON.stringify(data);   // stringify from object
var proc = require('./test');
/*$.ajax({
        url:"127.0.0.1:5000",
        type:"POST",
        data:dataS,       //using dataType String
        success:function (res)
        {
             resHandler(res);
        }
});
console.log(dataS);*/
//    { form: { key: 'value' } }
//var request = require('request');
//dataString
/*request.post(
    'http://127.0.0.1:5000',
    form: {user: 'userValue'},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body + "Pew!")
        }
    }
);*/
/*
request.post({url:'http://127.0.0.1:5000', form: {key:'value'}}, function(err,httpResponse,body){             console.log(body + "Pew!") })*/
var names = ['Raja', 'Kumar', 'Djavaka', 'Danda', 
             'Indrajit', 'Luckshman', 'Pandia', 'Rama',
             'Tara', 'Ushira', 'Hiriankashipu', 'Yadu',
             'Baka', 'Brahma', 'Vajara' , 'Vishaliakarani'];

var users = {};
for (i=1;i<15;i++){
    users[i]= {
        login: names[i],
        password: 'Kumar',
        job   : [ 'language', 'PHP' ]
    }
}



sender = require('./requestSender');
var j=0;

var timerId3 = setInterval(function() {
  //prt();
  j++;
  //currentPlayer=1;
  if (j>13){j=1; clearInterval(timerId3); }
  console.log('Register User '+ users[j].login);
  sender.sendRequest("Register", users[j],
    '127.0.0.1', proc.getPort('FrontendServer'), null ,sender.printer);//setVal);
}, 50);