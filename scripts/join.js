sender = require('./requestSender');

var args = process.argv.slice(2);
var curTournAndGameID=0;
//console.log(args.length);
if (args.length>0){//} || args.length=='0'){
	curTournAndGameID = args[0];
}
console.log(curTournAndGameID);