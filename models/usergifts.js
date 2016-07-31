var db = require('../db');
var UserGifts = db.wrap('UserGift');

module.exports = {
  saveGift: function (login, giftID, isCard, colour){
    var usergift = {
      userID: login,
      giftID: giftID
    };

    if (isCard) usergift.isCard = true;
    if (colour) usergift.colour = colour;

    return UserGifts.save(usergift)
  }
  ,all: function (){
    return UserGifts.list({})
  }
  ,cards: function (login){
    return UserGifts.list({ userID: login, isCard: true})
  }
  ,usergiftsWhichFitCollection: function(login, colour, giftIDs){
    return UserGifts.list({ userID: login, colour: colour, giftID: {$in: giftIDs } })
  }
  ,cardsGroup: function (login){
    var obj = [
      {
        $match: { userID: login}
      }
      ,{
        $group: {
          // _id: "$giftID",
          _id: { giftID: "$giftID", colour: "$colour" },
          // colour: "$colour",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.colour' :-1}
      }];
    return UserGifts.aggregate(obj)
  }
  ,remove: function (id){
    return UserGifts.remove({_id:id})
  }
  ,removeGroup: function (list){
    return UserGifts.remove({_id: {$in: list} })
  }
  ,clearAllByUsername: function(login){
    console.log(login);
    return UserGifts.remove({ userID: login})
  }
};
