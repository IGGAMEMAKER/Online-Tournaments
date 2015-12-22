module.exports = function(app, AsyncRender, Answer, sender, Log, proxy){
var Fail = { result:'fail'};

var PRICE_FREE = 4;
var PRICE_TRAINING = 5;

var PRICE_GUARANTEED = 3;
  var PRICE_NO_EXTRA_FUND = 2;
var PRICE_CUSTOM = 1;  //


  var COUNT_FIXED = 1;
var COUNT_FLOATING = 2;

var strLog = Log;

var multer  = require('multer')

var specialTournamentID;

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
    console.log('extension', extension)

    cb(null, tournamentID + '.'+extension);// + file.extension)
  }
})
  
var upload = multer({ storage: storage }).single('image');

/*function getTournamentID(req, res, next){
  req.tournamentID = req.body.tournamentID;
  next();
}*/

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
      res.redirect('AddQuestion');
      //var filename = req.file.originalname;
      //console.log('AddSpecial', filename);      
    })

  })

	app.get('/AddTournament', function (req, res){
	  res.render('AddTournament');
	  /*if (req.session.login=='Alvaro_Fernandez'){
	    res.render('AddTournament');
	    //siteAnswer(res, 'AddTournament');
	  }
	  else{
	    res.render('Alive');
	  }*/
	});
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
        }
        else{
          strLog('Prize[i] is null. Current prize is: ' + Prizes[i]);
          Answer(res, Fail);
          return;
        }
      }
      else{
        prizes.push( parseInt(Prizes[i]) );
      }
    };

    for (var i=0; i< GoNext.length - 1; ++i){
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
    //strLog('')
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
      }

      if (data.special || data.regularity || data.specName){
        obj.settings={};
      }
      // regular tournaments settings  // // && data.regularity!="0"
      if (data.regularity) { obj.settings.regularity = parseInt(data.regularity); }
      if (data.special) { obj.settings.special = parseInt(data.special); }
      if (data.specName) { obj.settings.specName = data.specName; }

      AsyncRender('DBServer', 'AddTournament', res, {renderPage:'AddTournament'}, obj);
    }
    else{
      strLog('Invalid data comming while adding tournament: buyIn: ' + buyIn + ' rounds: ' + rounds + ' gameNameID: ' + gameNameID, 'WARN');
      sender.Answer(res, Fail);
    }
	}

	app.post('/GetTournamentAddress', function (req, res){
		Log('tournaments.js ... tID = ' + req.body.tournamentID, 'Tournaments');
		AsyncRender('DBServer', 'GetTournamentAddress', res, {}, {tournamentID: req.body.tournamentID} );
	})

	app.post('/FinishGame', FinishGame);
	function FinishGame(req, res){
		var data = req.body;
    console.error(data);

		sender.Answer(res, {result:'OK', message:'FinishGame'} );
		sender.sendRequest("FinishGame", data, '127.0.0.1', 'DBServer', null, sender.printer);
	}

	/*app.all('/StartTournament', function (req, res){
		//console.log(req.url);
		Log('StartTournament', 'ASD');
		console.log('Site starts tournament');
		var data = req.body;
		//console.log(req.body);

		//
		sender.sendRequest("StartTournament", data, '127.0.0.1', 'GameFrontendServer', null, sender.printer);//sender.printer
		//

		//io.emit('StartTournament', {tournamentID : data.tournamentID, port:data.port, host:data.host, logins : data.logins});//+req.body.tournamentID
		res.end();
	});*/

	app.post('/ServeTournament', ServeTournament);
	function ServeTournament (req, res){
		var data = req.body;
		console.log('ServeTournament ... site.tournaments');
		strLog("ServeTournament ... site.tournaments ", 'Tournaments');
		//strLog(JSON.stringify(data));//['tournamentStructure']);

		var tournament = data;

		sender.sendRequest("ServeTournament", tournament, '127.0.0.1', 'GameFrontendServer', res, proxy);
	}


	app.all('/Tournaments', function (req, res){
	  var data = req.body;
	  data.queryFields = 'tournamentID buyIn goNext gameNameID players';

	  AsyncRender('DBServer', 'GetTournaments', res, {renderPage:'GetTournaments'}, data);
	});
	const GET_TOURNAMENTS_INFO = 4;

	app.get('/TournamentInfo', function (req, res){
	  var data = req.body;
	  data.query = {tournamentID:req.query.tID};
	  data.queryFields = 'tournamentID buyIn goNext gameNameID Prizes players status';
	  data.purpose = GET_TOURNAMENTS_INFO;  

	  AsyncRender('DBServer', 'GetTournaments', res, {renderPage:'TournamentInfo'}, data);
	});
}