var core = require('./core');

core.StartServer({host:'localhost', port:5006, serverName:'MoneyServer'});
var app = core.app;
var sendRequest = core.sendRequest;
var Log = core.Log;
var OK = core.OK;
var Fail = core.Fail;
var str = core.str;

/*app.all('/', function (req, res) {
	console.log('Request!');
	res.end('OK');
	//core.Log()
})*/
app.post('/BuyIn', BuyIn);
app.post('/Deposit', Deposit);
app.post('/Cashout', Cashout);
app.post('/GetPack', GetPack);


//var operations = [];
var logins = {};


function BuyIn(req, res){
	var data = req.body;
	if(data){
		if (data.userID){
			if (noOperations(data.userID)){
				logins[data.userID]=1;
				core.DBupdate('/DecreaseMoney', data, null,res, function (err, response, body, res){
					delete logins[data.userID];
					core.Answer(res, body); 
					//OK(res);
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
	if (data &&  !isNaN(data.cash)){
		data.cash*=100;
		core.DBupdate('IncreaseMoney', data, null, res, function (err, response, body, res){ 
			Log('Answer came from DB '+ str(body) );
			//OK(res);
			core.Answer(res, body); 
		});
	}
	else{
		Fail(res);
	}
}

function Cashout(req, res){
	var data = req.body;
	Log('CashOut...');
	if (data &&  !isNaN(data.money)){
		data.money*=100;
		core.DBupdate('DecreaseMoney', data, null, res, function (err, response, body, res){ 
			Log('Answer came from DB: '+ str(body) );

			//OK(res);
			core.Answer(res, body); 
		});

	}
	else{
		Fail(res);
	}
}

function GetPack(req, res){
	Fail(res);
}