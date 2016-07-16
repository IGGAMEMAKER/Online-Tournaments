var configs = require('../configs');
var gameHost = configs.gameHost;

function getPortAndHostOfGame(gameNameID){
  // Log('getPortAndHostOfGame. REWRITE IT!!!!');

  switch (gameNameID)
  {
    case 1: return { port:5009, host: gameHost }; break; // PPServer
    case 2: return { port:5010, host: gameHost }; break; // QuestionServer
    case 3: return { port:5011, host: gameHost };	break; // BattleServer
    default:
      //Log('Some strange gameNameID !!' + gameNameID,'WARN');
      return { port:5010, host: gameHost };//QuestionServer
      break;
  }
}

module.exports = {
  getPortAndHostOfGame,
};
