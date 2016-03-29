var aux;
var Users = require('../models/users')
var Money = require('../models/money')


function increase(login, ammount, sourceObject){
	console.log('moneyIncrease', 'increase', arguments)
	return Users.moneyIncrease(login, ammount)
	.then(function (result){
		console.log('moneyIncrease done', result)
		return Money.saveTransfer(login, ammount, sourceObject)
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