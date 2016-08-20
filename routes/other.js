var express = require('express');
var router = express.Router();
var middlewares = require('../middlewares');
var respond = require('../middlewares/api-response');

var sender = require('../requestSender');

router.get('/getLogs', middlewares.isAdmin, sender.getLogs, function (req, res){
  // res.json({msg:'OK'})
  res.render('Logs', { time:req.time, msg:req.files })
}, function (err, req, res, next){
  res.json({err:err});
});

router.get('/getLogFile', middlewares.isAdmin, sender.getLogFile, function (req, res){
  // res.json({msg:'OK'})
  res.render('logViewer', { time:req.time, msg:req.file })
}, function (err, req, res, next){
  res.json({err:err});
});

