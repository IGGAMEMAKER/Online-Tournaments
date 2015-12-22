/*var express = require('express')
var multer  = require('multer')
//var upload = multer({ dest: 'uploads/' })
var uploading = multer({
  dest: __dirname + 'uploads/',
  limits: {fileSize: 1000000, files:1},
})

var app = express()*/
var express = require('express')
var app = express()
var multer  = require('multer')

var i=0;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-'+file.filename+'-' + i++)
  }
})

var upload = multer({ storage: storage })
/*var upload = multer({ dest: 'uploads/' })*/

app.set('views', '');
app.set('view engine', 'jade');


app.get('/upload', function (req, res){
	res.render('upload');
})
app.post('/upload', upload.single('image'), function (req, res, next) {
  // req.body contains the text fields
  console.log('upload')

  var tmp_path = req.file.path;
  console.log(tmp_path);
  /** The original name of the uploaded file
      stored in the variable "originalname". **/
  var target_path = 'uploads/gol_' + req.file.originalname;

	res.end(target_path);
})



/*app.post('/upload', uploading, function (req, res) {
	console.log('upload')
	res.end('OK');
})*/

server = app.listen(7000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});