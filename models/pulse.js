var db = require('../db');

var Pulse = db.wrap('Pulse');

var time = require('../helpers/time');

function convertDateToDayInterval(date) {
  
}

function getByDay(date) {

}

function getForPeriod(date1, date2) {

}

function save(data) {
  return Pulse.save({ data, time: new Date() })
}

module.exports = {
  getByDay,
  getForPeriod,

  save
};
