module.exports = function(app, Log, serverName){
	app.use(function (err, req, res, next){
		console.error('ERROR STARTS!!');
		//console.error(err.stack);
		//console.error('-------------');
		Log('Error happened in ' + serverName + ' : ' + err, 'Err');
		Log('Description ' + serverName + ' : ' + err.stack, 'Err');
		console.error(err);
		console.error('CATCHED ERROR!!!! IN: ' + req.url);
		res.status(500).send('Something broke!');
		next(err);
	});
};
