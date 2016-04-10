module.exports = function(app, aux, realtime){
	var Tournaments = require('../models/tournaments');
	var TournamentRegs = require('../models/tregs');

	var categories = {
		'general' : createCategory('general', 'Всё обо всём', "Всему подряд"),
		'realmadrid' : createCategory('realmadrid', "Реал Мадрид", "Мадридскому Реалу")
	}

	//setTimeout(getCategories, 4000);


	function createCategory(name, ru_name, name_dat){
		return {
			name: name,
			draw: createDrawObject(ru_name,name_dat)
		}
	}
	function createDrawObject(name, name_dat){
		var obj = { name: name, addQuesion: "на любую тему", name_dat:name_dat };
		return obj;
	}

	function getCategories(){
		var cats = realtime().categories;
		for (var i = cats.length - 1; i >= 0; i--) {
			var category = cats[i];
			var name = category.name,
			draw = category.draw,
			level = category.level;

			categories[name] = category;
		};
	}

	app.get('/Category/:name', function (req, res, next){
		var name = req.params.name;
		if (!categories[name]) name = 'general'; // { category: name }
		res.render('Category', categories[name])
	})
}