module.exports = function setApp(app, Answer, sender, Log, aux){
  var Gifts = require('../../models/gifts');
  var Usergifts = require('../../models/usergifts');
  var Packs = require('../../models/packs');
  var Actions = require('../../models/actions');

  var middlewares = require('../../middlewares');

  var time = require('../../helpers/time');

  var respond = require('../../middlewares/api-response');

  // packs
  app.post('/api/packs/remove/:packID', aux.isAdmin, respond(req => {
    return Packs.remove(req.params.packID)
  }));

  app.get('/api/packs/removeAll', aux.isAdmin, respond(req => {
    return Packs.removeAll()
  }));


  app.get('/api/packs/all', aux.isAdmin, respond (req => {
    return Packs.all()
  }));
  // app.get('/api/packs/all', aux.isAdmin, function (req, res, next){
  //   Packs.all()
  //     .then(aux.setData(req, next))
  //     .catch(next)
  // }, aux.render('PackInfo'), aux.err);
  // }, aux.std);

  app.get('/api/packs/available', aux.isAdmin, respond (req => {
    return Packs.available()
  }));

  app.post('/api/packs/edit/:id', aux.isAdmin, function (req, res, next) {
    var packID = parseInt(req.params.id);

    var data = req.body;
    console.log(packID, data);

    var obj = {
      price: parseInt(data.price),
      colours: data.colours,
      items: data.items,
      probabilities: data.probabilities,
      image: data.image,
      available: data.available,
      visible: data.visible,
      // properties: data.properties,
    };

    console.log('packs.edit', obj);
    Packs.edit(packID, obj)
      .then(aux.setData(req, next))
      .catch(next)
  }, aux.std);

  app.get('/packInfo', aux.isAdmin, function (req, res) {
    var info = Packs.info();
    res.json({info: info})
  });

  app.get('/packOpenings/:type', aux.isAdmin, function (req, res, next) {
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

  app.get('/api/usergifts/all', aux.isAdmin, respond (req => {
    return Usergifts.all()
  }));

  app.get('/api/usergifts/cards/', middlewares.authenticated, respond(req => {
    return Usergifts.cards(req.login)
  }));

  app.get('/api/usergifts/removeAll/', middlewares.authenticated, respond(req => {
    return Usergifts.clearAllByUsername(req.login)
  }));

  // gifts
  app.post('/api/gifts/remove/:id', aux.isAdmin, respond(req => {
    return Gifts.remove(req.params.id)
  }));

  app.post('/api/gifts/edit/:id', aux.isAdmin, function (req, res, next) {
    var id = req.params.id;
    var data = req.body;

    if (isValidGift(data)) {
      Gifts
        .edit(id, data)
        .then(r => {
          console.log('update result', data, r);
          return r;
        })
        .then(aux.setData(req, next))
        .catch(next);
    } else {
      console.error('invalidGift', data, e);
      next(e);
    }
  }, aux.std);

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

  // app.get('/AddGift', aux.isAdmin, aux.render('AddGift'))

  // app.post('/AddGift', aux.isAdmin, function (req, res) {
  app.post('/api/gifts/add', aux.isAdmin, function (req, res, next) {
    var data = req.body;
    var name = data.name;
    var photoURL = data.photoURL;
    var description = data.description;
    var properties = data.properties;
    var price = data.price;

    if (isValidGift(data)) {
      Gifts
        .add(name, photoURL, description, '', price, false, new Date(), properties)
        .then(aux.setData(req, next))
        .catch(next);
    } else {
      console.error(e);
      next(e);
    }
  }, aux.std);

  app.get('/api/gifts/cards', aux.isAdmin, respond(req => {
    return Gifts.cards(null)
  }));

  app.get('/api/gifts/cards/:rarity', aux.isAdmin, respond(req => {
    return Gifts.cards(req.params.rarity || null)
  }));

  app.get('/api/gifts/remove/:id', aux.isAdmin, respond(req => {
    return Gifts.remove(req.params.id)
  }));

  app.get('/AddCard', aux.isAdmin, aux.render('AddCard'));

  app.post('/AddCard', aux.isAdmin, function (req, res, next){
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

  app.get('/api/gifts', aux.isAdmin, respond(req => {
    return Gifts.all()
  }));

  app.get('/ShowGifts', aux.isAdmin, function (req, res, next){
    Gifts.all()
      .then(aux.setData(req, next))
      .catch(next)
  }, aux.render('ShowGifts'));

};

//this.setApp = setApp;
//module.exports = setApp;