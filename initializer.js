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
var COUNT_FIXED = 1;
var COUNT_FLOATING = 2;
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
var GM_ABSTRACT_SYNC=1;
var regTournament = {
	tournamentID: 2
};

//pricingType:
/*
	1 - TAKE ALL AND PAY PRIZES
	2 - TAKE COMISSION; REST GOES IN TOURNAMENT FUND
	3 - GUARANTEED + USERS
	////4 - FREE = GUARANTEED WITH 0 BUY IN
	////5 - TRAINING = FREE WITH 0 PRIZES

*/

var PRICE_FREE = 4;
var PRICE_TRAINING = 5;

var PRICE_GUARANTEED = 3;
var PRICE_NO_EXTRA_FUND = 2;
var PRICE_CUSTOM = 1;  //

function MakeFreeTournament( initFund, gameNameID, pricingType, goNext, rounds){
	return {
		buyIn:0,
		gameNameID:gameNameID,
		initFund:initFund,
		pricingType:pricingType,
		goNext:goNext,
		playersCountStatus:COUNT_FIXED,

	};
}
/*
	функции создания турниров изменяют следующие данные:
		buyIn,
		initFund,
		places,
		Prizes
	принимают buyIn, pricingType, initFund


*/


var tournament3 = {
	//ID: 1,
	buyIn: 100,
	gameNameID: GM_ABSTRACT_SYNC,
	//playerTotalCount: 10,
	/*winners: 2,
	minPlayersPerGame: 2,
	maxPlayersPerGame: 3,*/
	initFund: 0,
	pricingType: PRICE_CUSTOM,
		places: [1  ],		//Я не должен считать это руками!!!
		Prizes: [270],		//И это тоже!!!
	rounds: 1,
	goNext: [3, 1],
	
	/*roundsList: [
		{
			lucky:1,
			players: 3,
			games: 3,
			winners: 3
		},
		{
			players: 2,
			games: 2,
			winners: 3
		}
	],*/
	playersCountStatus: COUNT_FIXED
};
var tournament2 = {
	buyIn: 0,
	gameNameID: GM_ABSTRACT_SYNC,
	pricingType: PRICE_FREE,
	places: [1  , 2  , 3  ],
	Prizes: [300, 200, 150],
	rounds: 1,
	goNext: [20, 3],
	playersCountStatus: COUNT_FIXED
};

var tournament1 = {
	buyIn: 			100,
	initFund: 		0,
	gameNameID: 	GM_ABSTRACT_SYNC,

	pricingType: 	PRICE_NO_EXTRA_FUND,

	rounds: 		1,
	goNext: 		[3,1],
		places: 		[1],
		Prizes: 		[270],
		prizePools: 	[1],

	comment: 		'Yo',
	
	playersCountStatus: COUNT_FIXED,///Fixed or float
		startDate: 		null,
		status: 		null,	
		players: 		[]
}
var tournament4 = {
	buyIn: 			100,
	initFund: 		0,
	gameNameID: 	GM_ABSTRACT_SYNC,

	pricingType: 	PRICE_NO_EXTRA_FUND,

	rounds: 		1,
	goNext: 		[2,1],
		places: 		[1],
		Prizes: 		[180],
		prizePools: 	[1],

	comment: 		'Yo',
	
	playersCountStatus: COUNT_FIXED,///Fixed or float
		startDate: 		null,
		status: 		null,	
		players: 		[]
}


/*
	buyIn:Number,
	gameNameID: Number,
	playerTotalCount: Number,
	winners: Number,
	minPlayersPerGame: Number,
	maxPlayersPerGame: Number,
	lucky:Number,
	//Prizes: Array,
	Comment:String,
	rounds:Number,
	goNext: Array,
	prizes: Array,

	playersCountStatus:Number,///Fixed or float
	roundsList: Array
*/





/*
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



*/




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

/*sender.sendRequest("Register", user1, '127.0.0.1', 'FrontendServer', null, sender.printer);
sender.sendRequest("Register", user2, '127.0.0.1', queryProcessor.getPort('FrontendServer'), null, sender.printer);*/

/*sender.sendRequest("ServeTournament", tournament4, '127.0.0.1', queryProcessor.getPort('BalanceServer'), null, sender.printer);//TournamentManager
sender.sendRequest("ServeTournament", tournament4, '127.0.0.1', queryProcessor.getPort('BalanceServer'), null, sender.printer);//TournamentManager*/

var tournCounter=8;

tournamentAddingTimer = setInterval(function(){
	if (tournCounter>0){
			//sender.sendRequest("ServeTournament", tournament4, '46.101.157.129', 'BalanceServer', null, sender.printer);//TournamentManager
			//sender.sendRequest("RestartTournament", {tournamentID:tournCounter}, '127.0.0.1', 'BalanceServer', null, sender.printer);
			
			//sender.sendRequest("ServeTournament", tournament4, '46.101.157.129', 'BalanceServer', null, sender.printer);//TournamentManager
			sender.sendRequest("RestartTournament", {tournamentID:tournCounter}, '46.101.157.129', 'BalanceServer', null, sender.printer);

			tournCounter--;
	}
	else{
		clearInterval(tournamentAddingTimer);
	}
}, 200);

/*for (i=1;i<8;++i){
}*/

/*sender.sendRequest("RestartTournament", {tournamentID:1}, '127.0.0.1', queryProcessor.getPort('BalanceServer'), null, sender.printer);//TournamentManager*/



/*sender.sendRequest("Move", movement1,'127.0.0.1', 5009, null ,sender.printer);//setVal);
sender.sendRequest("Move", movement2,'127.0.0.1', 5009, null ,sender.printer);//setVal);*/

//sender.sendRequest("Move", movement2,'127.0.0.1', 5009, sender.printer);//setVal);

/*var timerId = setInterval(function() {
  prt();
}, 2000);*/

