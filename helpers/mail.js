var configs = require('../configs');
var mailer = require('../sendMail');

var mailAuth = { user: configs.mailUser, pass: configs.mailPass }
mailer.set(mailAuth);

function makeResetPasswordText(user){
	var text = 'Вы сбросили ваш пароль. Ваш новый пароль : ' + user.password;
	text+=  ' . Настоятельно рекомендуем Вам изменить его в вашем профиле';

	return text;
}

module.exports = {
	sendResetPasswordEmail: function (user) {
		user.to = user.email;
		user.subject = 'Сброс пароля';
		user.html = makeResetPasswordText(user);

		return mailer.send(user);
	}


}