module.exports = function(app, aux, realtime, SOCKET, io){
	var Tournaments = require('../models/tournaments');
	var TournamentRegs = require('../models/tregs');
	var Category = require('../models/category');

	var request = require('request')
	var requestSender = require('../requestSender')
	var logger = console.log;
	var list = ['default', 'realmadrid'];

	var register_manager = require('../chains/registerInTournament')(aux)

	var categories = {
		// 'default' : createCategory('default', 'Всё обо всём', "Всему подряд"),
		// 'realmadrid' : createCategory('realmadrid', "Реал Мадрид", "Мадридскому Реалу")
		'default' : {
			name: 'default',
			draw: {
				name: "Всё обо всём", addQuesion: "на любую тему", name_dat: "Всему подряд"
			}
		},
		'realmadrid' : {
			name: 'realmadrid',
			draw: {
				name: "Реал Мадрид", addQuesion: "про Реал", name_dat: "Мадридскому Реалу"
			}
		}
		// createCategory('default', 'Всё обо всём', "Всему подряд"),
		// 'realmadrid' : createCategory('realmadrid', "Реал Мадрид", "Мадридскому Реалу")
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
		resetTopic(topic)
		// tournaments[topic] = 0;

		// runTournaments(topic)
		setRoom(topic);
	};

	getCategories();
	// setInterval(getCategories, 3000);


	function createCategory(name, ru_name, name_dat){
		return {
			name: name,
			draw: createDrawObject(ru_name, name_dat)
		}
	}
	function createDrawObject(name, name_dat){
		var obj = { name: name, addQuesion: "на любую тему", name_dat:name_dat };
		return obj;
	}

	function getCategories(){
		var cats = realtime().categories;
		// console.log('getCategories', cats);
		for (var i = cats.length - 1; i >= 0; i--) {
			var category = cats[i];
			var name = category.name,
			draw = category.draw,
			level = category.level;

			categories[name] = category;

			runTournaments(name)
		};

		setTimeout(getCategories, 3000)
	}

	function get_tournament(topic){
		return tournaments[topic].tournamentID || 0;
	}

	function tournament_needs_to_be_created(topic){
		return tournaments[topic] == 0;
	}

	function tournament_is_in_queue(topic){
		return tournaments[topic].queue == 1;
	}

	function users_are_online(topic) {
		return get_players(topic).length>0;
	}

	function resetTopic(topic, tournamentID){
		if (tournamentID) {
			tournaments[topic] = {tournamentID: tournamentID}
		} else {
			tournaments[topic] = 0;
		}
	}

	function keepAlive(topic, tournamentID){
		setTimeout(function (){
			// console.log('keepAlive', topic, tournamentID)
			// if tournament will not finish, this will add new tournament it
			// Если пользователи есть, а турнир не обновился, то создаём новый турнир
			var id = get_tournament(topic);
			var are_online = users_are_online(topic);
			// console.log('id, are_online', id, are_online)
			if (id == tournamentID && are_online){
				// console.log('runTournaments')
				resetTopic(topic);
				runTournaments(topic)
			} else {
				// console.log('keepAlive continue')
				keepAlive(topic, tournamentID)
			}
		}, 120*1000)
		// }, 40*1000)
	}

	function runTournaments(topic){
		var needToCreate = tournament_needs_to_be_created(topic);
		var is_not_in_que = !tournament_is_in_queue(topic);
		// logger('runTournaments', topic, 'needToCreate', needToCreate, is_not_in_que)
		
		if (needToCreate && is_not_in_que){
			tournaments[topic] = { queue: 1 };
			return Tournaments.addTopicStreamTournament(topic)
			.then(function (tournament){
				console.log(tournament);

				var tournamentID = tournament.tournamentID;
				tournaments[topic] = tournament;

				// wakeForReg(topic)
				emit(topic, 'online', {}) // force players to start registering

				keepAlive(topic, tournamentID);
			})
		}
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
	}

	function emit(topic, tag, message){
		rooms[topic].socketRoom.emit(tag, message)
	}

	function wakeUp(topic, login, tournamentID, gameHost, gamePort){
		var obj = { login:login, tournamentID:tournamentID, gameHost:gameHost, gamePort:gamePort };
		emit(topic, 'wakeUp', obj)
	}

	app.get('/Category/:topic', function (req, res, next){
		var topic = req.params.topic;
		if (!categories[topic]) topic = 'default'; // { category: topic }
		
		var login = aux.getLogin(req);
		if (login) onliners[topic][login] = login;

		runTournaments(topic)

		res.render('Category', categories[topic])
	})

	app.get('/regTo/:login/:tournamentID', aux.isAdmin, function (req, res){
		var login = req.params.login;
		var tournamentID = parseInt(req.params.tournamentID);

		logger('regTo', login, tournamentID);

		register_manager.reg(tournamentID, login)
		.then(function (result){
			logger('regTo', login, tournamentID);
			res.end(result);
		})
		.catch(function (err){
			res.json({err: err})
		})
	})

	app.post('/Category/register/:topic', aux.isAuthenticated, function (req, res, next){
		var topic = req.params.topic;
		var login = aux.getLogin(req);

		onliners[topic][login] = login;

		var tournamentID = get_tournament(topic);

		// res.json({ gameHost:gameHost, gamePort: 5010, tournamentID: tournamentID })

		register_manager.register(tournamentID, login, res)
		
		// if (tournamentID>0){
			setTimeout(function (){
				wakeUp(topic, login, tournamentID, gameHost, 5010)
			}, 3000)
		// }

	})

	// app.get('/Category/set/:topic/:tournamentID', aux.isAdmin, function (req, res, next){
	// 	var topic = req.params.topic;
	// 	var tournamentID = parseInt(req.params.tournamentID);

	// 	// Tournaments.
	// })

	function get_players(topic){
		return Object.keys(onliners[topic]);
	}

	function sendOnliners(topic){
		var players = get_players(topic);
		emit(topic, 'onliners', players)
	}

	app.post('/FinishCategoryTournament/:topic', function (req, res, next){
		res.end('');
		var topic = req.params.topic;
		// // logger('FinishCategoryTournament', topic, tournamentID)

		// // var tournamentID = tournaments[topic].tournamentID;
		// var t = req.body;
		// var tournamentID = t.tournamentID;

		// tournaments[topic].tournamentID = tournamentID;
		console.log('FinishCategoryTournament', topic)
		onliners[topic] = {};
		
		resetTopic(topic);
		runTournaments(topic)

		// emit(topic, 'online', {})

		// setTimeout(function (){ sendOnliners(topic) }, 3000)


	})

	app.get('/Categories', function (req, res){
		res.render('Categories', {msg: realtime().categories})
	})

	// api calls

	app.get('/api/categories/available', function (req, res, next){
		Category.available()
		.then(aux.setData(req, next))
		.catch(aux.errored)
	}, aux.std)

	app.get('/api/categories/activate/:id', aux.isAdmin, function (req, res, next){
		Category.activate(req.params.id)
		.then(aux.setData(req, next))
		.catch(aux.errored)
	}, aux.std)

	app.get('/api/categories/deactivate/:id', aux.isAdmin, function (req, res, next){
		Category.deactivate(req.params.id)
		.then(aux.setData(req, next))
		.catch(aux.errored)
	}, aux.std)

	app.post('/api/categories/edit/:id', aux.isAdmin, function (req, res, next){
		var id = req.params.id;

		var name = req.body.name;
		var value = req.body.value;

		var obj = {};
		obj[name] = value;

		Category.edit(id, obj)
		.then(aux.setData(req, next))
		.catch(aux.errored)
	}, aux.std)

	app.get('/api/categories/editDraw/:id/:parameter/:value', aux.isAdmin, function (req, res, next){
		var id = req.params.id;
		var parameter = req.params.parameter;
		var value = req.params.value;

		Category.editDraw(id, parameter, value)
		.then(aux.setData(req, next))
		.catch(aux.errored)
	}, aux.std)

	app.get('/api/categories/editSettings/:id/:parameter/:value', aux.isAdmin, function (req, res, next){
		var id = req.params.id;
		var parameter = req.params.parameter;
		var value = req.params.value;

		Category.editSettings(id, parameter, value)
		.then(aux.setData(req, next))
		.catch(aux.errored)
	}, aux.std)

	// editDraw:editDraw,
	// editSettings:editSettings,

	app.get('/api/categories/all/raw', aux.isAdmin, function (req, res, next){
		Category.all()
		.then(aux.setData(req, next))
		.catch(aux.errored)
	}, aux.render('admin/Categories'), aux.err)

	app.get('/api/categories/add/:name/:draw_name/:level', aux.isAdmin, function (req, res, next){
		var name = req.params.name;
		var draw_name = req.params.draw_name;
		var level = parseInt(req.params.level);

		Category.add(name, draw_name, level)
		.then(aux.setData(req, next))
		.catch(aux.errored)
	}, aux.std)
}
