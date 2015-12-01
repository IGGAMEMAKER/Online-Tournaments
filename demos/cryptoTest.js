var crypto = require('crypto');

const buf = crypto.randomBytes(10).toString('hex');
console.log(buf);
//console.log(String.fromCharCode.apply(String, buf));

var password = buf;
var md5Sum = crypto.createHash('md5');

md5Sum.update(password);
var hashedPass = md5Sum.digest('hex');
console.log(hashedPass);

/*setTimeout(function(){
	if (hashedPass==getHash(password)){
		console.log('they are equal!!!');
	} else {
		console.log('different((((');
	}
}, 1500);*/

function getHash(password){
	var md5Sum = crypto.createHash('md5');

	md5Sum.update(password);
	return md5Sum.digest('hex');
}

console.log(alg_md5('35a206e4f8aee70ff344'));
function alg_md5 (password) {
	var md5Sum = crypto.createHash('md5');

	md5Sum.update(password);
	var hashedPass = md5Sum.digest('hex');
	//console.log(hashedPass);

	return hashedPass;
}
