/**
 * Created by gaginho on 04.06.16.
 */
var express = require('express');
var app = express();

var api = require('../helpers/api-on-modules');

// var configs = require('./../configs');

var logger = console.log;

var server = app.listen(9000, function () {
  var host = server.address().address;
  var port = server.address().port;

  logger('Example app listening at http://%s:%s', host, port);
});

app.get('/tournaments/league', api('tournaments', 'league'));
