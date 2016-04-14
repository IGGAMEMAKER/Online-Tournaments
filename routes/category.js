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
	}, 5000)

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
	}

	function emit(topic, tag, message){
		rooms[topic].socketRoom.emit(tag, message)
	}

	function wakeUp(topic, login, tournamentID, gameHost, gamePort){
		var obj = { login:login, tournamentID:tournamentID, gameHost:gameHost, gamePort:gamePort };
		emit(topic, 'wakeUp', obj)
	}

	app.post('/Category/tournament/:topic', aux.isAuthenticated, function (req, res, next){
		var topic = req.params.topic;
		var login = aux.getLogin(req);
		onliners[topic][login] = login;

		var tournamentID = tournaments[topic].tournamentID;
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

		onliners[topic] = {};
		emit(topic, 'online', {})

		setTimeout(function (){ sendOnliners(topic) }, 3000)
	})

	app.get('/Category/:topic', function (req, res, next){
		var topic = req.params.topic;
		if (!categories[topic]) topic = 'default'; // { category: topic }
		
		var login = aux.getLogin(req);
		if (login) onliners[topic][login] = login;

		res.render('Category', categories[topic])
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
	}, aux.render('Categories'), aux.err)

	app.get('/api/categories/add/:name/:draw_name/:level', aux.isAdmin, function (req, res, next){
		var name = req.params.name;
		var draw_name = req.params.draw_name;
		var level = parseInt(req.params.level);

		Category.add(name, draw_name, level)
		.then(aux.setData(req, next))
		.catch(aux.errored)
	}, aux.std)
}
