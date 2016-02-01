module.exports = {
	authenticated: function(req, res, next){
		if (req.session && req.session.login){
			next();
		} else {
			res.redirect('Login');
		}
	}
}