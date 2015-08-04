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
	//var a = new Object();
	//a = JSON.parse(data) ;
	console.log(data['structure']);
	//console.log((JSON.parse(data))["ID"] );
	AnalyzeStructure(data['structure'])
	console.log("----");
	/*var d = data['buyIn'];
	console.log(d);*/



	console.log("ServeTournament " + JSON.stringify(data));
	res.end("Serving OK");
}

function AnalyzeStructure(structure){
	console.log(structure);
	var numberOfRounds = structure['rounds'];
	console.log("numberOfRounds= " + numberOfRounds);

	for (var i = 0; i <= numberOfRounds; ++i) {
		//var roundI = structure['round'+i];
		console.log("nextS[" + i + "] = " + structure['goNext'][i])
	};

}

server.SetServer(serverName, '127.0.0.1', funcArray);//THIS FUNCTION NEEDS REWRITING. '127.0.0.1' WORKS WELL WHILE YOU ARE WORKING ON THE LOCAL MACHINE
