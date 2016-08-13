var Fail = { result:'fail'};

var api = require('../../helpers/api');
var API = require('../../helpers/API');
var Tournaments = require('../../models/tournaments');
var TournamentRegs = require('../../models/tregs');

var servers = require('../../helpers/servers');
var respond = require('../../middlewares/api-response');

var middlewares = require('../../middlewares');

var constants = require('../../constants');

var getPortAndHostOfGame = require('../../helpers/GameHostAndPort').getPortAndHostOfGame;

var tournamentValidator = require('../../helpers/tournament-validator');

module.exports = function(app, AsyncRender, Answer, sender, Log, proxy, aux) {
  //var Actions = require('../../models/actions');

  var PRICE_FREE = 4;
  var PRICE_TRAINING = 5;

  var PRICE_GUARANTEED = 3;
  var PRICE_NO_EXTRA_FUND = 2;
  var PRICE_CUSTOM = 1;  //


  var COUNT_FIXED = 1;
  var COUNT_FLOATING = 2;

  var strLog = Log;

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
//var Answer = sender.Answer;

  app.get('/AddSpecial', function (req, res){
    res.render('AddSpecial');
  })

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

  app.get('/AddTournament', aux.moderator, function (req, res){
    res.render('AddTournament');
  });

  app.get('/api/tournaments/available', aux.moderator, api('Tournaments', 'available'));

  app.get('/api/tournaments/add', respond(req => {
    var tournament = {
      buyIn: 0,
      gameNameID: 2,
      rounds: 1,
      goNext: [2,1],
      Prizes: [5],
      players: 0,
      settings: {
        hidden: false,
        regularity: constants.REGULARITY_NONE
      }
    };

    var error = tournamentValidator(tournament);

    if (error) {
      console.log('error while adding tournament', error);
      throw 'invalid_tournament_data';
    }

    // return servers.TS('add-tournament', tournament);
    return API.tournaments.add(tournament);
  }));

  app.post('/AddTournament', AddTournament);
  function AddTournament(req, res){
    var data = req.body;

    if (!data){
      Answer(res, Fail);
      return;
    }

    strLog('Incoming tournament : ' +JSON.stringify(data));
    var buyIn = parseInt(data.buyIn);
    var rounds = parseInt(data.rounds);
    var gameNameID = parseInt(data.gameNameID);
    var GoNext = data.goNext?data.goNext.split(" ") : [];
    var Prizes = data.Prizes.split(" ");
    var prizes = [];
    var goNext = [];
    strLog(JSON.stringify(Prizes));
    //convert array of strings to array of objects
    for (var i = 0; i < Prizes.length - 1; i++) {
      if (isNaN(Prizes[i]) ){
        if (Prizes[i].length>0){
          prizes.push({giftID:Prizes[i]})
        } else {
          strLog('Prize[i] is null. Current prize is: ' + Prizes[i]);
          Answer(res, Fail);
          return;
        }
      } else {
        prizes.push( parseInt(Prizes[i]) );
      }
    }

    for (var i = 0; i< GoNext.length - 1; ++i){
      var num = parseInt(GoNext[i]);
      if (isNaN(num)){
        strLog('goNext num parseInt error! ');
        strLog(GoNext);
        Answer(res, Fail);
        return;
      }
      else{
        goNext.push(num);
      }
    }

    strLog('splitted prizes: ' + JSON.stringify(prizes) );
    strLog('goNext.length:' + goNext.length);
    strLog(JSON.stringify(goNext));
    if (buyIn>=0 && rounds && gameNameID){
      var obj = {
        buyIn:      buyIn,
        initFund:     0,
        gameNameID:   gameNameID,

        pricingType:  PRICE_NO_EXTRA_FUND,

        rounds:     rounds,
        goNext:     goNext.length>0 ? goNext : [2,1],//
        places:     [1],
        Prizes:     prizes.length>0 ? prizes: [{giftID:'5609b7988b659cb7194c78c6'}],
        prizePools:   [1],

        comment:    'Yo',

        playersCountStatus: COUNT_FIXED,///Fixed or float
        startDate:    null,
        status:       null,
        players:      0
      };

      if (data.special || data.regularity || data.specName){
        obj.settings={};
      }
      // regular tournaments settings  // // && data.regularity!="0"
      if (data.regularity) { obj.settings.regularity = parseInt(data.regularity); }
      if (data.special) { obj.settings.special = parseInt(data.special); }
      if (data.specName) { obj.settings.specName = data.specName; }
      if (data.specPrizeName) { obj.settings.specPrizeName = data.specPrizeName; }

      if (data.hidden!=0) {obj.settings.hidden = true; obj.settings.topic = getTopic(data.hidden); }

      AsyncRender('DBServer', 'AddTournament', res, {renderPage:'AddTournament'}, obj);
    } else {
      strLog('Invalid data comming while adding tournament: buyIn: ' + buyIn + ' rounds: ' + rounds + ' gameNameID: ' + gameNameID, 'WARN');
      sender.Answer(res, Fail);
    }
  }

  app.get('/api/tournaments/all', aux.isAdmin, function (req, res, next){
    Tournaments.todos()

      .then(aux.setData(req, next))
      .catch(next)
  }, aux.render('Lists/Tournaments'), aux.err);

  app.get('/api/tournaments/current', aux.isAdmin, function (req, res, next){
    Tournaments.get_available()

      .then(aux.setData(req, next))
      .catch(next)
  }, aux.render('Lists/Tournaments'), aux.err);

  app.get('/TournamentInfo/:tournamentID', middlewares.authenticated, function (req, res){
    var tournamentID = req.params.tournamentID;

    var TournamentInfo= {
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
        res.json({msg: TournamentInfo});
      })
      .catch(function (error){
        res.json({error});
      });
    // var data = req.body;
    // data.query = {tournamentID:req.query.tID};
    // data.queryFields = 'tournamentID buyIn goNext gameNameID Prizes players status';
    // data.purpose = GET_TOURNAMENTS_INFO;  

    // AsyncRender('DBServer', 'GetTournaments', res, {renderPage:'TournamentInfo'}, data);

  });

  app.get('/api/tournaments/get/:tournamentID', aux.isAdmin, function (req, res, next){
    var tournamentID = parseInt(req.params.tournamentID);

    Tournaments.getByID(tournamentID)
      .then(function (tournament){
        return TournamentRegs.getParticipants(tournamentID)
          .then(function (players){
            return {
              tournament,
              players
            };
          });
      })
      // .then(d => { req.data = d; })
      .then(aux.setData(req, next))
      .catch(next)
  }, aux.std);

  app.get('/clearRegs/:tournamentID', aux.isAdmin, function (req, res, next) {
    var tournamentID = parseInt(req.params.tournamentID);

    TournamentRegs.freeTournament(tournamentID)
      .then(aux.setData(req, next))
      .catch(next)
  }, aux.std);

  app.get('/mp/:id/:mp/', aux.isAdmin, function (req, res, next) {
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

  function edit(id, options, res) {
    Tournaments.edit(id, options)
      .then(result => res.json({ result }))
      .catch(err => res.json({ err }))
  }

  app.get('/api/tournaments/hidden/:tournamentID/:status', aux.isAdmin, function (req, res) {
    var tournamentID = req.params.tournamentID;
    var status = req.params.status;

    edit(tournamentID, { 'settings.hidden': status === 'true' }, res);
  });

  app.get('/api/tournaments/clearStartDate/:tournamentID', aux.moderator, function(req, res) {
    var tournamentID = req.params.tournamentID;

    edit(tournamentID, { startDate: null }, res)
  });

  app.post('/api/tournaments/date/:tournamentID', aux.isAdmin, function (req, res) {
    var tournamentID = req.params.tournamentID;
    var startDate = req.body.startDate; // new Date(

    edit(tournamentID, { startDate }, res)
  });

  app.post('/api/tournaments/edit/:tournamentID', aux.isAdmin, function (req, res, next) {
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

  function getTopic(topic) {
    Log("getTopic : " + topic, "Tournaments");
    switch(topic){
      case '1': return 'realmadrid'; break;
      default: return 'null'; break;
    }
  }

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
    // AsyncRender('DBServer', 'GetTournamentAddress', res, {}, {tournamentID: req.body.tournamentID} );
    var tournamentID = req.body.tournamentID;

    Tournaments.getByID(tournamentID)
      .then(tournament => {
        var address = getPortAndHostOfGame(tournament.gameNameID);

        address.running = tournament.status == aux.c.TOURN_STATUS_RUNNING;

        sender.Answer(res, { address });
      })
      .catch(err => {
        console.error('/GetTournamentAddress in site', err);
      })
  });

  app.post('/ServeTournament', ServeTournament);
  function ServeTournament (req, res){
    var data = req.body;
    console.log('ServeTournament ... site.tournaments');
    strLog("ServeTournament ... site.tournaments ", 'Tournaments');

    sender.sendRequest("ServeTournament", data, '127.0.0.1', 'GameFrontendServer', res, proxy);
  }
};
