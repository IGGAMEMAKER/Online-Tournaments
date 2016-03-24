var db = require('../db');
var Gifts = db.wrap('Gift');
// var await = require('await')

function all(query){
	// return db.list('Gift', query)
	return Gifts.list(query)
}

function getByID(giftID){
	// return db.findOne('Gift', { _id : giftID })
	return Gifts.findOne({ _id : giftID })
}

function add(data){
	// return db.save('Gift', data)
	return Gifts.save(data)
}

var usergifts = {

}

// Tests
all({})
// getByID('5622b320ecdf83f91ef09036')
.then(console.log)
.catch(console.error)

module.exports = {
	all:all,
	getByID:getByID,
	add:add,

	user: usergifts
}