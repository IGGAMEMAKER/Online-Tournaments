module.exports = function setApp(app, AsyncRender, Answer, sender, Log, proxy, aux){
  var Gifts = require('../../models/gifts')
  var Collections = require('../../models/collections')
  var Packs = require('../../models/packs')
  var Users = require('../../models/users')
  var Money = require('../../models/money')

  var middlewares = require('../../middlewares')

  // packs

  app.get('/api/usergifts/all', aux.isAdmin, function (req, res, next){
    Gifts.user.all()

    .then(aux.setData(req, next))
    .catch(next)
  }, aux.std);

  app.post('/openPack/:value/:paid', middlewares.authenticated, function (req, res){
    var value = parseInt(req.params.value) || aux.c.CARD_COLOUR_GRAY;
    var paid = parseInt(req.params.paid) || 0;


    var login = aux.getLogin(req);
    var price = (10 + (4 - value)* 20);
    res.end('')


    var obj = {value:value, paid:paid};
    if (paid) obj.price = price;

    aux.done(login, 'openPack', obj)

    var paymentFunction = function(){
      if (paid) {
        return Money.pay(login, price, aux.c.SOURCE_TYPE_OPEN_PACK)
      } else {
        return Users.pack.decrease(login, value, 1)
      }
    }

    // return Money.pay(login, price, aux.c.SOURCE_TYPE_OPEN_PACK)
    paymentFunction()
    .then(function (result){
      console.log(login, price, result);
      var card = Packs.get(value);//_standard_pack_card
      console.log(card);
      return card;
    })
    .then(function (card){
      var giftID = card.giftID;
      card.value = value
      card.isFree = !paid;

      Gifts.user.saveGift(login, giftID, true, card.colour)
      aux.alert(login, aux.c.NOTIFICATION_CARD_GIVEN, card)
    })
    .catch(function (err){
      aux.fail(login, 'openPack', { err: err })
    })


    // // return Money.pay(login, price, aux.c.SOURCE_TYPE_OPEN_PACK)
    // // .then(function (result){
    // //   console.log(login, price, result);
    //   var card = Packs.get(value);//_standard_pack_card
    //   // console.log(card);
    // //   return card;
    // // })
    // // .then(function (card){
    //   var giftID = card.giftID;
    //   card.value = value

    //   Gifts.user.saveGift(login, giftID, true, card.colour)
    //   aux.alert(login, aux.c.NOTIFICATION_CARD_GIVEN, card)
    // // })
    // // .catch(function (err){
    // //   Errors.add(login, { err: err })
    // // })
    // // .catch(next)
  })
  // console.log(middlewares);

  app.get('/api/usergifts/cards/', middlewares.authenticated, function (req, res, next){
    // console.log('all player cards')
    var login = aux.getLogin(req);
    Gifts.user.cards(login)

    .then(aux.setData(req, next))
    .catch(next)
  }, aux.std);

  app.get('/api/usergifts/removeAll/', middlewares.authenticated, function (req, res, next){
    var login = aux.getLogin(req);

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