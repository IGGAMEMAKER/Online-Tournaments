var db = require('../db');
var Collection = db.wrap('Collection');
// var await = require('await')
console.log(Collection.update)


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

function add(list, name, reward){
	return Collection.save({
		list:list,
		name:name,
		reward:reward
	})
	// return db.save('Collection', data)
}

function update(id, upd) {
	// return db.update('Collection', { _id:id }, upd)
	return Collection.update({ "_id":id }, upd)
}

function remove(id){
	return Collection.remove({ _id:id })
}

function attachGift(id, giftID){
	return getByID(id)
	.then(function (collection){
		// console.log(collection);

		var list = collection.list;
		list.push(giftID);

		var obj =  {
			$set : {
				list : list
			}
		};

		// console.log(list, id, obj)

		return update(id, obj);

		// return update(id, {$set : {list:list} })
		// return update(id, obj)
		// return db.update('Collection', {"_id":'56f3ef732c05208b3cb53f79'}, {$set : { list : [] } })
		// return db.update('Collection', { _id:id }, {$set : {list:list} })
	})
}

function standardCollection(){

}

// Tests
// console.log(Collection)
var giftID = '5609a7da4d4145c718549ab3';
var colID = '56f3ef732c05208b3cb53f79';
// // Gifts.all({})
// all({})
// // Collection.add([], 'col1', {})
// // Collection.remove('56f3ed32d99b76833904dde1')
// Collection.update({ _id:'56f3ef732c05208b3cb53f79'}, {$set : { list:['5609a7da4d4145c718549ab3']} })
// Collection.update({ "_id":colID }, {$set : { list:[giftID]} })

// db.update('Collection', { "_id":'56f3ef732c05208b3cb53f79'}, {$set : { list:['5609a7da4d4145c718549ab3']} })

// attachGift(colID,giftID)
// remove(colID)

update(colID, { $set : { list : [] } })

// getByID(colID)
// update(colID, {$set : { list: ['5609a7da4d4145c718549ab3'] } })
// db.findOne('Collection', {"_id":'56f3ef732c05208b3cb53f79'})

// db.update('Collection', {"_id":'56f3ef732c05208b3cb53f79'}, {$set : { list : [] } })


// Collection.update({ "_id":'56f3ef732c05208b3cb53f79' }, { $set : { list : [] } }, null)
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