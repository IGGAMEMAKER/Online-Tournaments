var logger = require('../helpers/logger');
var API = require('../helpers/API');

var sender = require('../requestSender');
var fs = require('fs');
var schedule = require('node-schedule');


// pulse
var players = {};
var unauthenticated = 0;

var saveUserList = (users) => {
  // logger.debug('saveUserList', users);

  var visitList = users.map(login => {
    return {
      login,
      date: players[login].date,
      registered: players[login].registered
    }
  });

  logger.debug(visitList);

  API.visits.saveList(visitList);
};

// schedule.scheduleJob('0 15 0-23/2 * * *', () => {
schedule.scheduleJob('0 35 0-23/2 * * *', () => {
  var users = Object.keys(players);

  logger.log('CRON SAVE VISITS', users.length);

  sender.Stats('Online-users', { users });

  saveUserList(users);

  players = {};
});

module.exports = (app) => {

  app.get('/save-retention', (req, res) => {
    var users = Object.keys(players);

    sender.Stats('Online-users', { users });

    saveUserList(users);

    fs.writeFile('retention-file (' + new Date().toDateString() + ').txt', users, (err) => {
      if (err) {
        res.json({ err });
        API.errors.add('system', 'save-retention', { err });
      } else {
        res.json({ result: players, count: users.length });
      }
    });
  });

  // setInterval(function () {
  //   // var authenticated = Object.keys(players).length;
  //   // logger.debug('Online: ' + unauthenticated + ' unauthenticated users and ' + authenticated, 'Users');
  //
  //   // players = {};
  //   // unauthenticated = 0;
  //
  //   var users = Object.keys(players);
  //   sender.Stats('Online-users', { users });
  //
  //   // saveUserList(users);
  // }, 2 * 60000);

  app.post('/mark/Here', function (req, res) {
    res.end('');
    var login = req.session ? req.session.login : null;

    if (login) {
      var registered = req.body.registered;

      if (!registered) {
        return;
      }

      players[login] = { registered, date: new Date() };
    } else {
      unauthenticated++;
    }
  });
};
