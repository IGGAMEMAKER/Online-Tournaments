var configs = require('../configs');
var mailer = require('../sendMail');

var mailAuth = { user: configs.mailUser, pass: configs.mailPass }
mailer.set(mailAuth);

function makeResetPasswordText(user){
	// var domainName = 'online-tournaments.org';
	var domainName = configs.gameHost || 'localhost';
	var text = 'Вы сбросили ваш пароль. Ваш новый пароль : ' + user.password;
	text += ' . Настоятельно рекомендуем Вам изменить его в вашем профиле';
	text += '<br> Также, Вы можете войти на сайт не вводя пароль по этой ';
	text += '<a href="http://'+domainName+'/linker/'+user.login+'/'+ user.link+'">ссылке</a>'
	console.log(text);
	return text;
}

function makeRegisterText(user, link){
	var login = user.login;
	var password = user.basePass;
	//console.log(user);
	//console.log(link);
	var text = '<html><br>Спасибо за регистрацию на сайте online-tournaments.org<br>';
	// text+= 'Ваш логин : ' + login + '<br>';
	text += 'Удачной игры!<br>'
	//text+= 'Ваш пароль : ' + password;
	/*text+= 'Follow the link below to activate your account: '
	text+= '<br><a href="'+link+'">'+link+'</a>';*/
	text+= '</html>';

	//Log('Registering email: ' + text, STREAM_USERS);

	return text;
}

module.exports = {
/*	sendResetPasswordEmail: function (user) {
		user.to = user.email;
		user.subject = 'Сброс пароля';
		user.html = makeResetPasswordText(user);

		return mailer.send(user);
	},*/
	sendResetPasswordEmail: function (user) {
		user.to = user.email;
		user.subject = 'Сброс пароля';
		user.html = makeResetPasswordText(user);

		return mailer.send(user);
	},
	sendActivationEmail: function(user){
		//console.error('sendActivationEmail');

		user.to = user.email;
		user.subject = 'Регистрация на сайте online-tournaments.org!';
		user.html = makeRegisterText(user);//, 'http://' + domainName + '/Activate/'+ user.link

		return mailer.send(user);
		//mailer.send(user.email, 'Registered in online-tournaments.org!', makeRegisterText(login, email) );
	}


}