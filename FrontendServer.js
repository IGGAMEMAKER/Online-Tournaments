//var startServer = require('./script');

var http = require('http');
var url = require('url');
var queryProcessor = require('./test');
var server = require('./script'); //var server = new http.Server();
var serverName = "FrontendServer";
var qs = require('querystring');
var sender = require('./requestSender');

/*process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});*/
var funcArray = {};//["/stop"] //'/stop' : AnswerAndKill

funcArray["/Register"] = RegisterUser;
funcArray["/Login"] = Login;
funcArray["/ChangePassword"] = ChangePassword;
funcArray["/RememberPassword"] = RememberPassword;
//funcArray["/GetUserProfileInfo"] = GetUserProfileInfo;

funcArray["/GetTournaments"] = GetTournaments;
funcArray["/RegisterInTournament"] = RegisterInTournament;
/*funcArray["/WakeUsers"] = WakeUsers;
funcArray["/UnregisterFromTournament"] = UnregisterFromTournament;*/

/*funcArray["/Cashout"] = Cashout;
funcArray["/Deposit"] = Deposit;


funcArray["/SendMessagesToUsers"] = SendMessagesToUsers;*/



/*var tournament2 = {};
tournament*/


var user1 = {
      login: 'Dinesh',
      password: 'Kumar',
	job   : [ 'language', 'PHP' ]
    };



function ChangePassword( data, res){
	res.end("OK");
	console.log("You must send changePass to Account Server");
}

function get(str, parameter){
	return JSON.stringify(str[parameter]);
}
function get2(str, par, par2){
	return JSON.stringify(str[par][par2]);
}
function get3(str, par, par2, par3){
	return JSON.stringify(str[par][par2][par3]);
}
function GetTournaments( data, res){
	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID']
	};
	sender.sendRequest("GetTournaments", obj, '127.0.0.1', queryProcessor.getPort('DBServer'), 
		function (res1) {
		    res1.setEncoding('utf8');
		    res1.on('data', function (chunk) {
				console.log("body: " + chunk);

				///analyse and return answer to client-bot
				var post = JSON.parse("" + chunk);
				/*console.log("Checking Data taking: " + JSON.stringify(post['tournaments']));*/
				console.log("Checking Data taking: " + get2(post, 'tournaments', 't1'));
				res.end(get(post,'tournaments'));


				/*console.log("body: " + chunk);

				///analyse and return answer to client-bot
				var a = new Object();
				a = "" + chunk;
				//console.log(JSON.parse(a)['tournaments']['t1']);
				//var post = new Object();
				var post = JSON.stringify(JSON.parse(chunk)['tournaments']['t1']);
				console.log(post);
				console.log("Checking Data taking: " + post);
				res.end(post);*/
				//res.end(post['tournaments']);
		    });

		    //req.on('error', function(e) {
			//console.log('problem with request: ' + e.message);
			//});
		}
	);

	/*
	var tournaments = {};
	tournaments["z0"] = tournament1;
	//tournaments["z1"] = tournament2;
	var tournaments1 = qs.stringify(tournaments);
	log(tournaments1);
	res.end(tournaments1);*/
}
function GetTournServerIP(tournamentID){
	return '127.0.0.1';
}
function RegisterInTournament( data, res){
	var obj = {
		sender: "FrontendServer",
		tournamentID: data['tournamentID']
	};
	log("Trying to register in tournament " + data['tournamentID']);
	sender.sendRequest("RegisterInTournament", obj, '127.0.0.1', queryProcessor.getPort('TournamentServer'), 
		function (res1) {
		    res1.setEncoding('utf8');
		    res1.on('data', function (chunk) {
				console.log("body: " + chunk);
				///analyse and return answer to client-bot
				var post = JSON.parse(chunk);
				/*log(post);
				log("stringifying:" + JSON.stringify(post));
				log("Value: " + post['"result']);*/
				console.log("Checking Data taking: " + post['result']);
				if (post['result'] === 'success'){
					res.end("You are Registered in tournament!!");
				}
				else{
					res.end("Tournament Register error:" + post['result']);
				}
		    });

		    //req.on('error', function(e) {
			//console.log('problem with request: ' + e.message);
			//});
		}
	);
	/*log(tournament1);
	res.end(tournament1);*/
}

function RememberPassword( data, res){
	res.end("Try to remember");
	console.log("You must send rememberPass to Account Server");
}
function log(str){ console.log(str);}
function Login( data, res){
	sender.sendRequest("Login", user1, '127.0.0.1', queryProcessor.getPort('AccountServer'), 
		function (res1) {
		    res1.setEncoding('utf8');
		    res1.on('data', function (chunk) {
				console.log("body: " + chunk);
				///analyse and return answer to client-bot
				var post = JSON.parse(chunk);
				/*log(post);
				log("stringifying:" + JSON.stringify(post));
				log("Value: " + post['"result']);*/
				console.log("Checking Data taking: " + post['result']);
				if (post['result'] === 'success'){
					res.end("You are logged in!!");
				}
				else{
					res.end("Login or password are invalid");
				}
		    });

		    //req.on('error', function(e) {
			//console.log('problem with request: ' + e.message);
			//});
		}
	);
}
function universalAnswer(error, response, body, res, method){//response is a response, which we get from request sender. res is a response
	//to the server, which called this server
	//someone requested this server. We try to send this request next for taking more detailed information. We get a 'response'.
	//We analyze this response and give an answer by the object 'res' in method 'method'
	if (!error) {
    	console.log(body);

        var info = JSON.parse(JSON.stringify(body));
        console.log(info);
        
        method(error, response, body, res);
        /*console.log("Got answer from AccountServer");
        res.end("THX for register");*/
    }
    else {
        console.log('Error happened: '+ error);
    }
}

function RegisterUserHandler( error, response, body, res) {
	console.log("Got answer from AccountServer");
        res.end("THX for register");

	/*if (!error) {
    	console.log(body);

        var info = JSON.parse(JSON.stringify(body));
        console.log(info);

        console.log("Got answer from AccountServer");
        res.end("THX for register");
    }
    else {
        console.log('Error happened: '+ error);
    }*/
}
//function

function Magic(res, method){
	return function (error, response, body) {
		    universalAnswer(error, response, body, res, method );
		};
}

function RegisterUser( data, res){
	//console.log("Port=" + queryProcessor.getPort('AccountServer'));
	//console.log("FrontendServer tries to register user");

	sender.sendRequest("Register", user1, '127.0.0.1', queryProcessor.getPort('AccountServer'),  
		Magic(res, RegisterUserHandler )
		/*function (error, response, body) {
		    universalAnswer(error, response, body, res, RegisterUserHandler );
		}*/
	);
	/*	function (res1) {
			console.log("Got answer from AccountServer");
		    res1.setEncoding('utf8');
		    res1.on('data', function (chunk) {
				console.log("body: " + chunk);
				///analyse and return answer to client-bot
				console.log("Checking Data taking: " + data['password']);
				res.end("THX for register");
		    });

		    //req.on('error', function(e) {
			//console.log('problem with request: ' + e.message);
			//});
		}
	);*/
}


server.SetServer(serverName, '127.0.0.1', funcArray);
