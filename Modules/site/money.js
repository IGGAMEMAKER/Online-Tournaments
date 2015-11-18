module.exports = function(app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin, siteProxy){
	
	app.post('/Cashout', function (req, res){
	  MoneyTransferOperation(req, res, 'DecreaseMoney', 'Cashout');
	})

	function MoneyTransferOperation(req, res, operation, page){
	  if (isAuthenticated(req)){
	    var data = req.body;
	    var login = getLogin(req);
	    if (data && login){
	      data.login = login;
	    	
	    	var money=null;
	    	if (data.money && !isNaN(data.money) ) money = data.money;
	    	if (data.cash  && !isNaN(data.cash) ) money = data.cash;
	      if (money){
	      	data.money=money*100;
	      	data.cash =money*100;

		      siteProxy(res, operation,data,page,'DBServer');
		      return;
	      }

	    }
	  }
	  res.send(400);
	}

	app.post('/Deposit', function (req, res){
	  MoneyTransferOperation(req, res, 'IncreaseMoney', 'Deposit');
	})

	app.get('/Cashout', function (req, res){
	  //if (isAuthenticated(req))
	  res.render('Cashout');

	})
	app.get('/Deposit', function (req, res){
	  res.render('Deposit');
	})

}