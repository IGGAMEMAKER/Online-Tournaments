var db = require('../db');

var Pulse = db.wrap('Pulse');

var time = require('../helpers/time');

function convertDateToDayInterval(date) {

}

function getByDay(date) {
  Pulse.findOne({
    date: {

    }
  })
}

function getForPeriod(date1, date2) {

}

function save(data, tag) {
  return Pulse.save({ data, type: tag, time: new Date() })
}

module.exports = {
  getByDay,
  getForPeriod,

  save
};
