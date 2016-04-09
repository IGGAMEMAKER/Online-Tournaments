var db = require('../db');
var Category = db.wrap('Category');


function isArray(arr){
	return true
}

function add(name, draw, level){
	if (!name) throw 'Category no name';
	if (!draw || !draw.name) throw 'Category draw error'
	draw.visible = false;

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

function remove(id){ return Category.remove({_id: id }) }
function edit(id, obj){ return Category.update({_id: id }, { $set: obj }) }