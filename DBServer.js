var http = require('http');
var url = require('url');
var queryProcessor = require('./test');
var sender = require('./requestSender');
var qs = require('querystring');
var server = require('./script');

var serverName = "DBServer"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE

var funcArray = {};
funcArray["/GetTournaments"] = GetTournaments; //start all comands with '/'. IT's a URL to serve
funcArray["/GetUsers"] = GetUsers;
funcArray["/AddTournament"] = AddTournament;
funcArray["/Register"] = Register;

funcArray["/GetUserProfileInfo"] = GetUserProfileInfo;

var currentTournamentCounter=0;
var tournaments = {};
var users= {count:0 };
var IDToLoginConverter = {count:0};
//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write
//you can get the object from POST request by typing data['parameterName']
//you NEED TO FINISH YOUR ANSWERS WITH res.end();


function GetUsers( data,res){
	sender.Answer(res, users);
}

function GetUserProfileInfo(data , res){

	var userID = data['userID'];
	console.log('-----------USER PROFILE INFO -----ID=' + userID + '------');
	var user = {};
	var login = IDToLoginConverter[userID];
	for (var key in users[login]) {
		user[key] = users[login][key];
	}
	//user = users[login];
	console.log(JSON.stringify(user));
	user.password = '****';
	console.log(user);
	console.log('------EX-----');
	console.log(users[login]);
	sender.Answer(res, user);
	//sender.sendRequest("GetUserProfileInfo", data, '127.0.0.1', queryProcessor.getPort('DBServer'), res, GetUserProfileInfoHandler);
}

function Register (data, res){
	var login = data['login'];
	console.log('adding user :' + login + '. (' + JSON.stringify(data) + ')');
	console.log('Check the data WHILE adding USER!!! need to write Checker');
	if (UserExists(login)){
		console.log('Sorry, user ' + login + ' Exists');
		sender.Answer(res, {result: 'UserExists'});
	}
	else{
		console.log('Added user ' + login + ' !!!');
		users[login] = data;
		users[login].userID = ++users.count;
		users[login].money = 100;
		IDToLoginConverter[users[login].userID]= login;
		sender.Answer(res, {result: 'OK'});
	}

}
function UserExists(login){
	var a = users[login];//(users[login]===undefined);
	console.log(a);
	return a;
}
/*function GetUserProfileInfoHandler ( error, response, body, res){
	
}*/

function GetTournaments (data, res){

	console.log("GetTournaments " + data['login']);
	console.log(data);
	sender.Answer(res, tournaments);
	//res.end(currTournaments);
}

function AddTournament (data, res){
	var tournament = data;
	var tournID = ++currentTournamentCounter;
	tournament.tournamentID = tournID;
	tournaments[tournID] = tournament;
	console.log('Added tournament ' + tournID);
	console.log('++++++++++++++++++++++++++++');
	console.log(JSON.stringify(tournament));
	console.log('----------------------------');

	sender.Answer(res, tournament);
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


/*var tournament1 = {
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
};*/
/*var tourns1 = {
	t1: tournament1,
	t2: tournament2
};*/
//console.log("Checking Data taking: " + get2(post, 'tournaments', 't1'));
				//res.end(get(post,'tournaments'));


/*var currTournaments = qs.stringify({
	tournaments: tourns1
});*/
/*var tournaments = {
	1: tournament1,
	2: tournament2
}*/

/*var currTournaments = {
	tournaments: tourns1
};*/
/*console.log(currTournaments);
console.log(JSON.parse(currTournaments) );*/

/*var z = new Object();
z = '{"tournaments":{"t1":{"ID":1,"buyIn":100,"gameNameID":1,"playerTotalCount":10,"structure":{}},"t2":{"ID":2,"buyIn":100,"gameNameID":1,"playerTotalCount":100,"structure":{}}}}';
var c = JSON.parse(z);
console.log(c['tournaments']['t1']);*/

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
