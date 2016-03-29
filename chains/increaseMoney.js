var aux;
var Users = require('../models/users')
var Money = require('../models/money')


function increase(login, ammount, sourceObject){
	return Users.moneyIncrease(login, ammount)
	.then(function (result){
		Money.saveTransfer(login, ammount, sourceObject)
	})
}

module.exports = function(_aux){
	aux = _aux;

	// KillFinishedTournament(1000)
	// .then(function (result){
	// 	console.log('KillFinishedTournament', 1000)
	// })
	return {
		increase: increase
	}
}