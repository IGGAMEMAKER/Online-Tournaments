module.exports = function(app, aux, realtime, SOCKET, io){
	var Tournaments = require('../models/tournaments');
	var TournamentRegs = require('../models/tregs');
	var Category = require('../models/category');

	var request = require('request');
	var requestSender = require('../requestSender');
	var logger = console.log;

	var list = ['default', 'realmadrid'];

	var register_manager = require('../chains/registerInTournament');

/*
	var multer  = require('multer')

	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
			var filename = req.body.filename;
			logger('needs regexp here!!')

			cb(null, './frontend/public/img/topics/' + filename);
		},
		filename: function (req, file, cb) {
			// var tournamentID = req.body.tournamentID;
			// console.log('in storage tournamentID', tournamentID);
			console.log(file);
			if (tournamentID) { 
			  cb(null, tournamentID + '.txt');// + file.extension) 
			} else {
			  cb(null, 'qst-'+ Date.now() + '.txt');
			}
		}
	})
  
  var upload = multer({ storage: storage }).single('questions');

	app.post('/api/categories/addImage/:filename', function (req, res){
		var data = req.body;
		var tournamentID = req.body.tournamentID;

		// trying to add image
		console.log('adding questions', tournamentID);
		upload(req, res, function (err){
		  if (err) { console.log(err); res.render('AddQuestions'); return; }
		  
		  console.log('added questions', tournamentID);
		  if (tournamentID && !isNaN(tournamentID)) {
		    res.redirect('StartSpecial/'+tournamentID);
		  } else {
		    res.end('added questions');
		  }
		})
	})
*/


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
	};

	var onliners = {}
	var tournaments = {}
	var rooms = {};

	var configs = require('../configs');
	var gameHost = configs.gameHost;
	// var gameHost = configs.gameHost;

	for (var i = list.length - 1; i >= 0; i--) {
		var topic = list[i];
		onliners[topic] = {};
		resetTopic(topic);
		// tournaments[topic] = 0;

		setRoom(topic);
	}

	getCategories();
	// setInterval(getCategories, 3000);

	function getTournaments(topic){

		return Tournaments.getByTopic(topic)
		.then(function (lst){
			var tournamentID = 0;
			var current = {};

			if (tournaments[topic]) {
				tournamentID = tournaments[topic].tournamentID;
			}

			if (lst.length>0){
				current = lst[0]; // take newest stream tournament
				if (current.tournamentID > tournamentID){
					// it means that we have newer tournament
					clearOnliners(topic);
					tournaments[topic] = current;
					emit(topic, 'online', {})
				}
			}

			return lst;
			// console.log('was', tournamentID, 'now', current.tournamentID)
		})

		// setTimeout(function (){
		// 	getTournaments(topic);
		// }, 5000)
	}

/*	
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
*/

	function getCategories(){
		var cats = realtime().categories;
		// console.log('getCategories', cats);
		list = []
		for (var i = cats.length - 1; i >= 0; i--) {
			var category = cats[i];
			var name = category.name,
			draw = category.draw,
			level = category.level;

			categories[name] = category;
			list.push(name);
			if (!rooms[name]) setRoom(name);
			if (!onliners[name]) onliners[name] = {}

			getTournaments(name);

			// emit(name, 'whoisonline')
		}

		setTimeout(getCategories, 5000)
	}

	function get_tournament(topic){
		return tournaments[topic].tournamentID || 0;
	}

	function users_are_online(topic) {
		return get_players(topic).length > 0;
	}

	function resetTopic(topic, tournamentID){
		if (tournamentID) {
			tournaments[topic] = {tournamentID: tournamentID}
		} else {
			tournaments[topic] = 0;
		}
	}

	function clearOnliners(topic){
		onliners[topic] = {};
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
		
		// var login = aux.getLogin(req);
		var login = req.login;
		if (login) onliners[topic][login] = login;

		res.render('Category', categories[topic])
	})

	app.post('/Category/whoisonline/:topic', aux.isAuthenticated, function (req, res){
		var topic = req.params.topic;
		if (!categories[topic]) topic = 'default'; // { category: topic }
		
		// var login = aux.getLogin(req);
		var login = req.login;
		if (login) onliners[topic][login] = login;
		res.end('')
	})

	app.post('/Category/register/:topic', aux.isAuthenticated, function (req, res, next){
		var topic = req.params.topic;
		// var login = aux.getLogin(req);
		var login = req.login;

		console.log('category/register', topic, login)

		var tournamentID = get_tournament(topic);

		if (tournamentID > 0){ // && !onliners[topic][login]
			// var players = get_players(topic)
			register_manager.register(tournamentID, login, res)
		} else {
			res.end('No')
		}
		
		onliners[topic][login] = login;
		sendOnliners(topic);

		// res.json({ gameHost:gameHost, gamePort: 5010, tournamentID: tournamentID })

		
		if (tournamentID>0){
			setTimeout(function (){
				wakeUp(topic, login, tournamentID, gameHost, 5010)
			}, 3000)
		}

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
		clearOnliners(topic);
		
		resetTopic(topic);
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


	// app.get('/api/categories/enable/:name', aux.isAdmin, function (req, res, next){
	// 	Tournaments.getByTopic
	// })

	app.get('/api/categories/new/:name/:draw_name/:level', aux.isAdmin, function (req, res, next){
		var name = req.params.name;
		var draw_name = req.params.draw_name;
		var level = parseInt(req.params.level);

		// var tournament = {
		// 	'settings.topic': name
		// }

		// topic, isNew
		// requestSender.sendRequest('/addQuestion', )
		Tournaments.addTopicStreamTournament(name, true)

		Category.add(name, draw_name, level)
		.then(aux.setData(req, next))
		.catch(aux.errored)
	}, aux.std)
}
