function getTournamentID(topic){
	setAsync('/Category/tournament/'+topic, null, function (msg){
		// $("#play").html(JSON.stringify(msg));
		var gamePort = msg.gamePort;
		var gameHost = msg.gameHost;
		var tournamentID = msg.tournamentID;

		// reconnect(tournamentID, gameHost, gamePort)
		var src = 'http://'+gameHost+':'+gamePort+'/Game?tournamentID='+tournamentID;
		if (tournamentID) {
			var reg_button = '<a onclick="join('+topic+')" class="btn btn-primary"> Играть </a>'
		}
		var iframe = '<div style="background:white" width="100%">'//style="height: 500;"
			iframe += '<iframe width="100%" height=600 frameborder=0 src="'+src+'"/>'
			iframe += ' </div>'
		$("#play").append(iframe);

	}, 'GET')
}
var room;

function reg(topic){
	setAsync('/Category/tournament/'+topic, null, function (msg){})
}

function drawFrame(msg){
	var gamePort = msg.gamePort;
	var gameHost = msg.gameHost;
	var tournamentID = msg.tournamentID;

	// reconnect(tournamentID, gameHost, gamePort)
	var src = 'http://'+gameHost+':'+gamePort+'/Game?tournamentID='+tournamentID;
	// if (tournamentID) {
	// 	var reg_button = '<a onclick="join('+topic+')" class="btn btn-primary"> Играть </a>'
	// }
	var iframe = '<div style="background:white" width="100%">'//style="height: 500;"
		iframe += '<iframe width="100%" height=600 frameborder=0 src="'+src+'" />'
		iframe += ' </div>'
	$("#play").html(iframe);
}

function connect(topic){
	room = io('/topic/'+topic)
	
	room.on('wakeUp', function (msg){
		console.log('wakeUp', msg)
		drawFrame(msg)
	})

	room.on('online', function (msg){
		console.log('online', msg)
		reg(topic);
	})
}

function join(topic){

}

function reconnect(tournamentID, gameHost, gamePort){
	con = 'http://' + gameHost+':' + gamePort + '/'+tournamentID;

	console.log(con)
	room = io.connect(con);
}