var logger = require('../helpers/logger');
var sender = require('../requestSender');
var Users = require('../models/users');

function is_numeric_id(login){
  var arr1 = login.split("id");
  var is_numeric= arr1.length==2 && arr1[0]=="" && !isNaN(arr1[1]);
  if (is_numeric)
    console.log("input: ", login, is_numeric?"is_numeric ||":"no ||", "output:", arr1);
  /*if (){
   console.log("2 blocks");
   }*/
  //if (arr1[0]=="id")
  return is_numeric;
}

module.exports = function findOrCreateUser (req, res) {
  var profile = req.body;
  var uid = profile.id;
  var provider = profile.provider;

  var social = profile._json;

  var login = profile.username;

  logger.debug('findOrCreateUser', profile);
  logger.debug('findOrCreateUser ' + uid + ' ' + provider + ' social ' + JSON.stringify(social));

  if (is_numeric_id(login)){
    login = social.first_name + social.last_name + social.id;
  }

  Users.getSocialUser(uid)
    .then(user => {
      if (!user) {
        var USER = {
          login:login,
          money:0,
          date: now(),
          activate:0,
          bonus:{},
          social: social
        };
        
        return Users.addUser(USER);
      }

      sender.Answer(res, user);
      return 1;
    })
    .catch(err => {
      
    });

  User.findOne({ 'social.id': uid }, '', function (err, user) { //'social.provider':provider,
    if (err) return sender.Answer(res, null);
    var login = profile.username;
    console.log(profile);

    //if (!isNaN(login)) { login = profile.name.givenName+'*'+profile.id+'*'; }
    if (is_numeric_id(login)){
      login = social.first_name + social.last_name + social.id;
    }

    if (user){
      //logger.debug('findOrCreateUser' , user);
      return sender.Answer(res, user);
    } else {
      var USER = {
        login:login,
        money:0,
        date: now(),
        activate:0,
        bonus:{},
        //link:createActivationLink(login)
        social: social
      };

      var user = new User(USER);
      user.save(function (err) {
        if (err){
          switch (err.code) {
            case USER_EXISTS:	logger.debug('Sorry, user ' + login + ' Exists'); break;
            default: Error(err); break;
          }
          return sender.Answer(res, USER);
        } else {
          logger.debug('added User ' + login + '/' + uid);
          sender.Answer(res, USER);
        }
      })
    }

  })
};
