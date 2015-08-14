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
sender = require('./requestSender');

//sender.sendRequest("RegisterUserInTournament", regTournament,'127.0.0.1', 5000, setVal);*/
sender.sendRequest("GetTournaments", user1,'127.0.0.1', 5000, null,sender.printer);//setVal);
var currentPlayer=0;

//sender.sendRequest("GetGames", movement1,'127.0.0.1', proc.getPort('GameServer'), null ,sender.printer);//setVal);
//sender.sendRequest("GetUsers", user1,'127.0.0.1', proc.getPort('DBServer'), null,sender.printer);//setVal);

//sender.sendRequest("GetUserProfileInfo", {'userID':1},'127.0.0.1', proc.getPort('FrontendServer'), null,sender.printer);//setVal);

//sender.sendRequest("Move", movement1,'127.0.0.1', proc.getPort('GameServer'), null ,sender.printer);//setVal);
//sender.sendRequest("Move", movement2,'127.0.0.1', proc.getPort('GameServer'), null ,sender.printer);//setVal);

//sender.sendRequest("Move", movement2,'127.0.0.1', 5009, sender.printer);//setVal);
