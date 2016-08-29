var Money = require('../../models/money');

var middlewares = require('../../middlewares');

var respond = require('../../middlewares/api-response');
var Fail = {result: 'fail'};
var OK = {result: 'OK'};

var rp = require('request-promise');
var configs = require('../../configs');

var logger = require('../../helpers/logger');

var sender = require('../../requestSender');

var c = require('../../constants');

module.exports = function (app, aux) {
  app.post('/Cashout', middlewares.authenticated, function (req, res) {
    var data = req.body;
    var login = req.login;

    logger.log(login + " is trying to cashout " + JSON.stringify(data), "Money");

    var cardNumber = data.cardNumber;
    if (data.money && !isNaN(data.money)) money = data.money;
    if (data.cash && !isNaN(data.cash)) money = data.cash;

    // if (isNaN(cardNumber)){
    // 	return sender.Answer(res, Fail);
    // }

    if (money) {
      data.money = money * 100;
      data.cash = money * 100;

      var obj = {
        login,
        money,
        cardNumber
      };
      sender.sendRequest("CashoutRequest", obj, '127.0.0.1', "DBServer", res, function (error, body, response, res1) {
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
  });

  app.get('/setMoneyTo/:login/:ammount', middlewares.isAdmin, function (req, res){
    var login = req.params.login;
    var ammount = req.params.ammount;

    if (login && ammount && isNumeric(ammount) ){
      // console.log('constants', c);

      Money.set(login, ammount, c.SOURCE_TYPE_SET)
        .then(function (result){
          res.json({msg: 'grant', result:result})
        })
        .catch(function (err) {
          logger.error('/setMoneyTo/:login/:ammount', login, ammount, err);
          res.json({ err, text: 'set fail'});
        })

    } else {
      res.json({ msg: 'invalid data' })
    }
  });

  app.get('/giveMoneyTo/:login/:ammount', middlewares.isAdmin, function (req, res){
    var login = req.params.login;
    var ammount = req.params.ammount;

    if (login && ammount && isNumeric(ammount) ){
      // console.log('constants', c);

      Money.increase(login, ammount, c.SOURCE_TYPE_GRANT)
        .then(function (result){
          res.json({msg: 'grant', result:result});

          if (ammount > 0){
            aux.alert(login, c.NOTIFICATION_GIVE_MONEY, {
                ammount:ammount
              })
              .catch(aux.catcher);
          }

        })
        .catch(function (err) {
          logger.error('/giveMoneyTo/:login/:ammount', login, ammount, err);
          res.json({ err, text: 'give fail'});
        })

    } else {
      res.json({ msg: 'invalid data' })
    }
  });

  app.get('/api/transfers/mobile/all', middlewares.isAdmin, function (req, res, next) {
    // console.log('', Money.mobile)
    Money.mobile.all()
      .then(aux.setData(req, next))
      .catch(next)
  }, aux.list);

  app.get('/api/transfers/mobile/add/:payID/:ammount', middlewares.isAdmin, respond (req => {
    return Money.mobile.add(req.params.payID, req.params.ammount)
  }));

  function mobilePayment(req, res, next) {
    console.log('mobilePayment middleware');
    console.log('mobilePayment middleware', req.payment);
    // var payID = req.body.payID
    // var ammount = req.body.ammount;

    var login = req.payment.login;
    var payID = req.payment.payID;
    var ammount = req.payment.ammount;

    aux.done(login, 'mobile/mark', {payID: payID, ammount: ammount});

    Money.mobile.mark(payID, ammount, login)
      .then(function (result) {
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
    var payID = req.body.payID;
    var ammount = req.body.ammount;

    req.payment = {
      login: req.login,
      payID,
      ammount
    };
    next();
  }, mobilePayment, aux.render('Transfers'), aux.error);

  app.get('/api/transfers/mobile/markAdmin/:payID/:ammount/:login', middlewares.isAdmin, function (req, res, next) {
    var login = req.params.login;
    var payID = req.params.payID;
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
    var login = req.login;
    var payID = req.params.payID;
    var ammount = req.params.ammount;

    req.payment = {
      login: login,
      payID: payID,
      ammount: ammount
    };
    next()
  }, mobilePayment, aux.render('Transfers'), aux.error);

  app.get('/api/transfers/all', middlewares.isAdmin, function (req, res, next) {
    Money.all()

      .then(aux.setData(req, next))
      .catch(next)
  }, aux.render('Transfers'), aux.err);


  app.get('/api/transfers/recent/:period', middlewares.isAdmin, function (req, res, next) {
    var period = parseInt(req.params.period) || 0;
    //0 - daily
    //1 - yesterday
    //2 - monthly
    Money.standardPeriod(period)

      .then(aux.setData(req, next))
      .catch(next)
  }, aux.render('Transfers'), aux.err);

  app.post('/yandexPayment', function (req, res) {
    var data = req.body;

    res.end('OK');

    var login = data.label;
    var money = Math.round(parseInt(data.withdraw_amount));
    /*var money = parseInt(data.amount)/76;

     money= money*100;*/
    console.log('yandexPayment', data);
    logger.log("Money yandexPayment " + JSON.stringify(data), "Money");
    logger.log("payment from " + login + ": " + money + "p", "Money");

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
  });

  app.get('/api/payments/all', middlewares.isAdmin, respond (req => {
    return Money.payments()
  }));
  //render('List'), aux.err

  app.get('/api/payments/all/list', middlewares.isAdmin, function (req, res, next) {
    Money.payments()
      .then(aux.setData(req, next))
      .catch(next)
  }, aux.render('List'), aux.err);

  app.post('/PAY', aux.authenticated, function (req, res, next) {
    var login = req.login;
    var ammount = req.body.ammount || 100;
    var phone = req.body.phone;//"79261000000"

    var mixplat = configs.mixplat;
    var isTest = mixplat.isTest || 0;
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
  });


  app.post('/payment/checkID', function (req, res) {
    //res.render('payResult');

    var data = req.body;
    var login = data.PAYSTO_PAYER_ID;

    logger.log("app.post('/payment/checkID'", data);
    res.end('YES');
  })
};
