module.exports = function(app, aux, realtime, SOCKET, io){
	var Teams = require('../models/teams');
	var Users = require('../models/users');

	var requestSender = require('../requestSender')
	var logger = console.log;

	var configs = require('../configs');

	// api calls
	var getLogin = aux.getLogin;
	app.get('/Team', aux.authenticated, function(req, res) {
		res.render('Team');
	})

	app.post('/Team', aux.authenticated, function(req, res) { // create team
		var team = req.body;
		var login = getLogin(req);
		if (!team || !team.name) return res.render('Team');

		var createTeam = function (profile){
			if (profile.team) throw 'joined_already';

			return Team.add(team, login)
			.then(function (result){
				return Users.joinTeam(login, team);
			})
		}

		Users.profile(getLogin(req)) // check, if he joined team already
		.then(createTeam)
		.then(function (result){
			logger(result, '/Team POST', login);
			res.render('Team');
		})
		.catch(function (err){
			logger(err, '/Team POST', login);
			res.render('Team');
		})
	})
	const TEAM_JOINED_TRUE = 1;
	const TEAM_JOINED_FALSE = 2;
	const TEAM_JOINED_ERR = 3;
	app.get('/api/teams/', aux.authenticated, function(req, res) {
		var login = getLogin(req);
		Users.profile(login)
		.then(function (profile){
			var team = profile.team;
			logger('/api/teams/', login, profile);
			if (!team) throw 'no_team';

			return Teams.get(team)
		})
		.then(function (team){
			res.json({ joined: true, team: team });
		})
		.catch(function (err){
			logger('errored', err, '/api/teams/', login);
			if ()
			res.json({ joined: false, error:err, team: null })
		})
		// var team = {
		// 	name: 'КрутыеКексы',
		// 	players: [
		// 		{ name: 'Гага' },
		// 		{ name: 'Гага1' },
		// 		{ name: 'Гага2' },
		// 	],
		// 	captain: 'Гага',
		// 	money: 100,
		// 	settings: {},
		// }
		// res.json({ joined: true, team: team });
	})

	// app.post('/api/teams/all', aux.isAdmin, function (req, res, next){
	// 	// var id = req.params.id;

	// 	// var name = req.body.name;
	// 	// var value = req.body.value;

	// 	// var obj = {};
	// 	// obj[name] = value;

	// 	Category.edit(id, obj)
	// 	.then(aux.setData(req, next))
	// 	.catch(aux.errored)
	// }, aux.std)

	// app.get('/api/categories/all/raw', aux.isAdmin, function (req, res, next){
	// 	Category.all()
	// 	.then(aux.setData(req, next))
	// 	.catch(aux.errored)
	// }, aux.render('admin/Categories'), aux.err)
}
