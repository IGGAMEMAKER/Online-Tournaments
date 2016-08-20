var API = require('./API');
var report = require('./report-catcher');

module.exports = {
  log: console.log,
  debug: console.log,
  error: console.error,

  save: function(login, actionType, data) {
    return API.actions.add(login, actionType, data)
  },
  saveError: function(login, errorType, data) {
    return API.errors.add(login, errorType, data)
  },

  report,

  clientside: function(login, auxillaries){
    return API.actions.add(login, 'clientside', auxillaries)
  },

  clientsideError: function (login, auxillaries){
    return API.errors.add(login, 'clientside', auxillaries)
  }
};
