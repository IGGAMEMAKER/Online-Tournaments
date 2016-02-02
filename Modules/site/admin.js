module.exports = function(app, AsyncRender, Answer, sender, strLog, isAuthenticated, getLogin){
  var Users = require('../../models/users');
  var Actions = require('../../models/actions');
  
  var middlewares = require('../../middlewares');
  var authenticated = middlewares.authenticated;
  var isAdmin = middlewares.isAdmin;
  
  var multer  = require('multer')

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      var tournamentID = req.body.tournamentID;
      var folder;
      if (tournamentID && !isNaN(tournamentID)) { 
        folder = 'special';
      } else {
        folder = 'general';
      }
      cb(null, './frontend/games/Questions/'+folder);
    },
    filename: function (req, file, cb) {
      var tournamentID = req.body.tournamentID;
      console.log('in storage tournamentID', tournamentID);
      console.log(file);
      if (tournamentID) { 
        cb(null, tournamentID + '.txt');// + file.extension) 
      } else {
        cb(null, 'qst-'+ Date.now() + '.txt');
      }
    }
  })
    
  var upload = multer({ storage: storage }).single('questions');

  app.post('/Admin', Admin);
  function Admin(req, res){
    var command = req.body.command || '';
    switch(command){
      case 'TournamentsRunning': TournamentsRunning(res); break;
      case 'stopTournament': stopTournament(res, req.body.tournamentID); break;
      case 'runTournament': runTournament(res, req.body.tournamentID); break;
      case 'Tournaments': GetTournamentsFromTS(res); break;
      case 'Stop': StopServer(res, req.body.serverName); break;

      case 'GetGameFromGameServer': GetGameFromGameServer(res, req.body.gameNameID); break;
      default: sender.Answer(res, {result:'Unknown command ' + command}); break;
    }
  }
  app.get('/AddQuestions', function (req, res){
    res.render('AddQuestions');
  })
  app.post('/AddQuestions', function (req, res){
    var data = req.body;
    var tournamentID = req.body.tournamentID;

    // trying to add image
    console.log('adding questions', tournamentID);
    upload(req, res, function (err){
      if (err) { console.log(err); res.render('AddQuestions'); return; }
      
      console.log('added questions', tournamentID);
      if (tournamentID && !isNaN(tournamentID)) {
        res.redirect('StartSpecial/'+tournamentID);
      } else {
        res.end('added questions');
      }
    })
  })

  app.get('/StartSpecial/:id', function (req, res){
    var tournamentID = parseInt(req.params.id);
    res.end('StartSpecial ' + tournamentID);
    if (tournamentID>0) sender.sendRequest('StartSpecial', { tournamentID: tournamentID }, 'localhost', 'DBServer');//, res, sender.Proxy);
  })

  function GetGameFromGameServer(res, gameNameID){
    var servName = gameNameID;
    AsyncRender(servName, 'GetGames', res);
  }

  function Respond(template){
    return function (req, res){
      if (template){
        res.render(template, req.result||null);
      } else {
        res.end(JSON.stringify(req.result));
      }
    }
  }

  app.get("/UpdateFrontend", function (req, res) {
    sender.sendRequest("UpdateFrontend", {}, '127.0.0.1', 'DBServer', res, function (err, response, body, res){
      res.end(JSON.stringify(body));
    });
  });


  function stopTournament(res, tournamentID){
    sender.sendRequest('StopTournament', {tournamentID:tournamentID}, 'localhost', 'DBServer', res, sender.Proxy);

    strLog('FrontendServer StopTournament :::'+tournamentID, 'Manual');
    sender.sendRequest("StopTournament", {tournamentID:tournamentID}, '127.0.0.1', 'GameFrontendServer', null, sender.printer);

    sender.sendRequest("tellToFinishTournament", {tournamentID:tournamentID}, '127.0.0.1', 'site');
  }

  function runTournament(res, tournamentID){
   sender.sendRequest('RunTournament', {tournamentID:tournamentID}, 'localhost', 'DBServer', res, sender.Proxy); 
  }
  const GET_TOURNAMENTS_RUNNING = 5;
  function GetTournamentsFromTS(res){
    sender.sendRequest('GetTournaments', {purpose:GET_TOURNAMENTS_RUNNING}, 'localhost', 'DBServer', res, sender.Proxy);
  }

  function TournamentsRunning(res){
    sender.sendRequest('RunningTournaments', {}, 'localhost', 'DBServer', res, sender.Proxy);
  }



  app.get('/Admin', function (req, res){
    //res.sendFile(__dirname + '/SpecLogs.html', {topic:'Forever'});
    res.render('AdminPanel', {msg:'hola!'});
      return;
    if (isAuthenticated(req) && getLogin(req) =='Alvaro_Fernandez'){
      res.render('AdminPanel', {msg:'hola!'});
      return;
    }
    res.send(404);

  });

  app.get('/Users' , function (req, res){    
    /*var data = req.body;
    data.query = {};//tournamentID:req.query.tID};
    data.queryFields = 'login money';
    AsyncRender("DBServer", 'GetUsers', res, {renderPage:'Users'}, data);
    */
    Users.all()
    .then(function(users){
      console.log(users);
      res.render('Users', {msg:users});
    })
    .catch(function(err){
      res.end(JSON.stringify(err));
    })
  });

  app.get('/UserInfo/:login', function (req, res){
    var login = req.params.login;
    if (login){
      Actions.findByLogin(login)
      .then(function (actions){
        res.json({
          msg:'found info about '+ login
          , result: actions||null
        })
      })
      .catch(function(err){
        res.json({msg:'err', text:err});
      })
    } else {
      res.json({msg:'no login'})
    }
  })

  app.get('/Actions', function (req, res){
    Actions.findAllPerDay()
    //.then(sendJSON(res))
    .then(render(res, 'Actions'))
    .catch(sendError(res));
  })

  app.get('/Mail', function (req, res){
    AsyncRender("DBServer", 'Mail', res, {}, {});
  })

  function render(res, page){
    return function(data){
      res.render(page, {msg:data});
    }
  }

  function sendJSON(res){
    return function (data){
      res.json({
        msg:'OK'
        , result: data||null
      })
    }
  }

  function sendError(res){
    return function (err){
      res.json({msg:'err', text:err});
    }
  }

}