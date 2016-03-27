var Collection = require('../models/collections')
var Gifts = require('../models/gifts')
var Tournaments = require('../models/tournaments')


var app, io;
var frontendVersion;


objects = {
	counter:0,
	updater:{},
	cards:[],
	UPDATE_ALL: UPDATE_ALL
};

function save(name){
	return function (result){
		objects[name] = result;
		return result;
	}
}

function send(name){
	return function(result){
		io.emit(name, result);
	}
}

function UPDATE_ALL() {
	update_collections();
	update_cards();
}
UPDATE_ALL();
// update_collections();

// Collection.all({}).then(save('collections'));//.then(console.log)
// Gifts.cards().then(save('cards'));//.then(console.log)

update_tournaments(1000);

function update_collections(){ 
	Collection.all({}).then(save('collections')); 
}
function update_cards(){ Gifts.cards().then(save('cards')); }


function update_tournaments(period){
	Tournaments.get()
  .then(function (tournaments){
    if (tournaments) objects.updater.tournaments = tournaments;
    if (frontendVersion) objects.updater.frontendVersion = frontendVersion;

    return objects.updater; // io.emit('update', updater);
  })
  .then(send('update'))
  .catch(console.error)

  setTimeout(function(){ update_tournaments(period) }, period);
}

setInterval(function(){ objects.counter++; }, 1000)


module.exports = function(_app, _io){
	// set: function(_app, _io){
	// 	app = _app;
	// 	io = _io;
	// 	return 
	// },
	app = _app;
	io = _io;
	return function(){
		return objects;
	}
	// get: objects
}