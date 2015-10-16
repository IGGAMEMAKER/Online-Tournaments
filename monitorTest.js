var forever = require('forever');
var rqSender = require('./requestSender');
var sendRequest = rqSender.sendRequest;
//var child = new (forever.Monitor)('Servers/QuestionServer');
//var child = new (forever.Monitor)('thrower');
var serverNames = [];

var site = 'site'; 
var Log = 'LogServer'
var DB =  'DBServer';
var FS =  'FrontendServer';
var BS =  'BalanceServer';
var TS =  'TournamentServer';
var GFS = 'GameFrontendServer';
var MS =  'MoneyServer';
var PP =  'Servers/PingPongServer';
var QS =  'Servers/QuestionServer';

//serverNames.push(Log);
//serverNames.push(site);
//serverNames.push('thrower');
serverNames.push(DB);
serverNames.push(FS);
serverNames.push(BS);
serverNames.push(TS);
serverNames.push(GFS);
serverNames.push(MS);
serverNames.push(PP);
serverNames.push(QS);//*/

var time = 500;
for (var i=0; i< serverNames.length; ++i){
	//var child = {};
	//child = serverNames[i];
	tmrServer(serverNames[i], time*(i+1) );
	//setTimeout( function() { startServer(child); } ,	);

/*	var child = serverNames[i];

	child.on('watch:restart', function(info) {
		console.error('Restaring script because ' + info.file + ' changed');
	});

	child.on('error', function(err){
		console.error(err);
	});

	child.on('restart', function() {
	    console.error('Forever restarting script for ' + child.times + ' time');
	});

	child.on('exit:code', function(code) {
		console.error('Forever detected script exited with code ' + code);
	});

	child.start();*/
}


function tmrServer(servName, time){
	setTimeout( function(){
		var child = new (forever.Monitor)(servName+'.js', getSettings(servName));
		startServer(child, servName);
	}, time);
}
function getSettings(app){
	var silent = true;
	var appPath = app.replace('/', '_');
	if (app=='site') silent= false;
	var settings = {
		//
	    // Basic configuration options
	    //
	    'silent': silent,            // Silences the output from stdout and stderr in the parent process
	    'uid': app,          // Custom uid for this forever process. (default: autogen)
	    //'pidFile': 'path/to/a.pid', // Path to put pid information for the process(es) started
	    'max': 3,                  // Sets the maximum number of times a given script should run
	    'killTree': true,           // Kills the entire child process tree on `exit`

	    //
	    // These options control how quickly forever restarts a child process
	    // as well as when to kill a "spinning" process
	    //
	    'minUptime': 2000,     // Minimum time a child process has to be up. Forever will 'exit' otherwise.
	    'spinSleepTime': 1000, // Interval between restarts if a child is spinning (i.e. alive < minUptime).

	    //
	    // Command to spawn as well as options and other vars
	    // (env, cwd, etc) to pass along
	    //
	    //'command': 'perl',         // Binary to run (default: 'node')
	    //'args':    ['foo','bar'],  // Additional arguments to pass to the script,
	    //'sourceDir': 'script/path',// Directory that the source script is in

	    //
	    // Options for restarting on watched files.
	    //
	    'watch': true,               // Value indicating if we should watch files.
	    'watchIgnoreDotFiles': null, // Whether to ignore file starting with a '.'
	    //'watchIgnorePatterns': null, // Ignore patterns to use when watching files.
	    'watchIgnorePatterns': [ 'log/*', 'node_modules/*', 'pids/*',
                              'dbscripts/*', 'test/*',
                              'curlcookies', 'Logs/*', 'frontent/*',
                              '.svn/*' ],
	    //'watchDirectory': './',      // Top-level directory to watch from. ///home/gaginho/project/NODE/
	    'watchDirectory': __dirname,

	    //
	    // All or nothing options passed along to `child_process.spawn`.
	    //
	    
	    /*'spawnWith': {
	      customFds: [-1, -1, -1], // that forever spawns.
	      setsid: false,
	      uid: 0, // Custom UID
	      gid: 0  // Custom GID
	    },*/


	    //
	    // More specific options to pass along to `child_process.spawn` which
	    // will override anything passed to the `spawnWith` option
	    //
	    //'env': { 'ADDITIONAL': 'CHILD ENV VARS' },
	    //'cwd': '/path/to/child/working/directory',

	    //
	    // Log files and associated logging options for this instance
	    //

	    'logFile': 'Logs/'+appPath+'_log.log', // Path to log output from forever process (when daemonized)
	    'outFile': 'Logs/'+appPath+'_out.log', // Path to log output from child stdout
	    'errFile': 'Logs/'+appPath+'_err.log', // Path to log output from child stderr

	    //
	    // ### function parseCommand (command, args)
	    // #### @command {String} Command string to parse
	    // #### @args    {Array}  Additional default arguments
	    //
	    // Returns the `command` and the `args` parsed from
	    // any command. Use this to modify the default parsing
	    // done by 'forever-monitor' around spaces.
	    //
	    /*'parser': function (command, args) {
	      return {
	        command: command,
	        args:    args
	      };
	    }*/
	}
	return settings;
}

function startServer(child, servName){
	//console.log(JSON.stringify(child));
	var msg;
	child.on('start', function() {

	    SendInfo('Forever starting ' + servName + ' for ' + child.times + ' time','Start');
	})
	child.on('watch:restart', function (info) {
		CodeChange('Restaring ' + servName + ' because ' + info.file + ' changed');
	});

	child.on('error', function (err){
		SendError('Error in ' + servName + ' ' + JSON.stringify(err), 'Err');
	});


	child.on('restart', function() {
	    SendInfo('Forever restarting ' + servName + ' for ' + child.times + ' time', 'Err');
	});
	/*child.on('exit', function (code) {
		SendInfo('Forever detected, that ' + servName + ' exited with code ' + code, 'Err');
	});*/
	child.on('exit:code', function (code) {
		SendInfo('Forever detected, that ' + servName + ' exited with code ' + code, 'Err');
	});

	//child.on('*', function
	//forever.startDaemon(child);
	child.start();//null, getSettings('site'));
	//child.stop();
}

function CodeChange(msg, topic){
	//console.log('CodeChange ' + msg);
	sendRequest('Log', {msg: msg, topic: topic?topic:'Forever'} , '127.0.0.1', 'site', null, null);
}

function SendInfo(msg, topic){
	console.log('Send info! ' + msg);
	//console.error('Send info! ' + msg);
	sendRequest('Log', {msg: msg, topic: topic?topic:'Forever'} , '127.0.0.1', 'site', null, null);//LogServer
}

function SendError(msg, topic){
	console.error('Send Error ' + msg);
	sendRequest('Log', {msg: msg, topic: topic?topic:'Forever'} , '127.0.0.1', 'site', null, null);//LogServer
}

/*child.on('watch:restart', function(info) {
    console.error('Restaring script because ' + info.file + ' changed');
});

child.on('error', function(err){
	console.error(err);
});

child.on('restart', function() {
    console.error('Forever restarting script for ' + child.times + ' time');
});

child.on('exit:code', function(code) {
    console.error('Forever detected script exited with code ' + code);
});*/


//child.start();
