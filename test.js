//function queryProcessor () {
//var ServerNames = require('../configs/serverIPs')
//var lineReader = require('line-reader');

var PI = 3.14

var serverList = {};

serverList['FrontendServer'] = 5000;
serverList['TournamentServer'] = 5001;
serverList['GameServer'] = 5002;
serverList['AccountServer'] = 5003;
serverList['BalanceServer'] = 5004;
serverList['AdminServer'] = 5005;
serverList['MoneyServer'] = 5006;
serverList['DBServer'] = 5007;
console.log(serverList['DBServer']);


this.getPort = function(r){
	return serverList[r];
}

this.area = function ( r ) {
	return PI * r * r
}


this.start = function (response, msg){
	response.write(msg);
	response.end(" it Realy works ");// + msg);
}

this.circumference = function ( r ) {
	return 2 * PI * r
}
//}
