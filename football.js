var teams = {};

// createTeam()

function Team(distance, defence_line, attack_type, teamname){
	this.settings = {
		distance:distance,
		defence_line: defence_line,
		attack_type:attack_type
	};

	this.teamname = teamname;
	this.scored = 0;
	this.players = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

	// var	setPlayers = function(plrs){
	// 	this.players = plrs;
	// 	return this
	// }

	this.setPlayer = function(name, form, teamname, index){
		this.players[index] = { name:name, form:form }
	}

	this.setPlayers = function(plrs){
		this.players = plrs;
		return this
	}

	this.edit = function (parameter, value){
		this.settings[parameter] = value;
		return this
	}

/*
	create: function (distance, defence_line, attack_type, passing_type, lateral_attack, teamname, list){
	return {
		create: function (distance, defence_line, attack_type, teamname, list){
			settings = {
				distance:distance,
				defence_line: defence_line,
				attack_type:attack_type
				// ,
				// passing_type: passing_type,
				// lateral_attack: lateral_attack
			}
		},
		edit: function (parameter, value){
			settings[parameter] = value;
			return settings;
		},

		setPlayers: function(plrs){
			players = plrs;
		}
	}
*/
}

var match = {
	start : start,
	// substitute: substitute
}

const DISTANCE_SHORT = 1;
const DISTANCE_MID = 2;
const DISTANCE_LONG = 3;

const DEFENCE_LINE_LOW = 1;
const DEFENCE_LINE_MID = 2;
const DEFENCE_LINE_HIGH = 3;

const ATTACK_TYPE_AGRESSIVE = 1;
const ATTACK_TYPE_MID = 2;
const ATTACK_TYPE_FAST = 3;

// const PASSING_TYPE_
const C_START = 1;

function createPlayer(name, form, teamname, index){

}

function createTeam(distance, defence_line, attack_type, teamname, players){
	// teams[teamname] = new Team(DISTANCE_SHORT, DEFENCE_LINE_MID, ATTACK_TYPE_AGRESSIVE, teamname)
	teams[teamname] = new Team(distance, defence_line, attack_type, teamname, players)

	teams[teamname].setPlayer('Navas', 100, teamname, 0)
	teams[teamname].setPlayer('Marcelo', 100, teamname, 1)
	teams[teamname].setPlayer('Ramos', 100, teamname, 2)
	teams[teamname].setPlayer('Pepe', 100, teamname, 3)
	teams[teamname].setPlayer('Carvajal', 100, teamname, 4)

	teams[teamname].setPlayer('Kroos', 100, teamname, 5)
	teams[teamname].setPlayer('Casemiro', 100, teamname, 6)
	teams[teamname].setPlayer('Modric', 100, teamname, 7)

	teams[teamname].setPlayer('Ronaldo', 100, teamname, 8)
	teams[teamname].setPlayer('Benzema', 100, teamname, 9)
	teams[teamname].setPlayer('Bale', 100, teamname, 10)
}

function start (argument) {
	var teamname = 'one';
	createTeam(DISTANCE_SHORT, DEFENCE_LINE_MID, ATTACK_TYPE_AGRESSIVE, 'one', null)
	createTeam(DISTANCE_SHORT, DEFENCE_LINE_MID, ATTACK_TYPE_AGRESSIVE, 'two', null)

	// teams[teamname] = new Team(DISTANCE_SHORT, DEFENCE_LINE_MID, ATTACK_TYPE_AGRESSIVE, teamname)
	//Team.create(DISTANCE_SHORT, DEFENCE_LINE_MID, ATTACK_TYPE_AGRESSIVE)
	// var players = [{}]

	

	// comment('start', teams.one)
	// comment('start', teams.two)
	update({owner:'one', situation:0, variants: [] })
}

var logger = console.log;

function comment(type, player, teamname){
	logger(type, player, teamname)
}

function update(data){
	// who has the ball
	var ballOwner = data.owner; 
	
	// number, which tells us, which phase it was before
	// use it in some cases
	var situation = data.situation;

	// array with possible next situations
	var variants = data.variants;
	// variant is an object
	// value: number, that characterizes situation on the field
	// chance: float, that characterizes Probability of next situation
	//	// each time we compute the chance of some situation, based on team scheme, sum of player conditions and other factors...

	var newSituation = getSituation(variants)

}


start(null);