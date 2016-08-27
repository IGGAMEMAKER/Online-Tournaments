module.exports = function setApp(app, aux){
  var Gifts = require('../../models/gifts');
  var Usergifts = require('../../models/usergifts');
  var Packs = require('../../models/packs');
  var Actions = require('../../models/actions');

  var middlewares = require('../../middlewares');

  var time = require('../../helpers/time');

  var respond = require('../../middlewares/api-response');

  // packs
  app.get('/givePackTo/:login/:colour/:count', middlewares.isAdmin, function (req ,res, next){
    var login = req.params.login;
    var count = parseInt(req.params.count);
    var colour = parseInt(req.params.colour);

    if (!isNumeric(count) || !isNumeric(colour)) {
      return next('notnum')
    }

    Users.pack.add(login, colour, count)
      .then(function (result){
        aux.alert(login, aux.c.NOTIFICATION_GIVE_PACK, { count:count, colour: colour });
        return result
      })
      .then(aux.setData(req, next))
      .catch(next)
  }, aux.std);

  var missStep = () => {
    return new Promise((resolve, reject) => {
      return resolve(1);
    });
  };
  app.post('/openPack/:packID/', middlewares.authenticated, function (req, res){
    var login = req.login;

    var packID = parseInt(req.params.packID);
    var price;

    var obj = {
      value: packID
      // price: price
    };

    var info = {};
    Packs.getByID(packID)
      .then(pack => {
        price = pack.price;
        obj.price = pack.price;
        aux.done(login, 'openPackTry', obj);

        if (price > 0) {
          return Money.pay(login, price, aux.c.SOURCE_TYPE_OPEN_PACK);
        }

        return missStep();
      })
      .then(function (result) {
        info['paid'] = true;
        var card = Packs.get(packID);//_standard_pack_card
        return card;
      })
      .then(function (card) {
        info.card = card;
        var giftID = card.giftID;
        card.value = packID;
        card.isFree = price === 0;

        aux.done(login, 'openPack', Object.assign({}, obj, info));
        Usergifts.saveGift(login, giftID, true, card.colour);
        aux.alert(login, aux.c.NOTIFICATION_CARD_GIVEN, card);
        res.json({});
      })
      .catch(function (err) {
        console.log('FAIL in /openPack/', err);
        if (!info.paid) {
          res.json({
            result: 'pay',
            ammount: price
          })
        } else {
          res.json({ err });
        }

        aux.fail(login, 'openPack', { err: err , info: info })
      })
  });

  app.post('/api/packs/remove/:packID', middlewares.isAdmin, respond(req => {
    return Packs.remove(req.params.packID)
  }));

  app.get('/api/packs/removeAll', middlewares.isAdmin, respond(req => {
    return Packs.removeAll()
  }));


  app.get('/api/packs/all', middlewares.isAdmin, respond (req => {
    return Packs.all()
  }));

  app.get('/api/packs/available', middlewares.isAdmin, respond (req => {
    return Packs.available()
  }));

  function pickPackfromData(data) {
    return {
      price: parseInt(data.price),
      colours: data.colours,
      items: data.items,
      probabilities: data.probabilities,
      image: data.image,
      available: data.available,
      visible: data.visible
    }
  }

  app.post('/api/packs/add', middlewares.contentManager, respond(req => {
    var obj = pickPackfromData(req.body);
    obj.date = new Date();
    console.log('api/packs/add', obj);

    // return Packs.add(obj.name, obj.photoURL, obj.description, '', obj.price, {}, new Date(), obj.properties)
    return Packs.add(obj)
  }));

  app.post('/api/packs/edit/:id', middlewares.contentManager, respond(req => {
    var packID = parseInt(req.params.id);

    var data = req.body;
    console.log(packID, data);

    var obj = pickPackfromData(data);

    console.log('packs.edit', obj);

    return Packs.edit(packID, obj)
  }));

  app.get('/packInfo', middlewares.isAdmin, function (req, res) {
    var info = Packs.info();
    res.json({ info: info })
  });

  app.get('/packOpenings/:type', middlewares.isAdmin, function (req, res, next) {
    var func;
    switch (req.params.type) {
      case 'incomeToday': // доход за сегодня
        func = function() { return Actions.openings.income(0, time.happened_today) };
        break;
      case 'incomeYesterday': // доход за сегодня
        func = function() { return Actions.openings.income(0, time.happened_yesterday) };
        break;
      case 'incomeAll': //доход за всё время
        func = function() { return Actions.openings.income(0, null) };
        break;
      case 'openedYesterday': // открыто за сегодня
        func = function() { return Actions.openings.all(time.happened_yesterday) };
        break;
      case 'openedToday': // открыто за сегодня
        func = function() { return Actions.openings.all(time.happened_today) };
        break;
      case 'openedAll': //открыто за всё время
        func = function() { return Actions.openings.all(null) };
        break;
      case 'totalToday': // открыто за сегодня
        func = function() { return Actions.openings.total(time.happened_today) };
        break;
      case 'totalYesterday': // открыто за сегодня
        func = function() { return Actions.openings.total(time.happened_yesterday) };
        break;
      case 'totalAll': //открыто за всё время
        func = function() { return Actions.openings.total(null) };
        break;
      // default:
      //   func = function() { return Actions.openings.income(0, null) }
      // break;
    }
    func()
      .then(aux.setData(req, next))
      .catch(console.error)
  }, aux.list);

  app.get('/api/usergifts/all', middlewares.isAdmin, respond (req => {
    return Usergifts.all()
  }));

  app.get('/api/usergifts/cards/', middlewares.authenticated, respond(req => {
    return Usergifts.cards(req.login)
  }));

  app.get('/api/usergifts/removeAll/', middlewares.authenticated, respond(req => {
    return Usergifts.clearAllByUsername(req.login)
  }));

  // gifts
  app.post('/api/gifts/remove/:id', middlewares.isAdmin, respond(req => {
    return Gifts.remove(req.params.id)
  }));

  app.post('/api/gifts/edit/:id', middlewares.isAdmin, respond (req => {
    var id = req.params.id;
    var data = req.body;


    if (!isValidGift(data)) throw (e);

    return Gifts
      .edit(id, data)
      .then(r => {
        console.log('update result', data, r);
        return r;
      })
  }));

  function isValidGift(data) {
    var name = data.name;
    var photoURL = data.photoURL;
    var description = data.description;
    var properties = data.properties;
    // var price = parseInt(data.price) || 0;

    if (!name || !photoURL || !description || isNaN(data.price)) {
      console.error('gift editing failed', data);
      return false;
      // throw 'invalid data;'
    }

    return true;
  }

  app.post('/api/gifts/add', middlewares.isAdmin, respond (req => {
    var data = req.body;
    var name = data.name;
    var photoURL = data.photoURL;
    var description = data.description;
    var properties = data.properties;
    var price = data.price;

    if (!isValidGift(data)) throw (e);

    return Gifts
      .add(name, photoURL, description, '', price, false, new Date(), properties)
  }));

  app.get('/api/gifts/cards', middlewares.isAdmin, respond(req => {
    return Gifts.cards(null)
  }));

  app.get('/api/gifts/cards/:rarity', middlewares.isAdmin, respond(req => {
    return Gifts.cards(req.params.rarity || null)
  }));

  app.get('/api/gifts/remove/:id', middlewares.isAdmin, respond(req => {
    return Gifts.remove(req.params.id)
  }));

  app.get('/AddCard', middlewares.isAdmin, aux.render('AddCard'));

  app.post('/AddCard', middlewares.isAdmin, function (req, res, next){
    var data = req.body;
    var name = data.name;
    var description = data.description;
    var photoURL = data.photoURL;
    var price = data.price;
    var rarity = parseInt(data.rarity);
    // console.log('addCard', data)

    if (isNaN(rarity)) return next(null);

    Gifts.addCard(name, description, photoURL, price, rarity, {})
      .then(aux.result(req, next))
      .catch(next);
  }, aux.std); // aux.render('AddCard')

  app.get('/api/gifts', middlewares.isAdmin, respond(req => {
    return Gifts.all()
  }));

  app.get('/ShowGifts', middlewares.isAdmin, function (req, res, next){
    Gifts.all()
      .then(aux.setData(req, next))
      .catch(next)
  }, aux.render('ShowGifts'));

};

//this.setApp = setApp;
//module.exports = setApp;