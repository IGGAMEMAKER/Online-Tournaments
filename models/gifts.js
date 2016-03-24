var db = require('../db');

function all(query){
	return db.list('Gift', query)
}

function getByID(giftID){
	return db.findOne('Gift', { _id : giftID })
}

function add(data){
	return db.save('Gift', data)
}



// Tests

// all({})
getByID('5622b320ecdf83f91ef09036')
.then(console.log)
.catch(console.error)

module.exports = {
	all:all,
	getByID:getByID,
	add:add
}