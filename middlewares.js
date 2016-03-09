
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

// middlewares and helpers

	function json(req, res, next){
		if (req.err) {
			res.json({ err: req.err })
		} else {
			res.json({ data: req.data || null })
		}
	}

	function send_error(err, req, res, next){
		console.error(err);
		res.json({ err: err });
	}

	// function get_stats(req, res, next){
	// 	return
	// }

	function answer(req, next){
		return function (data){
			req.data = data;
			next();
		}
	}

	function printer(msg){
		console.log(msg);
		return msg;
	}

	var std = [json, send_error];

	var draw_list = [drawList, send_error];

	function drawList(req, res, next){
		var list = req.data || [];
		var txt='';
		console.log(list);
		for (var i=0; i<list.length; i++){
			txt += JSON.stringify(list[i]) + '\n';
		}
		res.end(txt);
	}

	function render(renderPage){
		return function(req,res, next){
			// console.log(renderPage, req.data);

			res.render(renderPage, { msg: req.data })
		}
	}




module.exports = {
	authenticated:authenticated

	,isAdmin: [authenticated, isAdmin]
	,drawList: draw_list
	,send_error: send_error
	,answer: answer
	,render: render
}