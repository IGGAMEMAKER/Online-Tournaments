var app;
function setApp(APP){
  app=APP;
}

app.get('/AddGift', function (req, res){
  res.render('AddGift');
});

app.post('/AddGift', function (req, res){
  var data = req.body;
  Log(data,'Manual');
  if (data){
    sender.sendRequest('AddGift', data, '127.0.0.1', 'DBServer', res, function (error, response, body, res1){
          res.render('AddGift', {msg:body});
        });
  }
  else{
    Answer(res, Fail);
  }
  //sender.sendRequest('AddGift', data?data:{}, '127.0.0.1', 'FrontendServer', res, 
        
});

app.get('/ShowGifts', function (req, res){
  /*var data = req.body;
  if (!data){ data={}; }
  siteAnswer(res, 'ShowGifts', data, 'ShowGifts');*/
  AsyncRender('DBServer', 'ShowGifts', res, {renderPage:'ShowGifts'});
});

app.get('/GetGift', function (req, res){
  var data = req.body;
  var query = req.query;
  var giftID = query.giftID;
  if (query){
    //siteAnswer(res, 'gift')
    sender.sendRequest('GetGift', {giftID:giftID} , '127.0.0.1', 'DBServer', res, 
        function (error, response, body, res1){
          //res.send(body.result);
          if (error || !body || body.length ==0 || body.result =='fail'){
            Log(JSON.stringify(error));
            res.send(404);//'Gift does not exist');
          }
          else{
            res.render('gift', {message:body} );
          }
        });
  }
  else {
    res.json({msg:'err'});
  }
})

app.post('/GetGift', function (req, res){
  var data = req.body;
  if (data){
    sender.sendRequest('GetGift', data, '127.0.0.1', 'DBServer', res, 
        function (error, response, body, res1){
          //res.send(body.result);
          res.json(body);
        });
  }
  else {
    res.json({msg:'err'});
  }
})