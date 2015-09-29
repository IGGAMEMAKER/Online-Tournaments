var core = require('./core');

core.StartServer({host:'localhost', port:5006, serverName:'MoneyServer'});
var app = core.app;
var sendRequest = core.sendRequest;
var Log = core.Log;
var OK = core.OK;
var Fail = core.Fail;

/*app.all('/', function (req, res) {
	console.log('Request!');
	res.end('OK');
	//core.Log()
})*/
app.post('/BuyIn', BuyIn);
app.post('/Deposit', Deposit);
app.post('/CashOut', CashOut);
app.post('/GetPack', GetPack);


//var operations = [];
var logins = {};


function BuyIn(req, res){
	var data = req.body;
	if(data){
		if (data.userID){
			if (noOperations(data.userID)){
				logins[data.userID]=1;
				core.DBupdate('/BuyIn', data, null,res, function (err, response, body, res){
					delete logins[data.userID];
					OK(res);
				});
			}
		}
	}
}

function noOperations(userID){
	return logins[userID];
}

function Deposit(req, res){
	var data = req.body;
	Log('Checking card data...');
	if (data){
		core.DBupdate('IncreaseMoney', data);
	}
}

function CashOut(req, res){
	var data = req.body;
	Log('CashOut...');
	if (data){
		core.DBupdate('DecreaseMoney', data);
	}
}

function GetPack(req, res){
	Fail(res);
}