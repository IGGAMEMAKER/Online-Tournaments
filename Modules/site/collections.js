module.exports = function setApp(app, AsyncRender, Answer, sender, Log, proxy, aux){
	var Gifts = require('../../models/gifts')
	var Collections = require('../../models/collections')
	var Packs = require('../../models/packs')

	var middlewares = require('../../middlewares')

  // collections

	app.get('/api/collections/clear/:id', aux.isAdmin, function (req, res, next){
		var id = req.params.id;

		Collections.clear(id) // list, name, reward

		.then(aux.setData(req, next))
		.catch(next)
	}, aux.std);

	app.get('/api/collections/add/:name', aux.isAdmin, function (req, res, next){
		var name = req.params.name;

		Collections.add([], name, {}) // list, name, reward

		.then(aux.setData(req, next))
		.catch(next)
	}, aux.std);

	app.get('/api/collections/copy/:from/:to', aux.isAdmin, function (req, res, next){
		var from = req.params.from;
		var to = req.params.to;

		Collections.copy(from, to)

		.then(aux.setData(req, next))
		.catch(next)
	}, aux.std);

	app.get('/api/collections/setColour/:id/:colour', aux.isAdmin, function (req, res, next){
		var colour = parseInt(req.params.colour);
		var id = req.params.id;

			Collections.setColour(id, colour)

		.then(aux.setData(req, next))
		.catch(next)
	}, aux.std);

	app.get('/api/collections/get/:collectionID', aux.isAdmin, function (req, res, next){
		var collectionID = req.params.collectionID;

		Collections.getByID(collectionID)

		.then(aux.result(req, next))
		.catch(next);
	}, aux.std)

	app.get('/api/collections/all', aux.isAdmin, function (req, res, next){
		Collections.all({})

		.then(aux.result(req, next))
		.catch(next);
	}, aux.std)

	app.get('/api/collections/attach/:collectionID/:giftID', aux.isAdmin, function (req, res, next){
		var collectionID = req.params.collectionID;
		var giftID = req.params.giftID;

		Collections.attachGift(collectionID, giftID)

		.then(aux.result(req, next))
		.catch(next);
	}, aux.std)


 }