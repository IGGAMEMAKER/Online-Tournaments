
var authenticated= function(req, res, next){
	if (req.session && req.session.login){
		next();
	} else {
		res.redirect('Login');
	}
}

var isAdmin = function (req, res, next){
	if (req.session.login=='23i03g'|| req.session.login=='g.iosebashvili'){
		next()
	} else {
		next(null);
	}
}
module.exports = {
	authenticated:authenticated,

	isAdmin: [authenticated, isAdmin]
}