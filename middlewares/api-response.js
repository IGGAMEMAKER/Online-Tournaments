var respond = require('../helpers/respond');
// var standard_response = require('./std-json-response');

// response Function gets REQUEST parameter (req)
// it MUST return promise, so we can attach finish THEN and CATCH functions

// tag parameter is necessary for logging purposes
module.exports = (responseFunction, tag) => {
  return [
    (req, res, next) => {
      var promise = responseFunction(req);
      respond(promise, req, next)
    },

    (req, res) => {
      res.json({ msg: req.data })
    },
    (err, req, res, next) => {
      res.json({ err: err })
    }
  ];
};
