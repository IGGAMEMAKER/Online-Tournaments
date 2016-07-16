module.exports = function (app, Answer, sender, Log, isAuthenticated, getLogin, siteProxy, aux) {
  var Money = require('../../models/money')

  var Fail = {result: 'fail'};
  var OK = {result: 'OK'};

  var rp = require('request-promise');
  var configs = require('../../configs')

  /*app.post('/Cashout', function (req, res){
   MoneyTransferOperation(req, res, 'DecreaseMoney', 'Cashout');
   })*/
  app.post('/Cashout', function (req, res) {
    var data = req.body;
    Log("trying to cashout " + JSON.stringify(data), "Money");
    if (isAuthenticated(req)) {
      var login = getLogin(req);
      var cardNumber = data.cardNumber;
      if (data.money && !isNaN(data.money)) money = data.money;
      if (data.cash && !isNaN(data.cash)) money = data.cash;

      // if (isNaN(cardNumber)){
      // 	return sender.Answer(res, Fail);
      // }

      if (money) {
        data.money = money * 100;
        data.cash = money * 100;

        //siteProxy(res, operation,data,page,'DBServer');
        sender.sendRequest("CashoutRequest", {
            login: login,
            money: money,
            cardNumber: cardNumber
          }, '127.0.0.1', "DBServer", res,
          function (error, body, response, res1) {
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
    } else {
      return sender.Answer(res, Fail);
    }
  });

  function MoneyTransferOperation(req, res, operation, page) {
    if (isAuthenticated(req)) {
      var data = req.body;
      var login = getLogin(req);
      if (data && login) {
        data.login = login;

        var money = null;
        if (data.money && !isNaN(data.money)) money = data.money;
        if (data.cash && !isNaN(data.cash)) money = data.cash;
        if (money) {
          data.money = money * 100;
          data.cash = money * 100;

          siteProxy(res, operation, data, page, 'DBServer');
          return;
        }

      }
    }
    res.send(400);
  }

  app.get('/api/transfers/mobile/all', aux.isAdmin, function (req, res, next) {
    // console.log('', Money.mobile)
    Money.mobile.all()
      .then(aux.setData(req, next))
      .catch(next)
  }, aux.list)

  app.get('/api/transfers/mobile/add/:payID/:ammount', aux.isAdmin, function (req, res, next) {
    Money.mobile.add(req.params.payID, req.params.ammount)
      .then(aux.setData(req, next))
      .catch(next)
  }, aux.std)

  function mobilePayment(req, res, next) {
    console.log('mobilePayment middleware')
    console.log('mobilePayment middleware', req.payment)
    // var login = aux.getLogin(req);
    // var payID = req.body.payID
    // var ammount = req.body.ammount;

    var login = req.payment.login;
    var payID = req.payment.payID
    var ammount = req.payment.ammount;

    aux.done(login, 'mobile/mark', {payID: payID, ammount: ammount})

    Money.mobile.mark(payID, ammount, login)
      // .then(aux.setData(req, next))
      .then(function (result) {
        // aux.notify(login, )
        console.log('marked,', result);
        if (result) {
          Money.increase(login, parseInt(ammount), aux.c.SOURCE_TYPE_DEPOSIT);
          return res.redirect('/payOK');
        }
        aux.fail(login, 'mobile/mark', {payID, ammount});
        return res.redirect('/payFail');
      })
      .catch(function (err) {
        aux.fail(login, 'mobile/mark', {payID, ammount, error: err});
        console.log(err);
        res.redirect('/payFail')
      })
  }

  app.post('/api/transfers/mobile/mark/form', aux.authenticated, function (req, res, next) {
    // var login = aux.getLogin(req);
    var login = req.login;
    var payID = req.body.payID
    var ammount = req.body.ammount;

    req.payment = {
      login: login,
      payID: payID,
      ammount: ammount
    }
    next();
  }, mobilePayment, aux.render('Transfers'), aux.error)

  app.get('/api/transfers/mobile/markAdmin/:payID/:ammount/:login', aux.isAdmin, function (req, res, next) {
    var login = req.params.login;
    var payID = req.params.payID
    var ammount = req.params.ammount;
    console.log(login, payID, ammount, 'markAdmin');
    req.payment = {
      login,
      payID,
      ammount
    };
    next();
  }, mobilePayment, aux.render('Transfers'), aux.error);

  app.get('/api/transfers/mobile/mark/:payID/:ammount', aux.authenticated, function (req, res, next) {
    // var login = aux.getLogin(req);
    var login = req.login;
    var payID = req.params.payID
    var ammount = req.params.ammount;

    req.payment = {
      login: login,
      payID: payID,
      ammount: ammount
    }
    next()
  }, mobilePayment, aux.render('Transfers'), aux.error)

  app.get('/api/transfers/all', aux.isAdmin, function (req, res, next) {
    Money.all()

      .then(aux.setData(req, next))
      .catch(next)
  }, aux.render('Transfers'), aux.err)


  app.get('/api/transfers/recent/:period', aux.isAdmin, function (req, res, next) {
    var period = parseInt(req.params.period) || 0;
    //0 - daily
    //1 - yesterday
    //2 - monthly
    Money.standardPeriod(period)

      .then(aux.setData(req, next))
      .catch(next)
  }, aux.render('Transfers'), aux.err);

  app.post('/Deposit', aux.isAdmin, function (req, res) {
    MoneyTransferOperation(req, res, 'IncreaseMoney', 'Deposit');
  });

  app.get('/Cashout', aux.isAdmin, function (req, res) {
    res.render('Cashout');
  });
  app.get('/Deposit', function (req, res) {
    res.render('Deposit');
  });

  app.post('/yandexPayment', function (req, res) {
    var data = req.body;

    res.end('OK');

    var login = data.label;
    var money = Math.round(parseInt(data.withdraw_amount));
    /*var money = parseInt(data.amount)/76;

     money= money*100;*/
    console.log('yandexPayment', data);
    Log("Money yandexPayment " + JSON.stringify(data), "Money");
    Log("payment from " + login + ": " + money + "p", "Money");

    Money.savePayment(data)
      .then(function (result) {
        var obj = {result, data};

        aux.done(login, 'DEPOSIT', obj);
        return Money.increase(login, money, aux.c.SOURCE_TYPE_DEPOSIT)
          .then(function (result) {
            console.log('Money.increase yandexPayment', login, money, result)
          });
      })
      .catch(aux.report('yandexPayment', data));

    // sender.sendRequest("payment", { login:login, cash:money, info:data }, '127.0.0.1', "DBServer");
  });

  app.get('/api/payments/all', aux.isAdmin, function (req, res, next) {
    Money.payments()
      .then(aux.setData(req, next))
      .catch(next)
  }, aux.std); //render('List'), aux.err

  app.get('/api/payments/all/list', aux.isAdmin, function (req, res, next) {
    Money.payments()
      .then(aux.setData(req, next))
      .catch(next)
  }, aux.render('List'), aux.err);

  app.post('/PAY', aux.authenticated, function (req, res, next) {
    // var login = aux.getLogin(req);
    var login = req.login;
    var ammount = req.body.ammount || 100;
    var phone = req.body.phone;//"79261000000"

    var mixplat = configs.mixplat;
    var isTest = mixplat.isTest || 0
    // var signature =
    var options = {
      method: 'POST',
      uri: 'https://api.mixplat.com/mc/create_payment',
      body: {
        "service_id": mixplat.id,
        "phone": phone,
        "amount": ammount,
        "currency": "RUB",
        "signature": signature,
        "description": "Пополнение счёта на сайте online-tournaments.org",
        "external_id": "ORDER142555",
        "success_message": "Спасибо за оплату! Для доступа используйте пароль x4md59",
        "custom_data": "userid=" + login + ",trxid=144288534233",
        "test": isTest
      },
      json: true // Automatically stringifies the body to JSON
    };

    rp(options)
      .then(function (parsedBody) {
        // POST succeeded...
      })
      .catch(function (err) {
        // POST failed...
      });
    // request('https://api.mixplat.com/mc/create_payment')
  });

  app.post('/payment/mixplat', function (req, res) {

  });

  app.get('/payOK', function (req, res) {
    res.render('payOK');
  });

  app.get('/payFail', function (req, res) {
    res.render('payFail');
  });

  var PAY_OK = 'YES';
  var PAY_NO = 'NO';

  app.post('/payment/new', function (req, res) {
    //res.render('payResult');
    var data = req.body;
    //console.error('payment come!!');
    //console.error(data);
    res.end('YES');
    //sender.sendRequest("IncreaseMoney", {login:data.login, money: data.})

    //MoneyTransferOperation(req, res, 'IncreaseMoney', 'Deposit');
    //sender.sendRequest()
  });


  app.post('/payment/checkID', function (req, res) {
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

};