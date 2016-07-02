module.exports = function setApp(app, Answer, sender, Log, aux){
  var Gifts = require('../../models/gifts')
  var Collections = require('../../models/collections')
  var Packs = require('../../models/packs')
  var Users = require('../../models/users')
  var Money = require('../../models/money')
  var Actions = require('../../models/actions')

  var middlewares = require('../../middlewares')

  var time = require('../../helpers/time')

  // packs
  app.get('/api/packs/remove/:packID', aux.isAdmin, function (req, res, next){
    Packs.remove(req.params.packID)
    .then(aux.setData(req, next))
    .catch(next)
  }, aux.std);

  app.get('/api/packs/removeAll', aux.isAdmin, function (req, res, next){
    Packs.remove(req.params.packID)
    .then(aux.setData(req, next))
    .catch(next)
  }, aux.std);


  app.get('/api/packs/all', aux.isAdmin, function (req, res, next){
    Packs.all()
    .then(aux.setData(req, next))
    .catch(next)
  }, aux.render('PackInfo'), aux.err);
  // }, aux.std);

  app.get('/api/packs/available', aux.isAdmin, function (req, res, next){
    Packs.available()
    .then(aux.setData(req, next))
    .catch(next)
  }, aux.std);

  app.post('/api/packs/edit/:id', aux.isAdmin, function (req, res, next){
    var packID = parseInt(req.params.id);

    var data = req.body;
    console.log(packID, data);
    var obj = {
      price: parseInt(data.price),
      colours: JSON.parse(data.colours),
      items: JSON.parse(data.items),
      image: data.image,
      available: data.available,
      visible: data.visible
    }
    Packs.edit(packID, obj)
    .then(aux.setData(req, next))
    .catch(next)
  }, aux.std);

  app.get('/packInfo', aux.isAdmin, function (req, res){
    var info = Packs.info();
    res.json({info: info})
  })

  app.get('/packOpenings/:type', aux.isAdmin, function (req, res, next){
    // var info = Packs.info();
    // res.json({info: info})

  // income: function (time_function){ return spentMostOnPacks(0, time_function) }
  // // ,incomeGT: function (ammount, time_function){ return spentMostOnPacks(ammount||0, time_function) }
  // ,all : function (time_function){ return packOpenings(time_function, 0) }
  // ,allPaid : function (time_function){ return packOpenings(time_function, 1) }

    var func;
    switch (req.params.type){
      case 'incomeToday': // доход за сегодня
        func = function() { return Actions.openings.income(0, time.happened_today) }
      break;
      case 'incomeYesterday': // доход за сегодня
        func = function() { return Actions.openings.income(0, time.happened_yesterday) }
      break;
      case 'incomeAll': //доход за всё время
        func = function() { return Actions.openings.income(0, null) }
      break;
      case 'openedYesterday': // открыто за сегодня
        func = function() { return Actions.openings.all(time.happened_yesterday) }
      break;
      case 'openedToday': // открыто за сегодня
        func = function() { return Actions.openings.all(time.happened_today) }
      break;
      case 'openedAll': //открыто за всё время
        func = function() { return Actions.openings.all(null) }
      break;
      case 'totalToday': // открыто за сегодня
        func = function() { return Actions.openings.total(time.happened_today) }
      break;
      case 'totalYesterday': // открыто за сегодня
        func = function() { return Actions.openings.total(time.happened_yesterday) }
      break;
      case 'totalAll': //открыто за всё время
        func = function() { return Actions.openings.total(null) }
      break;
      // default:
      //   func = function() { return Actions.openings.income(0, null) }
      // break;
    }
    // Actions.packOpenings(req.params.date || null, parseInt(req.params.paid || 0) )
    // Actions.openings()
    func()
    // Actions.openings.income(null)
    // .then(function (openings){
    //   console.log('paidOpenings', openings)
    //   // return openings
    //   req.data = openings;
    //   next();
    // })
    .then(aux.setData(req, next))
    .catch(console.error)
  }, aux.list);

  // console.log(middlewares);

  app.get('/api/usergifts/all', aux.isAdmin, function (req, res, next){
    Gifts.user.all()
    .then(aux.setData(req, next))
    .catch(next)
  }, aux.std);

  app.get('/api/usergifts/cards/', middlewares.authenticated, function (req, res, next){
    // console.log('all player cards')
    // var login = aux.getLogin(req);
    var login = req.login;
    Gifts.user.cards(login)

    .then(aux.setData(req, next))
    .catch(next)
  }, aux.std);

  app.get('/api/usergifts/removeAll/', middlewares.authenticated, function (req, res, next){
    // var login = aux.getLogin(req);
    var login = req.login;
    Gifts.user.clearAllByUsername(login)

    .then(aux.setData(req, next))
    .catch(next)
  }, aux.std);

  // gifts

  app.get('/AddGift', aux.isAdmin, aux.render('AddGift'))

  app.post('/AddGift', aux.isAdmin, function (req, res){
    var data = req.body;
    Log('AddGift ' + JSON.stringify(data), 'Manual');
    if (data){
      sender.sendRequest('AddGift', data, '127.0.0.1', 'DBServer', res, function (error, response, body, res1){
        res.render('AddGift', {msg:body});
      });
    }
    else{
      Answer(res, Fail);
    }
    //sender.sendRequest('AddGift', data?data:{}, '127.0.0.1', 'FrontendServer', res, 
          
  });
  app.get('/api/gifts/cards', aux.isAdmin, function (req, res, next){
    // var rarity = null;

    Gifts.cards(null)

    .then(aux.setData(req, next))
    .catch(next)
  }, aux.std);

  app.get('/api/gifts/cards/:rarity', aux.isAdmin, function (req, res, next){
    var rarity = req.params.rarity;

    Gifts.cards(rarity||null)

    .then(aux.setData(req, next))
    .catch(next)
  }, aux.std);

  app.get('/api/gifts/remove/:id', aux.isAdmin, function (req, res, next){
    var id = req.params.id;

    Gifts.remove(id)

    .then(aux.setData(req, next))
    .catch(next)
  }, aux.std);

  app.get('/AddCard', aux.isAdmin, aux.render('AddCard'))

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
  }, aux.std) // aux.render('AddCard')



  app.get('/ShowGifts', aux.isAdmin, function (req, res, next){
    Gifts.all()

    .then(aux.setData(req, next))
    .catch(next)
  }, aux.render('ShowGifts'));

  app.get('/GetGift', function (req, res){
    var data = req.body;
    var query = req.query;
    var giftID = query.giftID;
    if (query){
      //siteAnswer(res, 'gift')
      sender.sendRequest('GetGift', {giftID:giftID} , '127.0.0.1', 'DBServer', res, 
          function (error, response, body, res1){
            //res.send(body.result);
            if (error || !body || body.length ==0 || body.result =='fail'){
              Log(JSON.stringify(error));
              res.send(404);//'Gift does not exist');
            }
            else{
              res.render('gift', {message:body} );
            }
          });
    }
    else {
      res.json({msg:'err'});
    }
  })

  app.post('/GetGift', function (req, res){
    var data = req.body;
    if (data){
      sender.sendRequest('GetGift', data, '127.0.0.1', 'DBServer', res, 
          function (error, response, body, res1){
            //res.send(body.result);
            res.json(body);
          });
    }
    else {
      res.json({msg:'err'});
    }
  })
}

//this.setApp = setApp;
//module.exports = setApp;