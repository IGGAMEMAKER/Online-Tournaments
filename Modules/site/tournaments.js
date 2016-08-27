var api = require('../../helpers/api');
var API = require('../../helpers/API');
var Tournaments = require('../../models/tournaments');
var TournamentRegs = require('../../models/tregs');

var servers = require('../../helpers/servers');
var respond = require('../../middlewares/api-response');

var middlewares = require('../../middlewares');

var constants = require('../../constants');

var logger = require('../../helpers/logger');

var getPortAndHostOfGame = require('../../helpers/GameHostAndPort').getPortAndHostOfGame;

var tournamentValidator = require('../../helpers/tournament-validator');

var sender = require('../../requestSender');

function proxy(error, response, body, res){
  res.end(JSON.stringify(body))
}

module.exports = function(app, aux) {
  //var Actions = require('../../models/actions');

  var PRICE_FREE = 4;
  var PRICE_TRAINING = 5;

  var PRICE_GUARANTEED = 3;
  var PRICE_NO_EXTRA_FUND = 2;
  var PRICE_CUSTOM = 1;  //


  var COUNT_FIXED = 1;
  var COUNT_FLOATING = 2;

  var multer  = require('multer');

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //cb(null, './frontend/games/Questions/special')
      cb(null, './frontend/public/img')
    },
    filename: function (req, file, cb) {
      var tournamentID = req.body.tournamentID;
      console.log('in storage tournamentID', tournamentID);
      console.log(file);
      console.log(req.files);

      arr = file.originalname.split('.');
      var last = arr.length-1;
      var extension = arr[last];
      console.log('extension', extension);

      cb(null, tournamentID + '.'+extension);// + file.extension)
    }
  });

  var upload = multer({ storage: storage }).single('image');

//var upload = multer({ storage: storage })

  app.get('/AddSpecial', function (req, res){
    res.render('AddSpecial');
  });

  app.post('/AddSpecial', function (req, res){//upload.single('image'), 
    // trying to add image
    upload(req, res, function (err){
      if (err) { console.log(err); res.render('AddSpecial'); return; }

      console.log('added image');
      res.redirect(':5010/AddQuestion');
      //var filename = req.file.originalname;
      //console.log('AddSpecial', filename);      
    })

  });

  app.get('/AddTournament', middlewares.moderator, function (req, res){
    res.render('AddTournament');
  });

  app.get('/api/tournaments/available', middlewares.moderator, api('Tournaments', 'available'));

  app.post('/api/tournaments/add', respond(req => {
    var data = Object.assign({}, req.body.tournament, { rounds: req.body.tournament.rounds || 1, players: 0 });
    logger.debug('converted new tournament', data);

    var tournament = {
      buyIn: 0,
      gameNameID: 2,
      goNext: [2,1],
      Prizes: [{type: 1, info: 10}],
      startDate: new Date(),

      rounds: 1,
      players: 0,
      comment: 'Выиграй 100 XP',

      settings: {
        hidden: false,
        regularity: constants.REGULARITY_NONE,
        tag: 'point',
        // points: 100,
        cover: 'http://www.newspress.co.il/wp-content/uploads/2016/02/fortune500_hero_cropped1.jpg'
      }
    };

    tournament = data;

    var error = tournamentValidator(tournament);

    // API.errors.add()
    if (error) {
      logger.error('error while adding tournament', error);
      throw 'invalid_tournament_data';
    }

    // return servers.TS('add-tournament', tournament);
    return API.tournaments.add(tournament);
  }));

  app.get('/api/tournaments/all', middlewares.isAdmin, function (req, res, next){
    Tournaments.all()

      .then(aux.setData(req, next))
      .catch(next)
  }, aux.render('Lists/Tournaments'), aux.err);

  app.get('/api/tournaments/current', middlewares.isAdmin, function (req, res, next){
    Tournaments.get_available()

      .then(aux.setData(req, next))
      .catch(next)
  }, aux.render('Lists/Tournaments'), aux.err);

  app.post('/api/tournaments/edit/:tournamentID', middlewares.isAdmin, function (req, res, next) {
    var tournamentID = req.params.tournamentID;
    var data = req.body || null;

    var obj = {};
    if (tournamentID && !isNaN(tournamentID) && data && data.name && data.value) {
      obj[data.name] = JSON.parse(data.value)
    }

    Tournaments.edit(tournamentID, obj)
      .then(function (result){
        if (result) {
          res.redirect('/api/tournaments/current');
        } else {
          res.json({ result });
        }
      })
      .then(aux.setData(req, next))
      .catch(next)
  }, aux.render('Lists/Tournaments'), aux.err);

  app.get('/mp/:id/:mp/', middlewares.isAdmin, function (req, res, next) {
    var tournamentID = parseInt(req.params.id);
    var mp = parseInt(req.params.mp);

    var obj = {};
    if (tournamentID && !isNaN(tournamentID)){
      obj.Prizes = [{ MP: mp || 1000 }];
      obj['settings.hold'] = true;
    }

    Tournaments.edit(tournamentID, obj)
      .then(function (result){
        if (result){
          res.redirect('/api/tournaments/current');
        } else {
          res.json({ result });
        }
      })
      .then(aux.setData(req, next))
      .catch(next)
  }, aux.render('Lists/Tournaments'), aux.err);


  app.get('/TournamentInfo/:tournamentID', middlewares.authenticated, function (req, res){
    var tournamentID = req.params.tournamentID;

    var TournamentInfo = {
      tournament: null,
      players: null
    };

    Tournaments.getByID(tournamentID)
      .then(function (tournament){
        TournamentInfo.tournament = tournament;
        return TournamentRegs.getParticipants(tournamentID)
      })
      .then(function (players){
        TournamentInfo.players = players;
        res.json({ msg: TournamentInfo });
      })
      .catch(function (error){
        res.json({ error });
      });
  });

  app.get('/api/tournaments/get/:tournamentID', middlewares.isAdmin, respond (req => {
    var tournamentID = parseInt(req.params.tournamentID);

    return Tournaments.getByID(tournamentID)
      .then(function (tournament){
        return TournamentRegs.getParticipants(tournamentID)
          .then(function (players){
            return {
              tournament,
              players
            };
          });
      });
  }));

  app.get('/clearRegs/:tournamentID', middlewares.isAdmin, respond (req => {
    var tournamentID = parseInt(req.params.tournamentID);

    return TournamentRegs.freeTournament(tournamentID)
  }));

  function edit(id, options, res) {
    Tournaments.edit(id, options)
      .then(result => res.json({ result }))
      .catch(err => res.json({ err }))
  }

  app.get('/api/tournaments/hidden/:tournamentID/:status', middlewares.isAdmin, function (req, res) {
    var tournamentID = req.params.tournamentID;
    var status = req.params.status;

    edit(tournamentID, { 'settings.hidden': status === 'true' }, res);
  });

  app.get('/api/tournaments/clearStartDate/:tournamentID', middlewares.moderator, function(req, res) {
    var tournamentID = req.params.tournamentID;

    edit(tournamentID, { startDate: null }, res)
  });

  app.post('/api/tournaments/date/:tournamentID', middlewares.isAdmin, function (req, res) {
    var tournamentID = req.params.tournamentID;
    var startDate = req.body.startDate; // new Date(

    edit(tournamentID, { startDate }, res)
  });

  app.get('/specials', middlewares.isAdmin, function (req, res) {
    Tournaments.specials()
      .then(function (result) {
        console.log('specials', result);
        res.json({ msg: result });
      })
      .catch(function (err) {
        res.json({ err });
      })
  });

  app.post('/GetTournamentAddress', function (req, res) {
    var tournamentID = req.body.tournamentID;

    Tournaments.getByID(tournamentID)
      .then(tournament => {
        var address = getPortAndHostOfGame(tournament.gameNameID);

        address.running = tournament.status == constants.TOURN_STATUS_RUNNING;

        res.json({ address });
      })
      .catch(err => {
        console.error('/GetTournamentAddress in site', err);
        res.json({ err })
      })
  });

  app.post('/ServeTournament', function (req, res) {
    var data = req.body;
    logger.log("/ServeTournament ... site.tournaments ", 'Tournaments', data);

    sender.sendRequest("ServeTournament", data, '127.0.0.1', 'GameFrontendServer', res, proxy);
  });
};
