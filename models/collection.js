var db = require('../db');
var Collection = db.wrap('Collection');
// var await = require('await')

function all(query){
	return Collection.list(query)
	// return db.list('Collection', query)
}

function getByID(collectionID){
	return Collection.findOne({ _id : collectionID })
	// return db.findOne('Collection', { _id : collectionID })
}

function getByName(name){
	return Collection.findOne({ name: name })
	// return db.findOne('Collection', { name: name })
}

function add(data){
	return Collection.save(data)
	// return db.save('Collection', data)
}

function attachGift(id, giftID){
	return getByID(id)
	.then(function (collection){
		var list = collection.list;
		list.push(giftID);
		return Collection.update({ _id:id }, {$set : {list:list} })
		// return db.update('Collection', { _id:id }, {$set : {list:list} })
	})
}

function standardCollection(){

}

// Tests
// all({})
// getByID('5622b320ecdf83f91ef09036')
// .then(console.log)
// .catch(console.error)

module.exports = {
	all:all,
	getByID:getByID,
	getByName:getByName
	add:add
}