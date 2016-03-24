var db = require('../db');

// var helper = require('../helpers/helper');

function all(query){
	return db.list('Gift', query)
}

function getByID(giftID){
	return db.findOne('Gift', { _id : giftID })
}

function add(data){
	return db.save('Gift', data)
}

// console.log('go')
// db.list('Gift', {})
// all({})
getByID('5622b320ecdf83f91ef09036')
.then(console.log)
.catch(function (err){
	console.log(err)
})

module.exports = {
	all:all,
	getByID:getByID,
	add:add
}

// function all(query){
// 	return new Promise(function(resolve, reject){
// 		Gift.find(query||{}, function (err, gifts){
// 			if (err) return reject(err);

// 			return resolve(gifts||null);
// 		});
// 	})
// }

// function getByID(giftID){
// 	return new Promise(function(resolve, reject){
// 		Gift.findOne({ _id : giftID}, function (err, gift){
// 			if (err) return reject(err);

// 			return resolve(gift||null);
// 		});
// 	});
// }



// function add(data){
// 	return new Promise(function(resolve, reject){
// 		log('trying to add gift '+ JSON.stringify(data)+ ' Gifts');

// 		if (data){
// 			gift = new Gift(data);
// 			gift.save(function (err){
// 				if (err) return reject(err);

// 				log('Added gift ' + JSON.stringify(data) + ' Gifts');
// 				return resolve(OK);
// 			})
// 		} else {
// 			log('No addition. Gift is null' + ' Gifts');
// 			return reject(Fail);
// 		}
// 	});

// }

// log('asdddd');
// getByID('5622b320ecdf83f91ef09036')
// .then(helper.p_printer)
// .catch(helper.catcher);

// //function log(msg){ console.log(msg); }