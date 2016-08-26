var express = require('express');
var router = express.Router();
// var VKApi = require('node-vkapi');
var middlewares = require('../middlewares');
var respond = require('../middlewares/api-response');

var Users = require('../models/users');
// var Promise = require('bluebird');
// var agent = require('superagent');
// var request = require('superagent-promise')(agent, Promise);

var API = require('../helpers/API');
var MY_GROUP_ID = 1111871234;

// var VK = new VKApi({
  // token: 'access_token'
// });

// router.get('/isJoinedGroup', middlewares.authenticated, respond((req) => {
//   return Users.profile(req.login)
//     .then(p => {
//       // console.log('isJoinedGroup: profile', p.social.id);
//       var userSocialID = p.social.id;
//       // if (!userSocialID) {
//       //   throw 'noVKUser' + req.login;
//       // }
//       // console.log('search for user', userSocialID);
//
//       var object = {
//         user_id: userSocialID,
//         group_id: MY_GROUP_ID
//       };
//       return 1;
//       return VK.call('groups.isMember', object).then(r => !!r)
//     });
// }));

router.get('/', function (req, res) {
  res.render('Leagues');
});

router.get('/Calendar', function (req, res) {
  res.render('LeagueCalendar');
});

module.exports = router;