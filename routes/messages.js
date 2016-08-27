var API = require('../helpers/API');

var Message = API.message;

var middlewares = require('../middlewares');

var respond = require('../middlewares/api-response');

module.exports = (app, aux) => {
  // app.get('/api/news/get', function (req, res) {
  //   res.json({ news: realtime().news || null })
  // });
  //
  // app.get('/api/news/all', middlewares.isAdmin, function (req, res, next){
  //   Message.news.all()
  //     .then(aux.setData(req, next))
  //     .catch(next)
  // }, aux.render('News'), aux.error);
  //
  // app.post('/api/news/add', middlewares.isAdmin, function (req, res, next){
  //   var data = req.body;
  //
  //   var text = data.text || "";
  //   var image = data.image || "";
  //   var url = data.url || "";
  //   var title = data.title || "";
  //
  //   Message.news.add(text, image, url, title)
  //     .then(aux.setData(req, next))
  //     .catch(next)
  // }, aux.std);
  //
  // app.post('/api/news/edit/:id', middlewares.isAdmin, function (req, res, next){
  //   var id = req.params.id || null;
  //   var data = req.body;
  //
  //   var text = data.text || "";
  //   var image = data.image || "";
  //   var url = data.url || "";
  //   var title = data.title || "";
  //
  //   var obj = {
  //     text: text,
  //     image: image,
  //     url: url,
  //     title: title
  //   };
  //
  //   Message.news.edit(id, obj)
  //     .then(aux.setData(req, next))
  //     .catch(next)
  // }, aux.std);
  //
  // app.get('/api/news/activation/:id/:status', middlewares.isAdmin, function (req, res, next){
  //   Message.news.activation(req.params.id||null, req.params.status || null)
  //     .then(function (result){
  //       if (result) realtime().UPDATE_ALL();
  //       return result;
  //     })
  //     .then(aux.setData(req, next))
  //     .catch(next)
  // }, aux.json, aux.err);


  app.get('/get_message', middlewares.isAdmin, respond (req => {
    var id = req.query.id;
    return Message.notifications.getByID(id)
  }));

  app.get('/messages', middlewares.isAdmin, function (req, res, next){
    var login = req.query.login;
    Message.notifications.all(login)
      .then(function (notifications){
        req.data = notifications;
        next()
      })
      .catch(next)
  }, aux.answer('Notifications'), aux.err);


  app.get('/notifications/send', middlewares.isAdmin, aux.answer('admin/SendMessage'));

  app.post('/notifications/send', middlewares.isAdmin, function (req, res, next){
    var data = req.body;
    var target = data.target;
    var notificationType = data.type;

    var header = data.header;
    var imageUrl = data.imageUrl;
    var text = data.text;

    //var targetType = typeof(target);

    if (!target) {
      return next(null);
    }

    var obj = {
      imageUrl: imageUrl,
      text: text,
      header : header
    };
    // console.log(obj, target);

    aux.alert(target, notificationType || 6, obj)
      .then(function (result){
        req.data = result;
        next();
      })
      .catch(next)

  }, aux.json, aux.err);

  app.post('/messages/chat/recent', function (req, res, next){
    // console.log('messages/chat/recent')
    var room = 'default';

    Message.chat.load(room)
      .then(aux.setData(req, next))
      .catch(next)
  }, aux.std);

  app.get('/messages/support', middlewares.authenticated, function (req, res) {
    // console.log('/messages/support', req.login);
    Message.support.user(req.login)
      .then(messages => {
        // console.log('support messages', messages);
        res.json({ msg: messages })
      })
  });

  app.get('/messages/support-incoming/', middlewares.isAdmin, function (req, res) {
    Message.support.recent()
      .then(messages => {
        res.json({ msg: messages })
      })
  });

  app.get('/messages/support/:login', middlewares.isAdmin, function (req, res) {
    // console.log('/messages/support', req.params.login);
    Message.support.user(req.params.login)
      .then(messages => {
        res.json({ msg: messages })
      })
  });

  app.post('/messages/support-respond', middlewares.isAdmin, function (req, res) {
    // console.log('/messages/support', req.params.login);
    // console.log('message support response', req.body);
    var room = 'support-' + req.body.target;
    var text = req.body.text;
    // console.log(room, text);
    Message.chat.add(room, 'Техподдержка', text)
      .then(messages => {
        res.json({ msg: messages })
      });
  });

  app.get('/notifications/news', middlewares.authenticated, function (req, res, next){
    var login = req.login;

    Message.notifications.news(login)
      .then(function (news){
        req.data = news;
        next()
      })
      .catch(next)
  }, aux.json, aux.err);

  app.get('/notifications/all', middlewares.authenticated, function (req, res, next){
    // var login = req.params.login;
    var login = req.login;

    Message.notifications.all(login)
      .then(function (news){
        req.data = news;

        Message.notifications.markAll(login)
          .catch(function(){});

        next()
      })
      .catch(next)
  }, aux.json, aux.err);

// app.post('/message/read/:id', middlewares.authenticated, function (req, res, next){
//   var id = req.params.id;
//   var login
// })
};
