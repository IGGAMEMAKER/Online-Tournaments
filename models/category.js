var db = require('../db');
var Category = db.wrap('Category');


function isArray(arr){
	return true
}

function add(name, draw_name, level){
	if (!name) throw 'Category no name';
	if (!draw_name) throw 'Category draw error'
	// if (!draw || !draw.name) throw 'Category draw error'

	var draw = {
		visible : false,
		name : draw_name
	}

	if (!level || isNaN(level)) level = 0;

	// if (!packs || !isArray(packs)) 
	var packs=[];
	// if (!cards || !isArray(cards))
	var cards=[];
	// if (!collections || !isArray(collections))
	var collections=[];

	// if (!settings)
	var settings = {};


	var obj = {
		name:name,
		draw:draw,
		level:level,

		packs:packs,
		cards:cards,
		collections:collections,
		
		settings:settings
	}

	return Category.save(obj)
}

function all(){ return Category.list({}) }

function available(){ return Category.list({ "draw.visible" : true }) }

// function activate(name){ return Category.update({ name: name }, { "draw.visible" : true }) }
// function deactivate(name){ return Category.update({ name: name }, { "draw.visible" : false }) }

function activate(id){ return Category.update({ _id: id }, { "draw.visible" : true }) }
function deactivate(id){ return Category.update({ _id: id }, { "draw.visible" : false }) }

var attach = {
	pack: function (name, packID){ return 1 },
	collection: function (name, packID){ return 1 },
	card: function (name, packID){ return 1 }
}

function editDraw(id, parameter, value){ 
	var obj={};
	obj["draw." + parameter] = value
	return edit(id, obj)
}
function editSettings(id, parameter, value){
	var obj={};
	obj["settings." + parameter] = value
	return edit(id, obj)
}

function remove(id){ return Category.remove({_id: id }) }
function edit(id, obj){ return Category.update({_id: id }, { $set: obj }) }

module.exports = {
	add:add,
	all:all,
	available:available,
	activate:activate,
	deactivate:deactivate,

	attach:attach,
	editDraw:editDraw,
	editSettings:editSettings,

	remove:remove,
	edit:edit
}