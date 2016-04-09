module.exports = function(app, aux, realtime){
  var Tournaments = require('../models/tournaments');
  var TournamentRegs = require('../models/tregs');

  var categories = {
    'general' : 1,
    'realmadrid' : 1
  }

  app.get('/Category/:name', function (req, res, next){
    var name = req.params.name;
    if (!categories[name]) name = 'general'

    res.render('Category', { category:name })
    
  })
}