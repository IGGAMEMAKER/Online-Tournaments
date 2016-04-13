module.exports = function(app, aux, realtime, SOCKET, io){
	var Tournaments = require('../models/tournaments');
	var TournamentRegs = require('../models/tregs');

	var request = require('request')
	var requestSender = require('../requestSender')
	var logger = console.log;
	var list = ['default', 'realmadrid'];

	var register_manager = require('../chains/registerInTournament')(aux)

	var categories = {
		'default' : createCategory('default', 'Всё обо всём', "Всему подряд"),
		'realmadrid' : createCategory('realmadrid', "Реал Мадрид", "Мадридскому Реалу")
	}

	var onliners = {}
	var tournaments = {}
	var rooms = {};

	var configs = require('../configs');
	var gameHost = configs.gameHost;
	// var gameHost = configs.gameHost;

	for (var i = list.length - 1; i >= 0; i--) {
		var topic = list[i];
		onliners[topic] = {};
		tournaments[topic] = 0;

		updateTopic(topic);
		setRoom(topic);
	};

	setInterval(function (){
		for (var i = 0; i < list.length; i++) {
			updateTopic(list[i])
		};
	}, 10000)

	function updateTopic(topic){
		Tournaments.getByTopic(topic)
		.then(function (tournament){
			// logger(topic, tournament)
			if (!tournament) {
				tournaments[topic] = 0;
				return;
			}
			tournaments[topic] = tournament;
		})
		.catch(function (error){
			tournaments[topic] = 0;
		})
	}

	// setTimeout(getCategories, 4000);


	function createCategory(name, ru_name, name_dat){
		return {
			name: name,
			draw: createDrawObject(ru_name,name_dat)
		}
	}
	function createDrawObject(name, name_dat){
		var obj = { name: name, addQuesion: "на любую тему", name_dat:name_dat };
		return obj;
	}

	function getCategories(){
		var cats = realtime().categories;
		console.log(cats);
		for (var i = cats.length - 1; i >= 0; i--) {
			var category = cats[i];
			var name = category.name,
			draw = category.draw,
			level = category.level;

			categories[name] = category;
		};
	}

	function setRoom(topic) {

		rooms[topic] = {};
		rooms[topic].socketRoom = io.of('/topic/'+topic);

		rooms[topic].socketRoom.on('connection', function (socket){
			logger('Room <' + topic + '> got new player');
			sendOnliners(topic);

			socket.on('movement', function (data){
				logger('movement', data)
			});
		});

		// roomWorker(topic, 5000)
		// rooms[topic].socketRoom.emit('startGame', { ticks : 10 });
	}
	function emit(topic, tag, message){
		rooms[topic].socketRoom.emit(tag, message)
	}

	function wakeUp(topic, login, tournamentID, gameHost, gamePort){
		var obj = { login:login, tournamentID:tournamentID, gameHost:gameHost, gamePort:gamePort };
		emit(topic, 'wakeUp', obj)
	}

	function roomWorker(topic, period){
		var tournamentID = tournaments[topic].tournamentID;
		console.log('roomWorker', topic, period, onliners)
		// var login = '23i03g';
		// wakeUp(topic, login, tournamentID, gameHost, 5010)

		if (tournamentID > 0) {
			var players = Object.keys(onliners[topic]);
			for (var i = 0; i < players.length; i++) {
				var login = players[i];
				console.log(login, players)

				// register_manager.joinStream(tournamentID, login)
				register_manager.reg(tournamentID, login)
				.catch(function (err){
					logger('roomWorker err', err)
					register_manager.clearQueue(tournamentID, login)
				})
				.then(function (tournament){
					logger(tournament, login);
					register_manager.join(tournamentID, login)

					register_manager.needsStart(tournamentID)
					
					setTimeout(function (){
						wakeUp(topic, login, tournamentID, gameHost, 5010)
					}, 3000)
				})
			}
		}
		
		// setTimeout(function () { roomWorker(topic, period) }, period)
	}

	function registerAndWakeUp(topic, login, tournamentID){

	}



	function worker(topic, period){
		var tournamentID = tournaments[topic].tournamentID;
		console.log('roomWorker', topic, period, onliners)

		if (tournamentID > 0) {
			var players = Object.keys(onliners[topic]);
			for (var i = 0; i < players.length; i++) {
				var login = players[i];
				console.log(login, players)

				// register_manager.joinStream(tournamentID, login)
				register_manager.register(tournamentID, login)
				.catch(function (err){
					logger('roomWorker err', err)
					register_manager.clearQueue(tournamentID, login)
				})
				.then(function (tournament){
					logger(tournament, login);
					register_manager.join(tournamentID, login)

					register_manager.needsStart(tournamentID)
					
					setTimeout(function (){
						wakeUp(topic, login, tournamentID, gameHost, 5010)
					}, 3000)
				})
			}
		}
		
		// setTimeout(function () { roomWorker(topic, period) }, period)

	}

	app.post('/Category/tournament/:topic', aux.isAuthenticated, function (req, res, next){
		var topic = req.params.topic;
		var login = aux.getLogin(req);

		var tournamentID = tournaments[topic].tournamentID;
		// register_manager.register(tournamentID, login)

		onliners[topic][login] = login;

		// res.json({ gameHost:gameHost, gamePort: 5010, tournamentID: tournamentID })

		register_manager.register(tournamentID, login, res)
		
		if (tournamentID>0){
			setTimeout(function (){
				wakeUp(topic, login, tournamentID, gameHost, 5010)
			}, 3000)
		}
	})

	function sendOnliners(topic){
		var players = Object.keys(onliners[topic]);
		emit(topic, 'onliners', players)
	}

	app.post('/FinishCategoryTournament/:topic', function (req, res, next){
		res.end('');
		var topic = req.params.topic;
		// logger('FinishCategoryTournament', topic, tournamentID)

		// var tournamentID = tournaments[topic].tournamentID;
		var t = req.body;
		var tournamentID = t.tournamentID;

		tournaments[topic].tournamentID = tournamentID;
		// var tournament = req.body;

		// var isStream = !tournament || !tournament.settings || !tournament.settings.regularity)
		// var topic = req.params.topic;

		onliners[topic] = {};
		emit(topic, 'online', {})

		setTimeout(function (){
			sendOnliners(topic)
			// var players = Object.keys(onliners[topic]);
			// emit(topic, 'onliners', players)
		}, 3000)

		// setTimeout(function (){
		// 	var players = Object.keys(onliners[topic]);
		// 	console.log(players);
		// 	for (var i=0; i < players.length; i++){
		// 		var login = players[i];

		// 		register_manager.register(tournamentID, login);
		// 	}
		// }, 3000)
	})

	app.get('/Category/:topic', function (req, res, next){
		var topic = req.params.topic;
		if (!categories[topic]) topic = 'default'; // { category: topic }
		
		var login = aux.getLogin(req);
		if (login) onliners[topic][login] = login;

		res.render('Category', categories[topic])
	})

	// app.get('/wakeUp/topic/:topic', function (req, res){

	// })
}