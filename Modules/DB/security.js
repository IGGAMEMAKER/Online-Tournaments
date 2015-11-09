function passwordCorrect (user, enteredPassword){
	console.log(user);
	if (!user.cryptVersion) { return enteredPassword==user.password; }
	console.log(user);
	switch(user.cryptVersion){
		case 0:
			return enteredPassword==user.password;
		break;
		case 1:
			return true;
		break;

		default:
			return enteredPassword==user.password;
		break;
	}
}

this.passwordCorrect = passwordCorrect;