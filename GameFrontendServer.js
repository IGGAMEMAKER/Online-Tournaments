var http = require('http');
var url = require('url');
var queryProcessor = require('./test');
var sender = require('./requestSender');
var qs = require('querystring');
var server = require('./script');

var serverName = "GameFrontendServer"; //CHANGE SERVERNAME HERE. IF YOU ADD A NEW TYPE OF SERVER, EDIT THE HARDCODED ./TEST FILE

var funcArray = {};
funcArray["/ServeTournament"] = ServeTournament; //start all comands with '/'. IT's a URL to serve


//------------------Writing EventHandlers---------------------------------
//YOU NEED data,res parameters for each handler, that you want to write
//you can get the object from POST request by typing data['parameterName']
//you NEED TO FINISH YOUR ANSWERS WITH res.end();
function ServeTournament (data, res){
	console.log("----");
	console.log("ServeTournament :");

	console.log(data);
	
	console.log("----");

	/*var val = data['structure'];
	console.log("I can print: ");
	console.log(val);*/
	var object = AnalyzeStructure(data['structure']);


	//console.log("ServeTournament " + data);
	res.end();//"Serving OK");
}

function AnalyzeStructure(structure){
	console.log(structure);
	var numberOfRounds = structure['rounds'];
	console.log("numberOfRounds= " + numberOfRounds);
	var query = {
		numberOfRounds: numberOfRounds;
	};
	for (var i = 0; i <= numberOfRounds; ++i) {
		//var roundI = structure['round'+i];
		query['round'+(i+1)] = {

		};
		console.log("nextS[" + i + "] = " + structure['goNext'][i])
	};
	console.log(query);
	sender.sendRequest("ServeGames", tournament, queryProcessor.getPort('GameServer') adress['IP'], , //sender.printer
		function (res1) {
		    res1.setEncoding('utf8');
		    res1.on('data', function (chunk) {
				console.log("body: " + chunk);
		    });
		}
	);
}

server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
