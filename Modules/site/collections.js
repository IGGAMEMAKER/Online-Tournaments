module.exports = function setApp(app, AsyncRender, Answer, sender, Log, proxy, aux){
	var Gifts = require('../../models/gifts')
	var Collections = require('../../models/collections')
	var Packs = require('../../models/packs')

	var middlewares = require('../../middlewares')

  // collections

	function findEqualities(sameColourCardsList, collection_list){
		// two variants:
		// 	collection.length is bigger than sameColourCardsList
		// 	or is less
		console.log('sameColourCardsList', sameColourCardsList, 'collection_list', collection_list);
		var havings = {};
		var have = 0;
		for (var i = sameColourCardsList.length - 1; i >= 0; i--) {
			var giftID = sameColourCardsList[i].giftID;
			console.log('check ', giftID)
			if (collection_list[giftID] == 1) {
				havings[giftID] = 1;
				// have++;
			}
		};
		console.log(Object.keys(havings));
		have = Object.keys(havings).length;
		
		// var need = Object.keys(collection_list)
		// if (have == collection_list.length){
			// return collection_list.length;
		// }
		// return 0;
		return have;
	}
	// ,CARD_COLOUR_RED:1
	// ,CARD_COLOUR_BLUE:2
	// ,CARD_COLOUR_GREEN:3
	// ,CARD_COLOUR_GRAY:4
	function GiveCollectionPrize(colour, login){
		console.log(colour, login);

		var action;
		switch(colour){
			case aux.c.CARD_COLOUR_RED:
				return 1;
			break;
			case aux.c.CARD_COLOUR_BLUE:
				return 1;
			break;
			case aux.c.CARD_COLOUR_GRAY:
				return 1;
			break;
			case aux.c.CARD_COLOUR_GREEN:
				return 1;
			break;
			default:
				console.error(colour)
			break;
		}
		// action

		// clear cards
	}


	app.get('/rewardme/:collectionID', aux.authenticated, function (req, res, next){
		console.log('rewardme');
		var collectionID = req.params.collectionID;
		var login = aux.getLogin(req);

		var collection;
		var uGifts;

		var CollectionList = {};
		
		Collections.getByID(collectionID) // list, name, reward
		.then(function (col){ //collection
			var colour = col.colour;
			var list = col.list;
			CollectionList[collectionID] = {}

			for (var i=0;i<list.length; i++){
				//fillCollectionList
				var collectionGiftID = list[i];
				CollectionList[collectionID][collectionGiftID] = 1;
			}

			collection = col;
			console.log('getByID', col);

			return Gifts.user.usergiftsWhichFitCollection(login, colour, list)
		})
		.then(function (usergifts){
			uGifts = usergifts;
			console.log('usergifts', usergifts);

			var need = collection.list.length;


			var have = findEqualities(usergifts, CollectionList[collectionID]);

			console.log('have='+have, 'need='+need);
			if (have>0 && have==need){
				return GiveCollectionPrize(collection.colour, login)
			} else {
				return null
			}
		})
		.then(function (result){
			var obj = {
				collection: collection,
				usergifts: uGifts,
				result: result
			}
			return obj;
		})
		.then(aux.setData(req, next))
		.catch(function (error){
			console.error(error)
			next()
		})
		// .catch(next)
	}, aux.std);

	app.get('/api/collections/remove/:id', aux.isAdmin, function (req, res, next){
		var id = req.params.id;

		Collections.remove(id) // list, name, reward

		.then(aux.setData(req, next))
		.catch(next)
	}, aux.std);

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