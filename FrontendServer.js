var serverName = "FrontendServer";
var sender = require('./requestSender');
sender.setServer(serverName);
var Answer = sender.Answer;

var express         = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
var strLog = sender.strLog;


/*process.argv.forEach(function (val, index, array) {
  strLog(index + ': ' + val);
});*/
app.use(function(req,res,next){
    strLog('REQUEST!!!  :  ' + req.url);
    next();
});

app.post('/FinishGame', FinishGame);
app.post('/StartTournament', StartTournament);
app.post('/StopTournament', StopTournament);
//app.post('/AddTournament', AddTournament);
app.post('/ServeTournament', ServeTournament);



app.post('/GetUserProfileInfo', GetUserProfileInfo);

app.post('/GetTournaments', GetTournaments);
app.post('/GetUsers', GetUsers);

///********************** 	TournamentManager
/*function GetGameFrontendAdress(gameNameId){
	strLog("rewrite FS.GetGameFrontendAdress");
	var adress = {
		IP: '127.0.0.1',
		port: 'GameFrontendServer'
	};
	return adress;
}

function SendTournamentHandler( error, response, body, res) { //this code is used :) delete it if you KNOW, what are you doing
	strLog("SendTournamentHandler THIS METHOD WORKS", 'Tournaments');
	Answer(res, {result:'OK'});
	//res.end('OK');
}*/

function ServeTournament (req, res){
	var data = req.body;
	strLog("ServeTournament ... FS ", 'Tournaments')
	//strLog(JSON.stringify(data));//['tournamentStructure']);
	
	//strLog("Sending Tournament...");
	var tournament = data;
	//var adress = GetGameFrontendAdress(tournament.gameNameID);

	/*sender.sendRequest("ServeTournament", tournament,
		adress['IP'], adress['port'], res, proxy);*/
		//SendTournamentHandler

	sender.sendRequest("ServeTournament", tournament, '127.0.0.1', 'GameFrontendServer', res, proxy);
}

function StartTournament (req, res){
	var data = req.body;
	//strLog('StartTournament')
	sender.sendRequest("StartTournament", data, '127.0.0.1', 'site', null, sender.printer);
	strLog("StartTournament " + data['tournamentID']);//['tournamentStructure']);

	sender.sendRequest("StartTournament", data, '127.0.0.1', 'GameFrontendServer', null, sender.printer);//sender.printer
	res.end("StartTournament");
}

function StopTournament (req, res){
	strLog('FrontendServer StopTournament :::'+req.body.tournamentID, 'Manual');
	sender.sendRequest("StopTournament", {tournamentID:req.body.tournamentID}, '127.0.0.1', 'GameFrontendServer', res, sender.Proxy);

}

function FinishGame(req, res){
	var data = req.body;
	Answer(res, {result:'OK', message:'FinishGame'});
	sender.sendRequest("FinishGame", data, '127.0.0.1', 'TournamentServer', null, sender.printer);
}

///**********************


function GetTournaments(req, res){//DON'T MODIFY OBJ!!
	var data = req.body;
	//strLog(data);
	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID'],
		query: data['query'],
		queryFields: data['queryFields'],
		purpose: data['purpose']||null
	};
	//strLog('Getting Tournaments: ' + JSON.stringify(obj) , 'WARN');
	sender.sendRequest("GetTournaments", obj, '127.0.0.1', 'DBServer', res, proxy);
}









///

function GetUsers(req, res){
	var data = req.body;
	sender.sendRequest("GetUsers", data, '127.0.0.1', 'DBServer', res, proxy);
}

function GetUserProfileInfo(req , res){
	var data = req.body;
	strLog(data);
	sender.sendRequest("GetUserProfileInfo", data, '127.0.0.1', 'DBServer', res, proxy);
}

function proxy(error, response, body, res){
	Answer(res, body);
}

var server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  strLog(serverName + ' is listening at http://%s:%s', host, port);
});

function RememberPassword( data, res){
	res.end("Try to remember");
	strLog("You must send rememberPass to Account Server");
}

function ChangePassword( data, res){
	res.end("OK");
	strLog("You must send changePass to Account Server");
}