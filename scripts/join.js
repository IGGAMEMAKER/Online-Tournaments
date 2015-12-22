sender = require('./requestSender');

var args = process.argv.slice(2);
var curTournAndGameID=0;
//console.log(args.length);
if (args.length>0){//} || args.length=='0'){
	curTournAndGameID = args[0];
}
console.log(curTournAndGameID);

sender.sendRequest("Join", {login:"Gaga", gameID:curTournAndGameID||426} ,'127.0.0.1', 2);
//sender.sendRequest("GetTournaments", {},'127.0.0.1', 5000, null,sender.printer);//setVal);
var currentPlayer=0;

//sender.sendRequest("GetGames", movement1,'127.0.0.1', proc.getPort('GameServer'), null ,sender.printer);//setVal);
//sender.sendRequest("GetUsers", {},'127.0.0.1', proc.getPort('DBServer'), null,sender.printer);//setVal);

//sender.sendRequest("GetUserProfileInfo", {'userID':1},'127.0.0.1', proc.getPort('FrontendServer'), null,sender.printer);//setVal);

//sender.sendRequest("Move", movement1,'127.0.0.1', proc.getPort('GameServer'), null ,sender.printer);//setVal);
//sender.sendRequest("Move", movement2,'127.0.0.1', proc.getPort('GameServer'), null ,sender.printer);//setVal);

//sender.sendRequest("Move", movement2,'127.0.0.1', 5009, sender.printer);//setVal);

