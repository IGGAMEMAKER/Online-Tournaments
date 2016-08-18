/**
 * Created by gaginho on 04.06.16.
 */
var Users = require('../models/users');
var Actions = require('../models/actions');
var Errors = require('../models/errors');
var Tournaments = require('../models/tournaments');
var Message = require('../models/message');
var Gifts = require('../models/gifts');

var Packs = require('../models/packs');

var Money = require('../models/money');
var Teams = require('../models/teams');

var models = {
  Users,
  Actions,
  Errors,
  Tournaments,
  Message,
  Gifts,
  Packs,
  Money,
  Teams
};

module.exports = function (modelname, action, pageOK){
  return function (req, res, next) {
    const params = Object.assign({}, req.params, req.body);
    models[modelname][action](params)
      .then(function (result) {
        req.data = result;
        if (pageOK) {
          res.render(pageOK, { msg: result });
          return;
        }

        res.json({ msg: result });
      })
      .catch((err) => next(err))
  }
};
