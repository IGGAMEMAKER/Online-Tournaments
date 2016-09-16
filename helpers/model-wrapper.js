var Promise = require('bluebird');
var helpers = require('./helper');

var model;
function list(find, parameters){
  return new Promise(function (resolve, reject){
    model.find(find || {}, parameters || '', function (err, array){
      if (err) return reject(err);

      resolve(array);// || null
    })
  })
}

function searchOne(find, parameters){
  return new Promise(function (resolve, reject){
    model.findOne(find || {}, parameters || '', function (err, item){
      if (err) return reject(err);

      resolve(item);// || null
    })
  })
}

function findOne(find, parameters){
  return new Promise(function (resolve, reject){
    model.findOne(find || {}, parameters || '', function (err, item){
      if (err) return reject(err);

      if (item) return resolve(item);

      reject(null);
    })
  })
}

function save(item){
  return new Promise(function (resolve, reject){
    var ITEM = new model(item);
    ITEM.save(function (err){
      if (err) return reject(err);

      return resolve(item)
    })
  })
}

function aggregate(array){
  return new Promise(function (resolve, reject){
    // console.log(modelName, find, updateObj, options);
    model.aggregate(array, function (err, data){
      if (err) return reject(err);

      return resolve(data);
    })
  })
}

function update(find, updateObj, options){
  return new Promise(function (resolve, reject){
    // console.log(modelName, find, updateObj, options);

    model.update(find, updateObj, options || null, function (err, count){
      if (err) return reject(err);

      if (helpers.updated(count)) {
        return resolve(1);
      }

      return reject(null);
    })
  })
}

function remove(find, parameters, options){
  return new Promise(function (resolve, reject){
    model.remove(find, function (err, count){
      if (err) return reject(err);

      if (helpers.removed(count)) {
        return resolve(1);
      }

      return reject(null);
    })
  })
}

module.exports = (_model) => {
  model = _model;
  return {
    list,
    searchOne,
    findOne,
    save,
    aggregate,
    update,
    remove
  }
};
