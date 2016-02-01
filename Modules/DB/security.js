var crypto = require('crypto');

function create_random_password () {
	const buf = crypto.randomBytes(10).toString('hex');
	return buf;
}

function passwordCorrect (user, enteredPassword){
	//console.log(user);
	if (!user.cryptVersion) { return enteredPassword==user.password; }
	//console.log(user);

	switch(user.cryptVersion){
		case 0: return enteredPassword == user.password;						break;
		case 1:	return true;																				break;
		case 2: return user.password == alg_md5(enteredPassword); 	break;

		default: return enteredPassword == user.password;						break;
	}
}
function Hash (password, cryptVersion) {
	if (!password) return null;

	switch(cryptVersion){
		case 0: return password; 		break;
		case 1: return password;		break;
		case 2: return alg_md5(password); break;

		default: return password;		break;
	}
}


//algorithms
function alg_md5 (password) {
	var md5Sum = crypto.createHash('md5');

	md5Sum.update(password);
	var hashedPass = md5Sum.digest('hex');
	console.log(hashedPass);

	return hashedPass;
}

this.passwordCorrect = passwordCorrect;
this.Hash = Hash;
this.create_random_password = create_random_password;