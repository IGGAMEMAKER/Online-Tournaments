var fs = require('fs');
//var file = fs.readFileSync('./configs/siteConfigs.txt', "utf8");
var file = fs.readFileSync('/tournaments/configs/app/site.txt', "utf8");
var configs =  JSON.parse(file);

//module.exports = configs;



var config = {};
config.msg		=	configs.msg;
config.delay	=	configs.delay;
config.gamePort	=	configs.gamePort;
config.gameHost	=	configs.gameHost;
config.mailUser	=	configs.mailUser;
config.mailPass	=	configs.mailPass;
console.log(config);
module.exports = config;