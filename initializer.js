sender = require('./requestSender');
var queryProcessor = require('./test');
//var http = require('http');

var user2 = {
      login: 'Raja',
      password: 'Kumar',
	job   : [ 'language', 'PHP' ]
    };

var user1 = {
      login: 'Dinesh',
      password: 'Kumar',
	job   : [ 'language', 'PHP' ]
    };

var options = {
    host: '127.0.0.1',
    port: 5000,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(user2)
    }
};

function prt(){
	console.log(i.Zi);
}

var movement1= {
	playerID:1,
	tournamentID:1,
	gameID:1,
	token:'qwzs',
	movement:150
}
var movement2= {
	playerID:2,
	tournamentID:1,
	gameID:1,
	token:'qwzs',
	movement:100
}

var regTournament = {
	tournamentID: 2
};

var tournament1 = {
	//ID: 1,
	buyIn: 100,
	gameNameID: 1,
	playerTotalCount: 10,
	winners: 2,
	minPlayersPerGame: 2,
	maxPlayersPerGame: 3,
	lucky:1,
	Prizes: [100,50, 25],
	structure: {
		rounds: 1,
		goNext: [10, 2],
		//winners per whole round
		round1:{
			subRound1:{
				ID:1,
				players: 3,
				games: 3,
				winners: 3
			},
			subRound2:{
				ID:2,
				players: 2,
				games: 2,
				winners: 2
			}
		}
	}
};

/*
	WHAT DO I NEED?
	* REGISTER 10 USERS
	* CREATE BUNCH OF TOURNAMENTS AND SEND THEM TO final game server, DB and TournamentServer
	** tournament will come from AdmPan->BalServ->
	** adding tournament process
	** 1) find out, can we find GameServer for that ? (send tournament to TournamentManager->GameFrontendServer->GameServer->GameFrontendServer->TournamentManager)
	** 2) search target TournamentServer for that stuff (Ask Balance Server for 'free Tournament Server')
	** 3) 


*/
//console.log(user2);
/*
//sendRequest("start", options, b);///urlPath, curData, host, port, responseCallBack

sender.sendRequest("Login", user1, '127.0.0.1', 5000, null ,sender.printer);
///sender.sendRequest("ChangePassword", user1, '127.0.0.1', 5000, sender.printer);
///sender.sendRequest("RememberPassword", user1, '127.0.0.1', 5000, sender.printer);
sender.sendRequest("GetTournaments", user1,'127.0.0.1', 5000, null,sender.printer);//setVal);
*/
//sender.sendRequest("RegisterUserInTournament", regTournament,'127.0.0.1', 5000, setVal);
sender.sendRequest("Register", user1, '127.0.0.1', queryProcessor.getPort('FrontendServer'), null, sender.printer);
sender.sendRequest("Register", user2, '127.0.0.1', queryProcessor.getPort('FrontendServer'), null, sender.printer);

sender.sendRequest("ServeTournament", tournament1, '127.0.0.1', queryProcessor.getPort('BalanceServer'), null, sender.printer);//TournamentManager

/*sender.sendRequest("Move", movement1,'127.0.0.1', 5009, null ,sender.printer);//setVal);
sender.sendRequest("Move", movement2,'127.0.0.1', 5009, null ,sender.printer);//setVal);*/

//sender.sendRequest("Move", movement2,'127.0.0.1', 5009, sender.printer);//setVal);

/*var timerId = setInterval(function() {
  prt();
}, 2000);*/

