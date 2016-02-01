var Promise = require('bluebird');

var configs = require('../configs');
var models = require('../models')(configs.db);

var User = models.User;
var Game = models.Game;
var TournamentReg = models.TournamentReg;
var Gift = models.Gift;

var UserGift = models.UserGifts;
var MoneyTransfer = models.MoneyTransfer;

var Message = models.Message;
var Configs = models.Configs;

var Tournament = models.Tournament;

module.exports = {
	
}