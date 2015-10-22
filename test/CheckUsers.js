// This test file checks folowing functions:
// Register user
// Login user

// get register page
// get login page
//mocha for async tests

var assert = require('assert');
var request = require('request');

var urls = [
	'http://localhost/Login',
	'http://localhost/Register',
	'http://localhost/Profile',
	'http://localhost/Alive',
	'http://localhost/Tournaments',
	'http://localhost/TournamentInfo?tID=247',

	'http://localhost/ShowGifts',
	'http://localhost/AddGift',
	'http://localhost/AddTournament',

	'http://localhost/Admin',
	'http://localhost/Cashout',
	'http://localhost/Deposit',
];
/**/
/*describe('Login', function getLoginPage () {
	it('should return status 200', function(done){
		request('http://localhost/Login', function (error, response, body){
			if (error) throw error;
			//expect(response.statusCode).equals(200);
			//assert.equal(response.statusCode, 200);
			if (response.statusCode==200) done();
		});
	});
})*/


describe('Check availability of pages', function getUrls () {
	for (var i = urls.length - 1; i >= 0; i--) {
		checkWrapper(urls[i]);
	};
});
function checkWrapper(url){
	it(url+' should return status 200', function (done){
		checkUrl(url, done);
	});
}
function checkUrl(url, done){
	request(url, function (error, response, body){
		//if (error) console.log(error); throw error;
		//console.log(response.statusCode);
		if (response.statusCode==200) {done(); return;}
		done('\nSTATUS : ' + response.statusCode);

	});
}

/*describe('Urls', function getUrls () {
	for (var i=0;i<urls.length;++i){
		var url = urls[i];
		console.log(url);
		it(url+' should return status 200', function(done){
			request(url, function (error, response, body){
				if (error) console.log(error); throw error;
				console.log(response.statusCode);
				//expect(response.statusCode).equals(200);
				//assert.equal(response.statusCode, 200);
				if (response.statusCode==200) done();
			});
		});
	}
})*/