var gs = require('../gameModule');
var app = gs.app;
var games = gs.games;
var send = gs.SendToRoom;
var strLog = gs.strLog;
var getUID = gs.getUID;
var FinishGame = gs.FinishGame;
var FastLog = function(){}// gs.FastLog;

var UpdPeriod = 5000; //50 times per second = 20ms;
var fs = require('fs');

var gameConfigs = {};

function LoadConfigs(){

	var file = fs.readFileSync('./configs/battleConfigs.txt', "utf8");
	console.log(file);
	gameConfigs =  JSON.parse(file);
}

function mod2(val, Y){
	//return val%2==0?'top':'bottom';
	if (val>0){ return Y; }
	else { return 0; }
}

var DEFAULT_ARMY_SIZE=4;
var DEFAULT_MAP_SIZE=15;
var OWNER_NONE=-1;
var LAND_TYPE_DEFAULT=0;

function Init(gameID, playerID){
	var horiz = gameConfigs.horizontal||0;
	strLog('custom init works! gameID:'+gameID + ' playerID:'+playerID);

	games[gameID].gameDatas[playerID]={};

	var sizeOfArmy = gameConfigs.sizeOfArmy || DEFAULT_ARMY_SIZE;
	var mapSize = gameConfigs.mapSize || DEFAULT_MAP_SIZE;

	if (playerID==0){
		games[gameID].map = CreateMap({width:mapSize, height:mapSize});
		games[gameID].armies = {};
	}

	//***********
	games[gameID].armies[playerID] = CreateArmy(gameID, sizeOfArmy, playerID, mapSize-5);


	//***********

	if (playerID==1){
		printGameState(gameID);
	}
}

function getParameters(gameID, userName){
	strLog('getParameters');
	console.log(games[gameID].userIDs);
	strLog(JSON.stringify(games[gameID].userIDs));
	return games[gameID].userIDs;
}

function AsyncUpdate(gameID){
	send(gameID, 'update', { map:games[gameID].map, armies:games[gameID].armies });
	/*UpdateCollisions(gameID, gameID);
	var ball = games[gameID].ball || null;
	var datas = games[gameID].gameDatas || null;
	send(gameID, 'update', { ball: ball, gameDatas: datas });*/
}
var ACTION_TYPE_MOVEMENT='move';
var ACTION_TYPE_SKIP='skip';
var ACTION_TYPE_FIRE='fire';
var ACTION_TYPE_ATTACK='attack';

function Action(gameID, playerID, movement, userName){
	//games[gameID].gameDatas[playerID].x = movement.x;
	if (!movement || !movement.type) return;

	switch (movement.type){
		case ACTION_TYPE_MOVEMENT:
			move(gameID, playerID, movement);
		break;
		case ACTION_TYPE_SKIP:
			skip(gameID, playerID, movement);
		break;
		case ACTION_TYPE_ATTACK:
			attack(gameID, playerID, movement);
		break;
		case ACTION_TYPE_FIRE:
			fire(gameID, playerID, movement);
		break;
		default:
			strLog('Invalid movement.type: ' + movement.type);
		break;
	}
}

gs.StartGameServer({
	port:5011,
	gameName:'Battle',
	gameTemplate: 'battle'
}, Init, AsyncUpdate, Action, UpdPeriod, getParameters);

function printGameState(gameID){
	printMap(gameID);

	//console.log(games[gameID].armies);
}

function printMap(gameID){
	var mapStr='\n';
	for (var i=0; i < DEFAULT_MAP_SIZE; i++){
		var line ='';
		for (var j=0; j < DEFAULT_MAP_SIZE; j++){
			if (games[gameID].map[i][j].owner==-1){
				line+='.';
			} else {
				line += games[gameID].map[i][j].owner;//+' ';
			}
		}
		mapStr+= line+'\n';
	}
	console.log(mapStr);
}

function move(gameID, playerID, movement) {
	if (movement){
		var target = movement.target
		, squadID = movement.squadID
		, squad = getSquad(gameID, playerID, squadID)
		, direction = calcDirection(squad.x, squad.y, target.x, target.y)
		, previousX = squad.x
		, previousY = squad.y;

		if (!landIsFree(gameID, target.x, target.y) || !hasSteps(squad) ) return;

		updateSquadPosition(gameID, playerID, squadID, target, direction);
		decreaseSteps(gameID, playerID, squadID);

		takeLand(gameID, squad, playerID);
		freeLand(gameID, previousX, previousY);
	}
}

function skip(gameID, playerID, movement) {
	if (!movement) return;
	var squadID = movement.squadID;
	games[gameID].armies[playerID][squadID].stepsLeft=0;
}

function attack(gameID, playerID, movement) {}

function fire(gameID, playerID, movement) {}

function getSquad(gameID, playerID, squadID) {
	return games[gameID].armies[playerID][squadID];
}

function decreaseSteps(gameID, playerID, squadID) {
	games[gameID].armies[playerID][squadID].stepsLeft--;
}

function updateSquadPosition(gameID, playerID, squadID, target, direction) {
	games[gameID].armies[playerID][squadID].x = target.x;
	games[gameID].armies[playerID][squadID].y = target.y;
	games[gameID].armies[playerID][squadID].direction = direction;
}

function landIsFree(gameID, x, y) {
	return games[gameID].map[y][x].owner == OWNER_NONE;
}

function takeLand(gameID, squad,playerID) {
	var x=squad.x, y=squad.y;
	games[gameID].map[y][x].owner = playerID;
	games[gameID].map[y][x].squadID = squad.squadID;
}

function freeLand(gameID, x, y) {
	games[gameID].map[y][x].owner = OWNER_NONE;
	games[gameID].map[y][x].squadID = OWNER_NONE;
}

function CreateMap(options) {
	var map = ZeroFilledMap(options.width, options.height);
	map = makeLandscape(map);
	return map;
}

function CreateArmy(gameID, sizeOfArmy, playerID, Y) {
	var deltaX=4;
	var army = [];
	var y = mod2(playerID, Y);
	
	for (var i=0; i < sizeOfArmy; ++i){
		var x = i;
		var squad = CreateSquad(x+deltaX, y, i, playerID);

		army.push(squad);
		takeLand(gameID, squad, playerID);
	}
	return army;
}

function CreateSquad(x, y, squadID, owner) {
	return {
		health:100
		, power:35
		, speed:4
		, fireRange:0

		, fatigue:0
		, isFighting:0
		, stepsLeft:4
		, direction:0
		, directionX:0
		, directionY:0

		, x:x
		, y:y
		, squadID:squadID
		, owner:owner
	}
}

function defaultLand() {
	return {
		type:LAND_TYPE_DEFAULT
		, owner:OWNER_NONE // -1 -- free; 0 - player 0 holds land; 1 - player 1 holds land
		, squadID:OWNER_NONE
	};
}





function ZeroFilledMap(m,n) {
	var map = [];
	for (var i = 0; i < m; i++) {
		map[i] = [];
		for (var j = 0; j < n; j++) {
			map[i][j] = defaultLand();
		}
	}
	return map;
}

function makeLandscape(map) {
	return map;
}


function incr(gameID, i) {
	var userName = getUID(gameID, i);
	var game = games[gameID];

	strLog('increment score of ' + userName + ' in game ' + gameID);

	game.scores[userName]++;
	game.gameDatas[i].score++;

	if( game.scores[userName] == 3){ 
		FinishGame(gameID, userName);
	}
}