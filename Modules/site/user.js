module.exports = function(app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin){
	app.get('/Logout', function (req, res){
	  req.session.destroy(function (err){
	    if (err){ console.log('Session destroying error:' + err);}
	  });
	  res.render('Login',{});
	});

	app.get('/Login', function (req, res){
	  res.render('Login',{});
	})

	function LoginOrRegister(req, res, command){
	    var data = req.body;
	  
	  if (data && data.login && data.password) {
	    var callback = function(res, body, options, parameters){
	      Log(command + ' user ' + data.login, 'Users');
	      req.session.login = data.login;
	      res.redirect('Tournaments');
	    }
	    var failCallback = function(res, body, options, parameters){
	      Log('Reject user ' + data.login,'Users');
	      res.render(command,{err:body.result});
	    }
	    AsyncRender('DBServer', command, res, { callback:callback, failCallback:failCallback }, data );
	    return;
	  }
	  res.render(command, Fail );
	}

	app.post('/Login', function (req, res){
	  /*var data = req.body;
	  Log('User ' + data.login + ' tries to log')
	  console.log('Login: ' + data.login);
	  console.log('Pass: ' + data.password);*/
	  //res.redirect('Tournaments');
	  
	  /*if (data && data.login && data.password) {
	    data.callback = function(res, body, options){
	      Log('Log user ' + data.login, 'Users');
	      req.session.login = data.login;
	      res.redirect('Tournaments');
	    }
	    data.failCallback = function(res, body, options){
	      Log('Reject user ' + data.login,'Users');
	      res.render('Login',{err:body.result});
	    }
	    AsyncRender('FrontendServer', 'Login', res, data );
	    return;
	  }
	  res.render('Login', Fail );*/
	  LoginOrRegister(req, res, 'Login');
	  /*sender.expressSendRequest('Login', data?data:{}, '127.0.0.1', 
	        'FrontendServer', res, 
	        function (error, response, body, res1){
	          if (error){
	            console.log('error :' + JSON.stringify(error));
	          }else{
	            switch (body.result){
	              case 'OK':
	                req.session.login = data.login;
	                res.redirect('Tournaments');
	              break;
	              default:
	                res.render('Login',{err:body.result});
	              break;
	            }
	          }
	        }
	  );*/});

	app.post('/Register', function (req, res){
	  LoginOrRegister(req, res, 'Register');
	  /*var data = req.body;
	  console.log('Login: ' + data.login);
	  console.log('Pass: ' + data.password);
	  //res.redirect('Tournaments');
	  
	  sender.sendRequest('Register', data?data:{}, '127.0.0.1', 
	        'FrontendServer', res, 
	        function (error, response, body, res1){
	          switch (body.result){
	            case 'OK':
	              req.session.login = data.login;
	              res.redirect('Tournaments');
	            break;
	            default:
	              res.render('Register',{err:body.result});
	            break;
	          }
	        }
	  );*/
	});

	app.get('/Register', function (req, res){
	  res.render('Register');
	})


	function regManager(command, req, res){
	  var data = req.body;
	  console.log(data.login);
	  console.log(data.tournamentID);

	  if (isAuthenticated(req)){
	    AsyncRender('TournamentServer', command, res, null,  data);
	    /*sender.sendRequest(command, data?data:{}, '127.0.0.1', 'FrontendServer', res, 
	      function (error, response, body, res1){
	        res.send(body.result);
	      });*/
	  }
	  else{
	    sender.Answer(res, {result:'auth'});
	  }
	}


	app.post('/CancelRegister', function (req, res){
	  regManager('CancelRegister',req, res);
	})
	app.post('/RegisterInTournament', function (req, res){
	  regManager('RegisterUserInTournament',req, res);
	  //console.log('WRITE Socket emitter!!!')
	})

	app.get('/Profile', function (req, res){
	  var login = 'Alvaro_Fernandez';
	  if (isAuthenticated(req) ){//req.session && req.session.login
	    login = getLogin(req);
	    AsyncRender("DBServer", 'GetUserProfileInfo', res, {renderPage:'Profile'}, {login:login} );
	    return;
	  }
	  res.json({msg:'Log in first'});
	  //else{
	  //}
	  //siteAnswer(res, 'GetUserProfileInfo', {login:login}, 'Profile');
	})
}