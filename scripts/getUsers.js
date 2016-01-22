//var data = {val1:"hello", val2:{val3:"world"}};
//var dataS = JSON.stringify(data);   // stringify from object
var proc = require('./test');

sender = require('./requestSender');

//sender.sendRequest("RegisterUserInTournament", regTournament,'127.0.0.1', 5000, setVal);*/
//sender.sendRequest("GetTournaments", {},'127.0.0.1', 5000, null,sender.printer);//setVal);
var currentPlayer=0;

//sender.sendRequest("GetGames", movement1,'127.0.0.1', proc.getPort('GameServer'), null ,sender.printer);//setVal);
sender.sendRequest("GetUsers", {},'127.0.0.1', proc.getPort('DBServer'), null,sender.printer);//setVal);

//sender.sendRequest("GetUserProfileInfo", {'userID':1},'127.0.0.1', proc.getPort('FrontendServer'), null,sender.printer);//setVal);

//sender.sendRequest("Move", movement1,'127.0.0.1', proc.getPort('GameServer'), null ,sender.printer);//setVal);
//sender.sendRequest("Move", movement2,'127.0.0.1', proc.getPort('GameServer'), null ,sender.printer);//setVal);

//sender.sendRequest("Move", movement2,'127.0.0.1', 5009, sender.printer);//setVal);
