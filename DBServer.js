var http = require('http');
var url = require('url');
var queryProcessor = require('./test');
var sender = require('./requestSender');
var qs = require('querystring');
var server = require('./script');

var serverName = "DBServer"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE

var funcArray = {};
funcArray["/GetTournaments"] = GetTournaments; //start all comands with '/'. IT's a URL to serve


//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write
//you can get the object from POST request by typing data['parameterName']
//you NEED TO FINISH YOUR ANSWERS WITH res.end();
function GetTournaments (data, res){
	console.log("GetTournaments " + data['login']);
	res.end(currTournaments);
}

/*
var tournament1 = qs.stringify({
	ID: 1,
	buyIn: 100,
	gameNameID: 1,
	playerTotalCount: 10,
	structure: {}
});
var tournament2 = qs.stringify({
	ID: 2,
	buyIn: 100,
	gameNameID: 1,
	playerTotalCount: 100,
	structure: {}
});*/
/*var tourns1 = qs.stringify({
	t1: qs.stringify({ ID:1 })
});*/


var tournament1 = {
	ID: 1,
	buyIn: 100,
	gameNameID: 1,
	playerTotalCount: 10,
	rounds: 2,
	structure: {
		
	}
};
var tournament2 = {
	ID: 2,
	buyIn: 100,
	gameNameID: 1,
	playerTotalCount: 100,
	structure: {}
};
var tourns1 = {
	t1: tournament1,
	t2: tournament2
};

/*var currTournaments = qs.stringify({
	tournaments: tourns1
});*/
var currTournaments = JSON.stringify({
	tournaments: tourns1
});
/*console.log(currTournaments);
console.log(JSON.parse(currTournaments) );*/

var z = new Object();
z = '{"tournaments":{"t1":{"ID":1,"buyIn":100,"gameNameID":1,"playerTotalCount":10,"structure":{}},"t2":{"ID":2,"buyIn":100,"gameNameID":1,"playerTotalCount":100,"structure":{}}}}';
var c = JSON.parse(z);
console.log(c['tournaments']['t1']);

/*
var tz = {
	tournaments: {
		t1: {
			ID: 1,
			buyIn: 100,
			gameNameID: 1,
			playerTotalCount: 10,
			structure: {}
		},
		t2: {
			ID: 2,
			buyIn: 100,
			gameNameID: 1,
			playerTotalCount: 10,
			structure: {}
		}
	}
}
tz = JSON.stringify(tz);

console.log(tz);*/
/*sd.tournaments.t1 = qs.stringify(sd.tournaments.t1);
sd.tournaments.t2 = qs.stringify(sd.tournaments.t2);
sd.tournaments = qs.stringify(sd.tournaments);
sd = qs.stringify(sd);*/

/*console.log(tourns1);
console.log(currTournaments);
console.log(qs.stringify(currTournaments));*/


/*console.log("---------tz------------");
console.log(sd);
console.log(qs.stringify(sd));*/
/*
var tournament1 = qs.stringify({
	ID: 1,
	buyIn: 100,
	gameNameID: 1,
	playerTotalCount: 10,
	structure: {}
});
var tournament2 = qs.stringify({
	ID: 2,
	buyIn: 100,
	gameNameID: 1,
	playerTotalCount: 100,
	structure: {}
});
var tourns1 = qs.stringify({
	t1: tournament1,
	t2: tournament2
});

*/


server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
