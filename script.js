var http = require('http');
var url = require('url');
var queryProcessor = require('./test');
var sender = require('./requestSender');

var sys = require('sys')
var exec = require('child_process').exec;


var qs = require('querystring');

var server = new http.Server();
var serverName = "FrontendServer";
//console.log(queryProcessor.getOwnPropertyNames());
//exec("exit");

/*var spawn = require('child_process').spawn,
    grep  = spawn('grep', ['ssh']);

grep.on('close', function (code, signal) {
  console.log('child process terminated due to receipt of signal '+signal);
});

// send SIGHUP to process
grep.kill('SIGHUP');*/

var user1 = qs.stringify({
      login: 'Dinesh',
      password: 'Kumar',
	job   : [ 'language', 'PHP' ]
    });

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

console.log("More changes");

var port = queryProcessor.getPort(serverName);
console.log("Port " + port);
console.log(queryProcessor.area(5));
server.listen(port, '127.0.0.1');
var cars = ["Saab", "Volvo", "BMW"]; cars.push("LADADADADADA");

server.on('request', function (req,res) {
	console.log("------------------------");
	//////res.write(JSON.stringify({ a: 1 }));

	var urlParsed = url.parse(req.url);
	console.log(urlParsed.query);

	var command = urlParsed.pathname;
	var body = '';
        req.on('data', function (data) {
            body += data;
            console.log("incoming data: " + data + " \n");
            // Too much POST data, kill the connection!
            if (body.length > 1e6){
                req.connection.destroy();
            }
        });
        req.on('end', function () {
            var post = qs.parse(body);
            console.log(post);
            console.log("stringifying:" + JSON.stringify(post));
            console.log("Url= " + command);
            console.log("Key =" + post['login']);
            console.log("Key =" + post['job']);
            
            Respond(command, post, res);
            //KillServer();

	
            // use post['blah'], etc.
        });
});

function KillServer(){
	server.close();
	//exec("killall node");
	function puts(error, stdout, stderr) { sys.puts(stdout) }
	exec("killall gnome-terminal", puts);
	//exec("killall node", puts);
	//server.stop();
	console.log("Stoping Server");
	/*exec("exit");*/
}
function Respond(command, data, res){///res=response
	res.setHeader('Content-Type', 'application/json');
	res.write(JSON.stringify(cars));
        switch(command){
        	case '/stop':
        		res.end("Finish");
        		KillServer();
        	break;
			case '/start':
				//sender.sendRequest("register", options, user1,   );
				console.log("Sending back" + JSON.stringify(post));

				//queryProcessor.start(res, JSON.stringify(post))
				//res.end("Hola");
			break;
			case '/register':
				console.log("Port=" + queryProcessor.getPort('AccountServer'));
				sender.sendRequest("register", user1, '127.0.0.1', queryProcessor.getPort('AccountServer'), 
					function (res1) {
					    res1.setEncoding('utf8');
					    res1.on('data', function (chunk) {
							console.log("body: " + chunk);
							///analyse and return answer to client-bot
							res.end("THX for register");
					    });

					    /*req.on('error', function(e) {
						console.log('problem with request: ' + e.message);
						});*/
					}
				);
			break;
			default:
				res.end("Chiao");
			break;
		}
}
