var Promise = require('bluebird');
// setData: function(req, next){
//   return function (data){
//     req.data = data;
//     next();
//   }
// }
module.exports = (promise, req, next) => {
  return promise
    .then(data => {
      req.data = data;
      next();
    })
    .catch(next);
  // req.data
};
