var Leaderboard=null;

app.get('/giveMarathonMoney', aux.isAdmin, function (req, res){
  var leaders = Leaderboard.leaderboard;
  var prizes = Leaderboard.prizes || [];
  var counts = Leaderboard.counts || [];

  var prizeList = getPrizeList(prizes, counts);
  for (var i=0; i<prizeList.length;i++) {
    var lgn = leaders[i].login;
    var count = leaders[i].played;
    var points = leaders[i].points;
    var prize = prizeByPlace(i, prizeList);

    increase_money_and_notify(lgn, parseInt(prize))
  }
  res.json({msg: Leaderboard })
})

app.get('/givePointsTo/:login/:points', isAdmin, function (req, res, next){
  var login = req.params.login;
  var points = parseInt(req.params.points);

  Marathon.giveNpoints(login, points)
    .then(aux.setData(req, next))
    .catch(next)
}, aux.std);


app.get('/giveAcceleratorTo/:login/:accelerator', isAdmin, function (req, res){
  var login = req.params.login;
  var accelerator = req.params.accelerator;

  if (login && accelerator && isNumeric(accelerator) ){
    // console.log('constants', c);

    Marathon.grant_accelerator(login, accelerator)
      .then(function (result){
        res.json({msg: 'grant', result:result})

        aux.alert(login, c.NOTIFICATION_GIVE_ACCELERATOR, { index:accelerator })
          .catch(aux.catcher)

        // Message.notifications.personal(login, 'Лови бонус!', {
        //   type: c.NOTIFICATION_GIVE_ACCELERATOR,
        //   body:'Набирайте очки быстрее с помощью ускорителя',
        //   index:accelerator
        // })
        // .then(function(){
        //   forceTakingNews(login)
        // })
        // .catch(console.error)

      })
      .catch(function (err) {
        cancel(res, err, 'grant fail');
      })

  } else {
    cancel(res);
  }
})

app.get('/api/mini-rating', function (req, res){
  res.json({
    leaderboard: activity_board,
    counts: leaderboard_min.counts,
    prizes: leaderboard_min.prizes
  })
})

app.post('/getMoney/:index', aux.authenticated, function (req, res){
  // var login = aux.getLogin(req)
  var login = req.login;
  var index = parseInt(req.params.index);
  res.end('');

  // Marathon.getMarathonUser(login)
  var marathonUser = getMarathonUser(login);
  // .then(function (marathonUser){
  var points = marathonUser.points;

  var has = has_enough_points(index, points);
  var money = has.money;
  var discount = has.discount;
  if (money>0){
    Marathon.giveNpoints(login, -discount)
      .then(function (result){
        if (result){
          // Marathon.increase_money_and_notify(login, money)
          increase_money_and_notify(login, money)
        }
      })
  }
  // })
})

app.get('/Leaderboard', function (req, res){
  res.render('Leaderboard', { msg: Leaderboard });
});


updateLeaderboard();

var MarathonPlaces = {
  // 'Raja': {
  //   points: 3,
  //   place: 10,
  //   accelerator: 7,
  //   pretends: 34
  // }
  // places : {},
  // prizes : {}
};

// setTimeout(function (){
//   var marathonUser = getMarathonUser('Raja');
//   // marathonUser.mainPrize = 100500;

//   aux.alert('Raja', c.NOTIFICATION_MARATHON_CURRENT, marathonUser)

// }, 4000);


// login => marathonUser

// login => place
// login => prize

function prizeByPlace(place, prizeList){
  if (place>=prizeList.length) return 0;

  return prizeList[place];
}
function updatePlaces(){

  var leaders = Leaderboard.leaderboard;
  // console.log('updatePlaces', leaders.length);
  var prizes = Leaderboard.prizes|| [];
  var counts = Leaderboard.counts|| [];

  var prizeList = getPrizeList(prizes, counts);

  var obj = {}

  for (var i=0; i<leaders.length; i++){
    try{
      var login = leaders[i].login;
      // console.log(login);
      var count = leaders[i].played;
      var points = leaders[i].points;
      var prize = prizeByPlace(i, prizeList);
      var number = i+1; //place

      // console.log(login, count, points, prize, number);

      var acceleratorValue = 1;
      if (leaders[i].accelerator && leaders[i].accelerator.value){
        acceleratorValue = leaders[i].accelerator.value;
      }

      obj[login] = {
        points: points,
        place: number,
        accelerator: acceleratorValue,
        mainPrize:prizes[0]
      }
      if (prize) obj.pretends = prize;
      // pretends: 34
      // if (prizes.length && counts.length && )
    } catch(error){
      console.error(error);
    }
  }
  // console.log(obj);
  // return MarathonPlaces;
  return obj;
}

const DEFAULT_MARATHON_PRIZE = 100;

function getPrizeList(prizes, counts){
  if (prizes.length==0 || counts.length==0){
    return [DEFAULT_MARATHON_PRIZE];
  }

  var prizeList = [];
  for (var i = 0; i < prizes.length; i++) {
    var prize = prizes[i];

    for (var j = 0; j < counts[i]; j++) {
      prizeList.push(prize);
    };
  };
  // console.log('prizeList', prizeList);
  return prizeList;
}

function updateLeaderboard(){

  setInterval(function(){
    Marathon.leaderboard()
      .then(function (leaderboard){
        Leaderboard = {
          leaderboard:leaderboard,
          counts: leaderboard.counts,
          prizes: leaderboard.prizes
        }

        MarathonPlaces = updatePlaces();
      })
      .catch(function (err){
        Errors.add('', 'updateLeaderboard', { err:err });
      })

  }, 3000)

}


function getShortActivityBoard(leaderboard){
  var short_activity_board=[];
  for (var i=0; (i<leaderboard.length) && (i<10); i++ ){
    short_activity_board.push(leaderboard[i]);
  }
  return short_activity_board;
}

var leaderboard_min={};

var activity_board;


function has_enough_points(index, points){
  if (points < 600) return { money:0, discount:0 };

  if (points < 1000) return { money:5, discount:600 };
  if (points < 5000) return { money:10, discount:1000 };
  if (points < 15000) return { money:50, discount:5000 };
  if (points < 50000) return { money:150, discount:15000 };
  if (points < 100000) return { money:500, discount:50000 };

  return { money:1000, discount:points };
}


function getMarathonUser(login){
  return MarathonPlaces[login];
  // return {
  //   points: 3,
  //   place: 10,
  //   accelerator: 7,
  //   pretends: 34
  // }
}


app.get('/Marathon', function (req, res){ res.render('Marathon'); })

app.get('/MarathonInfo', isAdmin, function (req, res){
  Marathon.get_current_marathon()
    .then(function (marathon){
      if (marathon){
        res.render('admin/MarathonInfo', {msg: marathon});
      } else {
        res.render('admin/MarathonInfo', {msg: null});
      }
    })
})



app.get('/api/marathon/:MarathonID', aux.isAdmin, function (req, res, next){
  var MarathonID = req.params.MarathonID;
  Marathon.get(MarathonID)
    // .then(aux.setData(req, next))
    .then((d) => { req.data = d; next(); })
    .catch(next)
}, aux.std)

app.get('/Marathon/setFinishDate/:MarathonID/:date', aux.isAdmin, function (req, res){
  var MarathonID = req.params.MarathonID;
  var date = req.params.date;

  var data = {
    finishDate: new Date(date)
  }
  Marathon.edit(data||null, MarathonID)
    .then(function (result){
      // console.log('edit done');
      res.json({result:result});
    })
    .catch(function (error){
      res.json({error:error});
    })
})

app.post('/Marathon/edit/:MarathonID', isAdmin, function (req, res){
  var MarathonID = req.params.MarathonID;
  var data = req.body||null;
  if (MarathonID && !isNaN(MarathonID)){
    if (data){
      if (data.accelerators) { data.accelerators = JSON.parse(data.accelerators); }
      if (data.prizes) { data.prizes = JSON.parse(data.prizes); }
      if (data.counts) { data.counts = JSON.parse(data.counts); }

    } else {
      return res.json({result: 'no changes'});
    }
    Marathon.edit(data, MarathonID)
      .then(function (result){
        if (result){
          res.redirect('/MarathonInfo');
        } else {
          res.json({result:result});
          //res.end('fail. <a href="MarathonInfo"> go back');
        }
      })
      .catch(function (err){
        res.json({result:'fail', error: err });
      })
  } else {
    res.json({result:'INVALID MarathonID' });
  }

})


app.post('/Marathon/new', isAdmin, function (req, res){
  var data = req.body;

  Marathon.add()
    .then(function(marathon){
      // console.log('added', marathon);
      return Marathon.edit(data||null, marathon.MarathonID);
    })
    .then(function (result){
      // console.log('edit done');
      res.json({result:result});
    })
    .catch(function (error){
      res.json({error:error});
    })
})

// Middleware
function getAcceleratorsAndMarathon(req, res, next){
  var accelerator = req.params.accelerator||null;
  if (accelerator && !isNaN(accelerator)){
    req.accelerator = accelerator;
    Marathon.get_or_reject()
      .then(function (marathon){
        req.marathon = marathon;
        next()
      })
      .catch(function (err){
        next(err);
      })
  } else {
    // next(null);
    // res.json({result:0, code:CODE_INVALID_DATA});
    req.accelerator=null;
    req.marathon=null;
    next()
  }
}

app.get('/buyAccelerator/:accelerator', middlewares.authenticated, getAcceleratorsAndMarathon, function (req, res){
  var login = getLogin(req);
  var index = req.accelerator;
  var marathon = req.marathon;
  var price;
  // console.log(index, marathon);
  if (index && marathon && marathon.accelerators[index]){
    price = marathon.accelerators[index].price;
    // need price of accelerator
    return Money.pay(login, price, c.SOURCE_TYPE_ACCELERATOR_BUY)
      .then(function (result){
        // if (!result) return null;
        console.error('Money.pay', result, login, index);
        return Marathon.sell_accelerator(login, index);
      })
      .then(function (result){
        // if (result){
        // }
        console.log('marathon.sell_accelerator', result);
        Actions.add(login, 'buyAccelerator', {accelerator:index})

        res.json({ result:result });
      })
      .catch(function (err){
        Errors.add(login, 'buyAccelerator', { err:err, accelerator:index })
        res.json({ err:err, pay:price||0 })
      })
  } else {
    Errors.add(login, 'buyAccelerator', { err:'invalid data', accelerator:index })
    res.json({ err:null })
    // cancel(res);
    // res.json({result:0, code:CODE_INVALID_DATA});
  }
})


app.get('/getMyPoints', function (req, res){
  // console.log('/getMyPoints')
  // var login = aux.getLogin(req);
  var login = req.login;
  var points = 0;

  if (login) {
    var marathonUser = getMarathonUser(login);
    points = marathonUser.points;
  }
  res.json({points: points});
})