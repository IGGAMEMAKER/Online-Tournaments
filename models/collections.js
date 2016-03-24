var db = require('../db');
var Collection = db.wrap('Collection');
// var await = require('await')


function all(query){
	return Collection.list(query)
}

function getByID(collectionID){
	return Collection.findOne({ _id : collectionID })
}

function getByName(name){
	return Collection.findOne({ name: name })
}

function add(list, name, reward){
	return Collection.save({
		list:list,
		name:name,
		reward:reward
	})
}

function update(id, upd) {
	return Collection.update({ "_id":id }, { $set: upd })
}

function remove(id){
	return Collection.remove({ _id:id })
}

function clear(id){
	return update(id, {list:[]})
}

function attachGift(id, giftID){
	return getByID(id)
	.then(function (collection){
		console.log(collection);

		var list = collection.list;
		list.push(giftID);
		// console.log(list);

		var obj =  {
			list : list
		}

		return update(id, obj);
	})
}

// Tests
// console.log(Collection)
var giftID = '5609a7da4d4145c718549ab3';
var colID = '56f438b27c7ccf0914389f1d';

all({})
// add([], 'col1', {})
// attachGift(colID, giftID)
// clear(colID)
// getByID(colID)
.then(console.log)
.catch(console.error)

// all({})
// getByID('5622b320ecdf83f91ef09036')

// .then(console.log)
// .catch(console.error)

module.exports = {
	all:all,
	getByID:getByID,
	getByName:getByName,
	add:add,
	remove:remove,

	attachGift:attachGift
}