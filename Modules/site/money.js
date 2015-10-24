module.exports = function(app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin, siteProxy){
	app.post('/Cashout', function (req, res){
	  //if (isAuthenticated(req))
	  /*var data = req.body;
	  var login = getLogin(req);
	  if (data && login!=0 ){
	    data.login = login;
	    siteProxy(res, 'Cashout',data,null,'MoneyServer');
	  }else{
	    res.send(400);
	  }*/
	  MoneyTransferOperation(req, res, 'Cashout');
	})

	function MoneyTransferOperation(req, res, operation){
	  if (isAuthenticated(req)){
	    var data = req.body;
	    var login = getLogin(req);
	    if (data && login){
	      data.login = login;
	      siteProxy(res, operation,data,null,'MoneyServer');
	      return;
	    }
	  }
	  //else
	  res.send(400);
	}

	app.post('/Deposit', function (req, res){
	  //if (isAuthenticated(req))
	  /*var data = req.body;
	  var login = getLogin(req);
	  if (data && login!=0 ){
	    data.login = login;
	    siteProxy(res, 'Deposit',data,null,'MoneyServer');
	  }else{
	    res.send(400);
	  }*/
	  MoneyTransferOperation(req, res, 'Deposit');

	})

	app.get('/Cashout', function (req, res){
	  //if (isAuthenticated(req))
	  res.render('Cashout');

	})
	app.get('/Deposit', function (req, res){
	  res.render('Deposit');
	})

}