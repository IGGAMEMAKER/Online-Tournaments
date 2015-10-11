var forever = require('forever-monitor');
//var child = new (forever.Monitor)('Servers/QuestionServer.js');
//var child = new (forever.Monitor)('thrower.js');
var servers = [];

var site = new (forever.Monitor)('site.js'); 
var DB =  new (forever.Monitor)('DBServer.js');
var FS =  new (forever.Monitor)('FrontendServer.js');
var BS =  new (forever.Monitor)('BalanceServer.js');
var TS =  new (forever.Monitor)('TournamentServer.js');
var GFS =  new (forever.Monitor)('GameFrontendServer.js');
var MS =  new (forever.Monitor)('MoneyServer.js');
var PP =  new (forever.Monitor)('PingPongServer.js');
var QS =  new (forever.Monitor)('Servers/QuestionServer.js');

servers.push(site);
/*servers.push(DB);
servers.push(FS);
servers.push(BS);
servers.push(TS);
servers.push(GFS);
servers.push(MS);
servers.push(PP);
servers.push(QS);//*/
var time = 500;
for (var i=0; i< servers.length; ++i){
	//var child = {};
	//child = servers[i];
	tmrServer(servers[i], time*(i+1) );
	//setTimeout( function() { startServer(child); } ,	);

/*	var child = servers[i];

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

function tmrServer(child, time){
	setTimeout( function(){
		startServer(child);
	}, time);
}
function getSettings(app){
	var settings = {
		//
	    // Basic configuration options
	    //
	    'silent': true,            // Silences the output from stdout and stderr in the parent process
	    'uid': app,          // Custom uid for this forever process. (default: autogen)
	    //'pidFile': 'path/to/a.pid', // Path to put pid information for the process(es) started
	    'max': 10,                  // Sets the maximum number of times a given script should run
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
	    'watchIgnorePatterns': null, // Ignore patterns to use when watching files.
	    'watchDirectory': './',      // Top-level directory to watch from.

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
	    'logFile': 'Logs/mTlog.log', // Path to log output from forever process (when daemonized)
	    'outFile': 'Logs/mTout.log', // Path to log output from child stdout
	    'errFile': 'Logs/mTerr.log', // Path to log output from child stderr

	    //
	    // ### function parseCommand (command, args)
	    // #### @command {String} Command string to parse
	    // #### @args    {Array}  Additional default arguments
	    //
	    // Returns the `command` and the `args` parsed from
	    // any command. Use this to modify the default parsing
	    // done by 'forever-monitor' around spaces.
	    //
	    'parser': function (command, args) {
	      return {
	        command: command,
	        args:    args
	      };
	    }
	}
}

function startServer(child){
	//console.log(JSON.stringify(child));
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

	child.start(null, getSettings('site'));
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
