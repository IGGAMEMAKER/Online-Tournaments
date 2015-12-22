module.exports = function(app, AsyncRender, Answer, sender, strLog, isAuthenticated, getLogin){
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
  app.get('/AddQuestion', function (req, res){
    res.render('AddQuestion');
  })
  app.post('/AddQuestion', function (req, res){
    var data = req.body;
    var tournamentID = req.body.tournamentID;

    //if ()
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


  function stopTournament(res, tournamentID){
    sender.sendRequest('StopTournament', {tournamentID:tournamentID}, 'localhost', 'DBServer', res, sender.Proxy);

    strLog('FrontendServer StopTournament :::'+tournamentID, 'Manual');
    sender.sendRequest("StopTournament", {tournamentID:tournamentID}, '127.0.0.1', 'GameFrontendServer', null, sender.printer);
  }

  function runTournament(res, tournamentID){
   sender.sendRequest('RunTournament', {tournamentID:tournamentID}, 'localhost', 'DBServer', res, sender.Proxy); 
  }

  function GetTournamentsFromTS(res){
    sender.sendRequest('GetTournaments', {purpose:1}, 'localhost', 'DBServer', res, sender.Proxy);
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
    var data = req.body;
    data.query = {};//tournamentID:req.query.tID};
    data.queryFields = 'login money';
    //siteAnswer(res, 'GetUsers', data, 'Users');//, {login: req.session.login?req.session.login:''} );//Users
    AsyncRender("DBServer", 'GetUsers', res, {renderPage:'Users'}, data);
  });

  app.get('/Mail', function (req, res){
    AsyncRender("DBServer", 'Mail', res, {}, {});
  })

}