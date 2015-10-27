var sender = require('./requestSender');
var sendRequest = sender.sendRequest;
var Answer = sender.Answer;


var strLog = sender.strLog;
var serverName = "BalanceServer";

const GET_TOURNAMENTS_BALANCE = 2;
const GET_TOURNAMENTS_FINISHED = 3;

var chkTourn = setInterval(CheckTournaments, 8500);//setInterval
LogFinishedTournaments();

function processTournament(tournament){
	if (tournament && tournament.tournamentID && tournament.status==null){
		sendRequest("ServeTournament", tournament, '127.0.0.1', 
			'TournamentServer',  null, function (error, response, body, res){
					strLog('ServeTournament body : ' + JSON.stringify(body));
					if (body.result=='OK'){
						sendRequest('EnableTournament', tournament, '127.0.0.1', 'DBServer', null, sender.printer);
					}
				} );
	}
}

function CheckTournaments(){
	sendRequest('GetTournaments', {purpose:GET_TOURNAMENTS_BALANCE}, '127.0.0.1', 'DBServer', null, 
		function (error, response, body, res){
			for (var i = body.length - 1; i >= 0; i--) {
				var tournament = body[i];
				processTournament(tournament);
				if (i == body.length - 1 && i>0){
					strLog('New tournaments count: ' + i);
				}
			};
		}
	);
}


function LogFinishedTournaments (){
	sendRequest('KillFinishedTournaments', {purpose:GET_TOURNAMENTS_FINISHED}, '127.0.0.1', 'DBServer', null, 
		function ( error, response, body, res){
			if (error) {strLog(JSON.stringify(error));}
			else{
				strLog('Killed : ' + JSON.stringify(body));
			}
		})
}