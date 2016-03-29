module.exports = function(app, AsyncRender, Answer, sender, Log, isAuthenticated, getLogin, siteProxy, aux){
	var Money = require('../../models/money')

	var Fail = { result:'fail' };
	var OK = { result: 'OK' };

	/*app.post('/Cashout', function (req, res){
	  MoneyTransferOperation(req, res, 'DecreaseMoney', 'Cashout');
	})*/
	app.post('/Cashout', function (req, res){
		var data = req.body;
		Log("trying to cashout " + JSON.stringify(data), "Money");
		if (isAuthenticated(req)){
			var login = getLogin(req);
			var cardNumber = data.cardNumber;
			if (data.money && !isNaN(data.money) ) money = data.money;
			if (data.cash  && !isNaN(data.cash) ) money = data.cash;

			// if (isNaN(cardNumber)){
			// 	return sender.Answer(res, Fail);
			// }
			
			if (money){
				data.money=money*100;
				data.cash =money*100;

			  //siteProxy(res, operation,data,page,'DBServer');
				sender.sendRequest("CashoutRequest", {login:login, money:money, cardNumber:cardNumber}, '127.0.0.1', "DBServer", res, 
					function (error, body, response, res1){
						if (error) {
							console.error("CashoutRequest error", error);
							return sender.Answer(res, Fail);
						}
						if (body) return sender.Answer(res, body);
						sender.Answer(res, Fail);
					});
			} else {
				return sender.Answer(res, Fail);
			}
		} else{
			return sender.Answer(res, Fail);
		}
	});

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

	app.get('/api_transfers_all', aux.isAdmin, function (req, res, next){
		Money.all()

		.then(aux.setData(req, next))
		.catch(next)
	}, aux.render('Transfers'), aux.err)

	app.get('/api_transfers_recent', aux.isAdmin, function (req, res, next){
		// var since = req.query.since||null;
		// var till = req.query.till|| new Date()
		// console.log(req.query);

		var period = parseInt(req.query.period) || 0;
		//0 - daily
		//1 - yesterday
		//2 - monthly
		Money.standardPeriod(period)

		.then(aux.setData(req, next))
		.catch(next)
	}, aux.render('Transfers'), aux.err)

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

	app.post('/yandexPayment', function (req, res){
		var data = req.body;

		res.end('OK');

		var login = data.label;
		var money = Math.round(parseInt(data.amount));
		/*var money = parseInt(data.amount)/76;

		money= money*100;*/
		Log("Money yandexPayment " + JSON.stringify(data), "Money");
		Log("payment from " + login + ": " + money + "p", "Money");
		sender.sendRequest("payment", { login:login, cash:money, info:data }, '127.0.0.1', "DBServer");
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
		//console.error('payment come!!');
		//console.error(data);
		res.end('YES');
		//sender.sendRequest("IncreaseMoney", {login:data.login, money: data.})

		//MoneyTransferOperation(req, res, 'IncreaseMoney', 'Deposit');
		//sender.sendRequest()
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
		//console.error('user exists?');
		//console.error(data);
		res.end('YES');
	})

}