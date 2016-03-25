module.exports = function setApp(app, AsyncRender, Answer, sender, Log, proxy, aux){
  var Gifts = require('../../models/gifts')
  var Collections = require('../../models/collections')

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

  app.get('/api/collections/get/:collectionID', aux.isAdmin, function (req, res, next){
    var collectionID = req.params.collectionID;
    Collections.getByID(collectionID)
    .then(aux.result(req, next))
    .catch(next);
  }, aux.json, aux.error)

  app.get('/api/collections/all', aux.isAdmin, function (req, res, next){
    Collections.all({})
    .then(aux.result(req, next))
    .catch(next);
  }, aux.json, aux.error)

  app.get('/api/collections/attach/:collectionID/:giftID', aux.isAdmin, function (req, res, next){
    var collectionID = req.params.collectionID;
    var giftID = req.params.giftID;
    Collections.attachGift(collectionID, giftID)
    .then(aux.result(req, next))
    .catch(next);
  }, aux.json, aux.error)

  app.get('/AddCard', aux.isAdmin, aux.render('AddCard'))

  app.post('/AddCard', aux.isAdmin, function (req, res, next){
    var data = req.body;
    var name = data.name;
    var description = data.description;
    var photoURL = data.photoURL;
    var price = data.price;
    var rarity = data.rarity;

    Gifts.addCard(name, description, photoURL, price, rarity)
    .then(aux.result(req, next))
    .catch(next);
  }, aux.json, aux.error) // aux.render('AddCard')

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