var Promise = require('bluebird');

var Gifts = require('./gifts')
var Collections = require('./collections')

// Collections.update({"_id": ''})

// Gifts.all({})
// Collections.all({})
// Collections.add([], 'col1', {})
// Collections.remove('56f3ed32d99b76833904dde1')
var giftID = '5609a7da4d4145c718549ab3';
var colID = '56f3ef732c05208b3cb53f79';
// Gifts.all({})
Collections.all({})
// Collections.add([], 'col1', {})
// Collections.remove('56f3ed32d99b76833904dde1')
// Collections.attachGift(colID,giftID)


.then(console.log)
.catch(console.error)