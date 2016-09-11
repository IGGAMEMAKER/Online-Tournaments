var db = require('../db');
var Visits = db.wrap('Visit');

module.exports = {
  add: (login, date, registered) => {
    return Visits.save({ login, date, registered })
  },

  saveList: list => {
    list.forEach(visit => {
      Visits.save({ login: visit.login, date: visit.date, registered: visit.registered })
    })
  },

  get: (login) => {
    return Visits.list({ login })
  },

  getAllByPeriod: (d1, d2) => {
    var find = {
      date: {
        $gte: d1,
        $lt: d2
      }
    };

    return Visits.list(find)
  }
};