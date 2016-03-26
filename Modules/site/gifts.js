module.exports = function setApp(app, AsyncRender, Answer, sender, Log, proxy, aux){
  var Gifts = require('../../models/gifts')
  var Collections = require('../../models/collections')
  var Packs = require('../../models/packs')

  var middlewares = require('../../middlewares')

  app.get('/AddGift', function (req, res){
    res.render('AddGift');
  });

  app.post('/AddGift', function (req, res){
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

  app.post('/openPack/:value', middlewares.authenticated, function (req, res){
    var value = parseInt(req.params.value) || aux.c.CARD_COLOUR_GRAY;

    var login = aux.getLogin(req);
    var price = (10 + (4 - value)* 20) *0;
    res.end('')
    // return Money.pay(login, price, aux.c.SOURCE_TYPE_OPEN_PACK)
    // .then(function (result){
    //   console.log(login, price, result);
      var card = Packs.get(value);//_standard_pack_card
      console.log(card);
    //   return card;
    // })
    // .then(function (card){
      var giftID = card.giftID;

      Gifts.user.saveGift(login, giftID, true, card.colour)
      aux.alert(login, aux.c.NOTIFICATION_CARD_GIVEN, card)
    // })
    // .catch(function (err){
    //   Errors.add(login, { err: err })
    // })
    // .catch(next)
  })
  // console.log(middlewares);



  app.get('/api/gifts/cards/:rarity', middlewares.isAdmin, function (req, res, next){
    var rarity = req.params.rarity;
    Gifts.cards(rarity||null)
    .then(aux.setData(req, next))
    .catch(next)
  }, aux.std);

  app.get('/api/usergifts/cards/', middlewares.authenticated, function (req, res, next){
    // console.log('all player cards')
    var login = aux.getLogin(req);
    Gifts.user.cards(login)

    .then(aux.setData(req, next))
    .catch(next)
  }, aux.std);

  app.get('/api/gifts/remove/:id', aux.isAdmin, function (req, res, next){
    var id = req.params.id;

    Gifts.remove(id)

    .then(aux.setData(req, next))
    .catch(next)
  }, aux.std);

  app.get('/api/usergifts/removeAll/', middlewares.authenticated, function (req, res, next){
    var login = aux.getLogin(req);

    Gifts.user.clearAllByUsername(login)

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

  app.get('/ShowGifts', function (req, res){
    /*var data = req.body;
    if (!data){ data={}; }
    siteAnswer(res, 'ShowGifts', data, 'ShowGifts');*/
    AsyncRender('DBServer', 'ShowGifts', res, {renderPage:'ShowGifts'});
  });

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