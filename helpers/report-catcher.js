var API = require('../helpers/API');

module.exports = function (place, data) {  //about errors
  return function (err) {
    console.error('report', data, err);

    var obj = {
      place:place,
      data:data||{},
      err:err
    };

    return API.errors.add('SYSTEM', 'REPORT', obj)
  }
};
