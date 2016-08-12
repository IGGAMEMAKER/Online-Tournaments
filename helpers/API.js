var Users = require('../models/users');
var Actions = require('../models/actions');
var Errors = require('../models/errors');
var Tournaments = require('../models/tournaments');
var TRegs = require('../models/tregs');
var Message = require('../models/message');
var Gifts = require('../models/gifts');
var Usergifts = require('../models/usergifts');

var Packs = require('../models/packs');

var Money = require('../models/money');
var Teams = require('../models/teams');

module.exports = {
  users: Users,
  actions: Actions,
  errors: Errors,
  tournaments: Tournaments,
  tregs: TRegs,
  message: Message,
  gifts: Gifts,
  usergifts: Usergifts,
  packs: Packs,
  money: Money,
  teams: Teams
};
