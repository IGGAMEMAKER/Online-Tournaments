var json2csv = require('json2csv');

var middlewares = require('../middlewares');
var configs = require('../configs');
module.exports = (app, aux) => {

// app.get('/updateLinks', middlewares.isAdmin, function (req, res, next){
//   Users.mailers()
//   .then(function(users){
//     req.data = 'found';
//     next();
//     Users.update_auth_links(users)
//   })
//   .catch(next)
// }, aux.raw, aux.err)
  app.get('/updateLinks', middlewares.isAdmin, function (req, res, next){
    Users.mailers()
      .then(function(users){
        req.data = 'found';
        next();
        Users.update_auth_links(users)
      })
      .catch(next)
  }, aux.raw, aux.err);

  var domainName = configs.gameHost || 'localhost';

  app.get('/getCSV', middlewares.isAdmin, function (req, res, next){
    var fields = ['email', 'money', 'authlink'];
    Users.mailers()
      .then(function (users){
        // console.log(users);
        for (var i = users.length - 1; i >= 0; i--) {
          users[i].authlink = 'http://' + domainName + '/linker/' + users[i].login + '/' + users[i].link;
        }
        json2csv({ data: users, fields: fields }, function (err, csv) {
          if (err) {
            next(err);
          } else {
            console.log(csv);
            req.data = csv;
            next();
          }
        });
      })
      .catch(next)

  }, aux.raw, aux.err);

  app.get('/mailLists', middlewares.isAdmin, function (req, res, next){
    aux.mailLists()
      .then(function (lists){
        req.data = lists.data[0];
        next();
      })
      .catch(next);

  }, aux.json, aux.err);

  app.get('/mailUsers1', middlewares.isAdmin, function (req, res, next){
    aux.mailUsers()
      .then(function (lists){
        req.data = lists;
        next();
      })
      .catch(next);

  }, aux.json, aux.err);
};
