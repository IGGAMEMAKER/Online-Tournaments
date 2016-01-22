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

	app.get('/payOK', function (req, res){
		res.render('payOK');
	})

	app.get('/payFail', function (req, res){
		res.render('payFail');
	})

	var PAY_OK='YES';
	var PAY_NO='NO';

	app.post('/payment/new', function (req, res){
		//res.render('payResult');
		var data = req.body;
		console.error('payment come!!');
		console.error(data);
		res.end('YES');
	})



	app.post('/payment/checkID', function (req, res){
		//res.render('payResult');

		var data = req.body;
		var login = data.PAYSTO_PAYER_ID;
		/*sender.sendRequest('userExists', {userID:login}, '127.0.0.1', "DBServer", res, function (error, body, response, res1){
			if (error) { 
				res.end(PAY_NO);
				console.error('fail while user ', login, ' tries to pay. payment/checkID', error);
			} else {
				if (body){

				}
			}
		})*/
		console.error('user exists?');
		console.error(data);
		res.end('YES');
	})

}