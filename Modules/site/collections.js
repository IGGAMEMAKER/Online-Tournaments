module.exports = function setApp(app, Answer, sender, Log, aux) {
	var Gifts = require('../../models/gifts');
	var Usergifts = require('../../models/usergifts');
	var Collections = require('../../models/collections');
	var Packs = require('../../models/packs');
	var Marathon = require('../../models/marathon');
	var Money = require('../../models/money');
	var Users = require('../../models/users');

	var respond = require('../../middlewares/api-response');

	var middlewares = require('../../middlewares');

	// collections

	function findEqualities(sameColourCardsList, collection_list) {
		// two variants:
		// 	collection.length is bigger than sameColourCardsList
		// 	or is less

		// console.log('sameColourCardsList', sameColourCardsList, 'collection_list', collection_list);

		var havings = {};
		var deletableUserGifts = [];
		var have = 0;
		for (var i = sameColourCardsList.length - 1; i >= 0; i--) {
			var giftID = sameColourCardsList[i].giftID;
			var usergiftID = sameColourCardsList[i]._id;

			console.log('check ', sameColourCardsList[i]);
			if (collection_list[giftID] == 1) {
				if (!havings[giftID]) {
					havings[giftID] = 1;
					deletableUserGifts.push(usergiftID);
				}
			}
		}
		// console.log(Object.keys(havings));
		have = Object.keys(havings).length;

		// var need = Object.keys(collection_list)
		// if (have == collection_list.length){
		// return collection_list.length;
		// }
		// return 0;
		return {
			have: have,
			deletableUserGifts: deletableUserGifts
		}
	}

	// ,CARD_COLOUR_RED:1
	// ,CARD_COLOUR_BLUE:2
	// ,CARD_COLOUR_GREEN:3
	// ,CARD_COLOUR_GRAY:4

	// ,REWARD_ACCELERATOR:1
	// ,REWARD_PACKS:2
	// ,REWARD_MONEY:3
	function GiveCollectionPrize(collection, login) {
		switch (collection.rewardType) {
			case aux.c.REWARD_ACCELERATOR:
				// needs accelerator index
				var index = parseInt(collection.reward.index) || 0;

				return Marathon.grant_accelerator(login, index)
					.then(function (result) {
						aux.alert(login, aux.c.NOTIFICATION_GIVE_ACCELERATOR, {index: index});
						return result;
					})
					.catch(aux.drop);
				break;

			case aux.c.REWARD_MONEY:
				// needs ammount of money
				var ammount = parseInt(collection.reward.ammount) || 200;

				return Money.increase(login, ammount, aux.c.SOURCE_TYPE_GRANT)
					.then(function (result) {

						aux.alert(login, aux.c.NOTIFICATION_GIVE_MONEY, {ammount: ammount});
						return result;
					})
					.catch(aux.drop);
				break;

			case aux.c.REWARD_PACKS:
				// needs colour and count
				var colour = parseInt(collection.reward.colour) || aux.c.CARD_COLOUR_GRAY;
				var count = parseInt(collection.reward.count) || 1;
				return grantPacksTo(login, colour, count);
				break;
		}
	}

	/*
	 function GiveCollectionPrize(colour, login){
	 console.log(colour, login);

	 var defaultMoneyPrize=1000;

	 var action;
	 switch(colour){
	 case aux.c.CARD_COLOUR_RED:
	 return Money.increase(login, defaultMoneyPrize, aux.c.SOURCE_TYPE_GRANT)
	 .then(function (result){

	 aux.alert(login, aux.c.NOTIFICATION_GIVE_MONEY, { ammount:defaultMoneyPrize })
	 return result;
	 })
	 .catch(aux.drop)
	 // return 1;
	 break;
	 case aux.c.CARD_COLOUR_GRAY:
	 return Marathon.grant_accelerator(login, 0)
	 .then(function (result){
	 aux.alert(login, aux.c.NOTIFICATION_GIVE_ACCELERATOR, { index:0 })
	 return result
	 })
	 .catch(aux.drop)
	 // return 1;
	 break;
	 case aux.c.CARD_COLOUR_GREEN:
	 return grantPacksTo(login, aux.c.CARD_COLOUR_GREEN, 10)
	 // return 1;
	 break;
	 case aux.c.CARD_COLOUR_BLUE:
	 return grantPacksTo(login, aux.c.CARD_COLOUR_BLUE, 10)
	 // return 1;
	 break;
	 default:
	 return grantPacksTo(login, aux.c.CARD_COLOUR_GRAY, 50)
	 console.error(colour)
	 break;
	 }
	 // action

	 // clear cards
	 }
	 */
	function revokePackFrom(login, colour, count) {
		return Users.pack.decrease(login, colour, count)
			// .then(function (result){
			// 	aux.alert(login, aux.c.NOTIFICATION_GIVE_PACK, { count:count, colour:colour })
			// 	return result
			// })
			.catch(aux.drop)
	}

	// revokePackFrom('23i03g', aux.c.CARD_COLOUR_RED, 3)
	// .then(console.log)
	// .catch(console.error)

	function grantPacksTo(login, colour, count) {
		return Users.pack.add(login, colour, count)
			.then(function (result) {
				aux.alert(login, aux.c.NOTIFICATION_GIVE_PACK, {count: count, colour: colour});
				return result
			})
			.catch(aux.drop)
	}

	app.get('/rewardme/:collectionID', aux.authenticated, function (req, res, next) {
		console.log('rewardme');
		var collectionID = req.params.collectionID;
		// var login = aux.getLogin(req);
		var login = req.login;
		var collection;
		var uGifts;

		var CollectionList = {};
		var deletableUserGifts;

		aux.done(login, 'rewardme', {collectionID: collectionID || null});

		Collections.getByID(collectionID) // list, name, reward
			.then(function (col) { //collection
				var colour = col.colour;
				var list = col.list;
				CollectionList[collectionID] = {};

				for (var i = 0; i < list.length; i++) {
					//fillCollectionList
					var collectionGiftID = list[i];
					CollectionList[collectionID][collectionGiftID] = 1;
				}

				collection = col;
				console.log('getByID', col);

				return Usergifts.usergiftsWhichFitCollection(login, colour, list)
			})
			.then(function (usergifts) {
				uGifts = usergifts;
				console.log('usergifts', usergifts);

				var need = collection.list.length;


				var obj = findEqualities(usergifts, CollectionList[collectionID]);
				var have = obj.have;
				deletableUserGifts = obj.deletableUserGifts;
				console.log(deletableUserGifts);

				console.log('have=' + have, 'need=' + need);
				if (have > 0 && have == need) {
					return GiveCollectionPrize(collection, login)
				} else {
					throw 'collection was not filled ' + have + '  /' + need;
				}
			})
			.then(function (result) {
				Usergifts.removeGroup(deletableUserGifts);

				return {
					collection: collection,
					usergifts: uGifts,
					result: result
				};
			})
			.then(aux.setData(req, next))
			.catch(function (error) {
				aux.fail(login, 'rewardme', {error: error, collectionID: collectionID || null});
				console.error(error);
				next(error)
			});
		// .catch(next)
	}, aux.std);

	app.get('/api/collections/remove/:id', aux.isAdmin, function (req, res, next) {
		var id = req.params.id;

		Collections.remove(id) // list, name, reward

			.then(aux.setData(req, next))
			.catch(next)
	}, aux.std);

	app.get('/api/collections/clear/:id', aux.isAdmin, function (req, res, next) {
		var id = req.params.id;

		Collections.clear(id) // list, name, reward

			.then(aux.setData(req, next))
			.catch(next)
	}, aux.std);

	app.get('/api/collections/add/:name', aux.isAdmin, function (req, res, next) {
		var name = req.params.name;

		Collections.add([], name, {}) // list, name, reward

			.then(aux.setData(req, next))
			.catch(next)
	}, aux.std);

	app.get('/api/collections/copy/:from/:to', aux.isAdmin, function (req, res, next) {
		var from = req.params.from;
		var to = req.params.to;

		Collections.copy(from, to)

			.then(aux.setData(req, next))
			.catch(next)
	}, aux.std);

	app.get('/api/collections/setParameter/:parameter/:value/:id', aux.isAdmin, function (req, res, next) {
		var parameter = req.params.parameter;
		var id = req.params.id;
		var value = parseInt(req.params.value);

		Collections.setParameter(id, parameter, value)

			.then(aux.setData(req, next))
			.catch(next)
	}, aux.std);

	// app.get('/api/collections/setColour/:id/:colour', aux.isAdmin, function (req, res, next){
	// 	var colour = parseInt(req.params.colour);
	// 	var id = req.params.id;

	// 	Collections.setColour(id, colour)

	// 	.then(aux.setData(req, next))
	// 	.catch(next)
	// }, aux.std);

	// app.get('/api/collections/setRewardType/:id/:rewardType', aux.isAdmin, function (req, res, next){
	// 	var rewardType = parseInt(req.params.rewardType);
	// 	var id = req.params.id;

	// 	Collections.setRewardType(id, rewardType)

	// 	.then(aux.setData(req, next))
	// 	.catch(next)
	// }, aux.std);

	app.get('/api/collections/setDescription/:id/:description', aux.isAdmin, function (req, res, next) {
		var description = req.params.description;
		var id = req.params.id;

		Collections.setParameter(id, 'description', description)

			.then(aux.setData(req, next))
			.catch(next)
	}, aux.std);

	// app.get('/api/collections/setRewardParameter/:id/:parameter/:value', aux.isAdmin, function (req, res, next){
	// 	// var colour = parseInt(req.params.colour);
	// 	var parameter = req.params.parameter;
	// 	var value = req.params.value;
	// 	var id = req.params.id;

	// 	Collections.setReward(id, parameter, value)

	// 	.then(aux.setData(req, next))
	// 	.catch(next)
	// }, aux.std);

	app.post('/api/collections/edit/:id', aux.isAdmin, function (req, res, next) {
		var collectionID = req.params.id;

		var data = req.body;
		console.log(collectionID, data);

		var obj = {
			rewardType: parseInt(data.rewardType),
			list: JSON.parse(data.list),
			reward: JSON.parse(data.reward),

			description: data.description,
			colour: parseInt(data.colour)
		};

		Collections.edit(collectionID, obj)
			.then(aux.setData(req, next))
			.catch(next)
	}, aux.std);

	// older and stable variant --------------------------------

	// app.get('/api/collections/get/:collectionID', aux.isAdmin, function (req, res, next) {
	// 	var collectionID = req.params.collectionID;
	//
	// 	Collections.getByID(collectionID)
	// 		.then(aux.result(req, next))
	// 		.catch(next);
	// }, aux.std);

	app.get('/api/collections/get/:collectionID', aux.isAdmin, respond(req => {
		return Collections.getByID(req.params.collectionID)
	}));

	// app.get('/api/collections/all', aux.isAdmin, function (req, res, next){
// }
	app.get('/api/collections/all', aux.isAdmin, function (req, res, next){
		Collections.all({})

			.then(aux.result(req, next))
			.catch(next);
		// }, aux.std)
		// 	var promise = Collections.all({});
		// 	respond(promise, req, next);
	}, aux.render('CollectionInfo'), aux.err);

	app.get('/api/collections/attach/:collectionID/:giftID', aux.isAdmin, function (req, res, next){
		var collectionID = req.params.collectionID;
		var giftID = req.params.giftID;

		Collections.attachGift(collectionID, giftID)
			.then(aux.result(req, next))
			.catch(next);
	}, aux.std)


};
