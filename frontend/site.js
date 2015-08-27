var express         = require('express');
var path            = require('path'); // модуль для парсинга пути

var parseurl = require('parseurl');

var jade = require('jade');

var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
//var Restraunt = mongoose.model('Restraunt', { name: String, description: String, photoURL: String });


app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'jade');

var sender = require('./requestSender');
var proc = require('./test');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
/*app.get('/', function (req, res) {
  res.send('Hello World!');
});*/

app.all('*', function (req, res){
  console.log(req.url);
  var data = req.body;

  /*var url = req.url;
  console.log(url);

  //url = url.substr(1);
  
  //if (url.indexOf("?")>-1){
  //  url = url.substr(0,url.indexOf("?"));
  //}

  if (url!='/favicon.ico'){
    console.log(url);
    console.log(req.params);
    var pathname = parseurl(req).pathname;
    pathname = pathname.substr(1);
    console.log('pathname :'+ pathname);
    url = pathname;
  }*/

  var url = (parseurl(req).pathname).substr(1);

  console.log(url);
  var FSUrl = url;
  switch(url){
    case 'Tournaments':
      url = FSUrl = 'GetTournaments';
      data.queryFields = 'tournamentID buyIn goNext gameNameID';
    break;
    case 'TournamentInfo':
      FSUrl = 'GetTournaments';
      console.log(req.query);
      data.query = {tournamentID:req.query.tID};
      data.queryFields = 'tournamentID buyIn goNext gameNameID';
      console.log('Logging');
      console.log(data.query);
    break;
    case 'favicon.ico':
      res.json({ result:'fucken favicon'});
      //sender.Answer(res, { result:'fucken favicon'});
    break;
  }

  if (url!='favicon.ico'){
    //console.log(req);
    console.log('req to FrontendServer: ' + FSUrl);
    console.log(data);
    sender.sendRequest(FSUrl, data, '127.0.0.1', 
      proc.getPort('FrontendServer'), res, function (error, response, body, res1){

        if (!error){
          var msg = getData(body, url, req);
          //console.log(JSON.stringify(msg));
          //switch (url) {case 'TournamentInfo': url = 'TournamentInfo'; console.log('ssss'); break;}

          console.log('Trying to get url ' + url);
          if (url!='Alive'){
            res1.render(url, { title: 'Hey', message: msg});//JSON.stringify()})
          }
          else{
            res.json(msg);
          }
        } else{
          sender.Answer(res, { result:'fucken favicon'});
        }
      });
  }

  //res.render('page1', { title: 'Hey', message: url});
})

function getData(body,url, req){
  console.log('getData: ' + url);
  var obj = body;
  switch (url){
    case 'GetTournaments':
      obj.queryFields = 'id buyIn goNext gameNameID';
      for (i=0;i<body.length;i++){
        
      }
      console.log(body.length);
    break;
    case 'TournamentInfo':
    console.log('TournamentInfo ' + body.length);
    obj.query = {TournamentID:2};
    obj.queryFields = 'id buyIn goNext gameNameID';
      /*for (i=0;i<body.length;i++){
        
      }*/
      /*console.log(body.length);
      obj.query= {};// { _id:'55d8e26d5e611a42512a21e4'};
      obj.queryFields = 'id buyIn goNext gameNameID';*/
      
      /*if (req.params) {console.log(req.params.tID);}
      console.log(1111);
      if (req.param) {console.log(req.param.tID);}*/
    break;
  }
  return obj;
}

/*function showPage (error, response, body, res){
  res.render('page1', { title: 'Hey', message: url})
}*/


/*
app.get('/', function (req, res) {

  res.render('page2', { title: 'Hey', message: 'Hello there!'});

});

app.all('/showRestraunts', function (req, res) {
  var restrs = Restraunt.find({}, 'id name description photoURL', function (err, restraunts) {
    
    if (err) return handleError(err);
    //console.log('%s %s is a %s.', restraunt, person.name.last, person.occupation) // Space Ghost is a talk show host.
    console.log(restraunts);
    
    res.render('showRestraunts', { restraunts: restraunts});
  } );
  


});
app.get('/showRestraunt', function (req, res) {
  var restrauntID = req.param('id');
  showRestraunt(res, restrauntID);
  //res.render('showRestraunt', { title: 'Hey', message: 'Hello there!'});

});

//function showRestrauntHandler(err, restraunt)
function handleError(err){
  console.log(err);
}


function showRestraunt( res, restrauntID){
  var restr = Restraunt.findOne({name:restrauntID}, 'id name description photoURL', function (err, restraunt) {
    if (err) return handleError(err);
    //console.log('%s %s is a %s.', restraunt, person.name.last, person.occupation) // Space Ghost is a talk show host.
    console.log(restraunt);
    res.render('showRestraunt', { id:restraunt.id, 
      name: restraunt.name, 
      description: restraunt.description, 
      photoURL:restraunt.photoURL});
  } );
  //res.render('showRestraunt')
}

app.post('/addRestraunt', function (req, res) {
  console.log('post');
  var name = req.body.name,
      description = req.body.photoDescription,
      photoURL = req.body.photoURL;
  console.log(name);
  console.log(description);
  console.log(photoURL);

  var restraunt = new Restraunt({ name: name , description: description, photoURL: photoURL});
  restraunt.save(function (err) {
  if (err){
    console.log(err);
    res.render('err', { err: err} );
  }
  else{
    showRestraunt(res, name);
    console.log('added restraunt'); 
  }
  });




});
app.get('/addRestraunt', function (req, res) {
  console.log('GET');
  res.render('addRestraunt', { title: 'Hey', message: 'Hello there!'});

});*/


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});





/*
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
});

var kittySchema = mongoose.Schema({
    name: String
});
var Kitten = mongoose.model('Kitten', kittySchema);

var silence = new Kitten({ name: 'Silence' });
console.log(silence.name); // 'Silence'

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
}

var Kitten = mongoose.model('Kitten', kittySchema);
var fluffy = new Kitten({ name: 'fluffy' });
fluffy.speak(); // "Meow name is fluffy"

fluffy.save(function (err, fluffy) {
  if (err) return console.error(err);
  fluffy.speak();
});

Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
})

Kitten.find({ name: /^Fluff/ }, callback);*/

//app.use(express.favicon()); // отдаем стандартную фавиконку, можем здесь же свою задать
/*app.use(express.logger('dev')); // выводим все запросы со статусами в консоль
app.use(express.bodyParser()); // стандартный модуль, для парсинга JSON в запросах
app.use(express.methodOverride()); // поддержка put и delete
app.use(app.router); // модуль для простого задания обработчиков путей
app.use(express.static(path.join(__dirname, "public"))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)
*/

/*
app.get('/api', function (req, res) {
    //res.send('API is running');
    res.json({a:123, b:195});
});

app.listen(1337, function(){
    console.log('Express server listening on port 1337');
});*/

/*var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');


var Cat = mongoose.model('Cat', { name: String, type: String });

var kitty = new Cat({ name: 'Jesper' , type: 'male'});
kitty.save(function (err) {
  if (err){
    console.log('meow');
    console.log(err);
  }
  else{
    console.log('meow2'); 
  }
});*/