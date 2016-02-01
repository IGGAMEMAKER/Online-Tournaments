var Promise = require('bluebird');

var configs = require('../configs');
var models = require('../models')(configs.db);
var Game = models.Game;

var OBJ_EXITS = 11000;

module.exports = {
	add: function(gameName, gameNameID, options){
		//addGame('Battle', 3, {port:5011, maxPlayersPerGame:2} );

		var minPlayersPerGame = options.minPlayersPerGame||2;
		var maxPlayersPerGame = options.maxPlayersPerGame||10;
		var frontendServerPort = options.port;
		var frontendServerIP = '127.0.0.1';
		var token = 'tkn';

		var game = new Game({
			gameName:gameName, gameNameID:gameNameID,
			minPlayersPerGame:minPlayersPerGame, maxPlayersPerGame:maxPlayersPerGame, 
			frontendServerIP:frontendServerIP, frontendServerPort: frontendServerPort,
			token: token
		})

		game.save(function (err) {
			if (err){
				switch (err.code){
					case OBJ_EXITS:
						Log('Sorry, game ' + gameName + ' Exists');
						// Answer(res, {result: 'OBJ_EXITS'});
					break;
					default:
						Error(err);
					break;
				}
			}
			else{
				// Answer(res, {result: 'OK'});
				//Log('added Game'); 
			}
		});
	},

}