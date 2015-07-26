var http = require('http');
var url = require('url');
var queryProcessor = require('./test');
//var sender = require('./requestSender');

var sys = require('sys')
var exec = require('child_process').exec;
this.SetServer = SetServer;

var qs = require('querystring');

var server = new http.Server();
//var serverName = "FrontendServer";
//log(queryProcessor.getOwnPropertyNames());
//exec("exit");

/*var spawn = require('child_process').spawn,
    grep  = spawn('grep', ['ssh']);

grep.on('close', function (code, signal) {
  log('child process terminated due to receipt of signal '+signal);
});

// send SIGHUP to process
grep.kill('SIGHUP');*/


var cars = ["Saab", "Volvo", "BMW"]; cars.push("LADADADADADA");

function PrintConsoleParameters(){
	process.argv.forEach(function (val, index, array) {
  		console.log(index + ': ' + val);
	});
}

function SetServer(serverName, serverUrl, functionArray) {
	//PrintConsoleParameters();
	var port = queryProcessor.getPort(serverName);
	log("Starting " + serverName + " on port " + port);
	
	//log(queryProcessor.area(5));
	server.listen(port, serverUrl);//'127.0.0.1'
	funcArray = functionArray;
	server.on('request', function (req,res) {
		log("------------------------");
		//////res.write(JSON.stringify({ a: 1 }));

		var urlParsed = url.parse(req.url);
		log(urlParsed.query);

		var command = urlParsed.pathname;
		var body = '';
	        req.on('data', function (data) {
	            body += data;
	            log("incoming data: " + data + " \n");
	            // Too much POST data, kill the connection!
	            if (body.length > 1e6){
	                req.connection.destroy();
	            }
	        });
	        req.on('end', function () {
	            var post = qs.parse(body);
	            log(post);
	            log("stringifying:" + JSON.stringify(post));
	            /*log("Url= " + command);
	            log("Key =" + post['login']);
	            log("Key =" + post['job']);*/
	            
	            Respond(command, post, res);
	            //KillServer();
	        });
	});
}
function KillServer(){
	server.close();
	//exec("killall node");
	function puts(error, stdout, stderr) { sys.puts(stdout) }
	exec("killall gnome-terminal", puts);
	//exec("killall node", puts);
	//server.stop();
	log("Stoping Server");
	/*exec("exit");*/
}
function TryToStopServer (data, res){
	log("Checking Sender.... Sender is valid! (TODO FIX IT!!! do a proper Checking) ");
	AnswerAndKill(data, res);
}
function AnswerAndKill(data, res) {
	res.end("Finish");
	KillServer();
}
var funcArray = {};

//funcArray[1] = {'/register' : RegisterUser};
//550999 

function log(data){
	console.log(data);
}

function Respond(command, data, res){///res=response
	res.setHeader('Content-Type', 'application/json');
	//res.write(JSON.stringify(cars));
	if (command == '/stop') { TryToStopServer(data, res); }
	else{
		try{
			log("Trying to execute: " + command);
			funcArray[command](data,res);
		}
		catch(error){
			log("funcArray execution Exception: " + error);
			res.end("Chiao");
		}
	}
}
