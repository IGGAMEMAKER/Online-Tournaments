var Promise = require('bluebird');

var configs = require('./configs');
var models = require('./models')(configs.db);

function list(modelName, find, parameters){
	return new Promise(function (resolve, reject){
		models[modelName].find(find || {}, parameters || '', function (err, array){
			if (err) return reject(err);

			resolve(array);// || null
		})
	})
}

function searchOne(modelName, find, parameters){
	return new Promise(function (resolve, reject){
		models[modelName].findOne(find || {}, parameters || '', function (err, item){
			if (err) return reject(err);

			resolve(item);// || null
		})
	})
}

function findOne(modelName, find, parameters){
	return new Promise(function (resolve, reject){
		models[modelName].findOne(find || {}, parameters || '', function (err, item){
			if (err) return reject(err);

			if (item) return resolve(item);

			reject(null);
		})
	})
}

function save(modelName, item){
	return new Promise(function (resolve, reject){
		var ITEM = new models[modelName](item)
		ITEM.save(function (err){
			if (err) return reject(err)

			return resolve(item)
		})
	})
}

function update(modelName, find, update, options){
	return new Promise(function (resolve, reject){
		models[modelName].update(find, update, options||null, function (err, count){
			if (err) return reject(err);

			if (helpers.updated(count)){
				return resolve(1);
			}

			return reject(null);
		})
	})
}

function remove(modelName, find, parameters, options){
	return new Promise(function (resolve, reject){
		models[modelName].remove(find, function (err, count){
			if (err) return reject(err);

			if (helpers.removed(count)) {
				return resolve(1);
			}

			return reject(null);
		})
	})
}

// console.log(models['Gift'])
// list('Gift', {}, '')
// .then(console.log)
// .catch(console.error)

var wrap = function(modelName){
	return {
		list: function(find, parameters) {
			return list(modelName, find, parameters)
		},
		find: function (find, parameters){
			return searchOne(modelName, find, parameters)
		},
		findOne: function (find, parameters){
			return findOne(modelName, find, parameters)
		},
		save: function(item){
			return save(modelName, item)
		},
		update: function(find, update, options){
			return update(modelName, find, update, options)
		},
		remove: function(find, parameters, options){
			return remove(modelName, find, parameters, options)
		}
	}
}

module.exports = {
	list: list,
	find: searchOne,
	findOne: findOne,
	save: save,
	update: update,
	remove: remove,

	wrap: wrap
}