var gs = require('../gameModule.js');
var app = gs.app;
var games = gs.games;
var send = gs.SendToRoom;
var strLog = gs.strLog;
var getUID = gs.getUID;
var FinishGame = gs.FinishGame;


var UpdPeriod = 5000;
var SendPeriod = UpdPeriod;

var Questions = [
	{question:'Гагин любимый цвет', 					answers:['Красный'	,'Зелёный'	,'Золотой'	,'Синий'], 	correct: 1 },
	{question:'Гагин САМЫЙ любимый футболист', 			answers:['Модрич'	,'Зидан'	,'Рамос'	,'Хамес'], 	correct: 2 },
	{question:'Гагин возраст', 							answers:['20'		,'21'		,'19'		,'13'], 	correct: 1 },
	{question:'Гагина любимая еда', 					answers:['хачапури'	,'шашлык'	,'отбивная'	,'хинкали'],correct: 3 },
	{question:'Гагин любимый футбольный клуб', 			answers:['Барселона','МЮ'		,'Реал Мадрид','Челси'],correct: 3 },
	{question:'Гагин любимый язык программирования', 	answers:['js'		,'Java'		,'C++'		,'C#'],		correct: 4 }
]

function Init(gameID, playerID){
	strLog('custom init works! gameID:'+gameID + ' playerID:'+playerID);
	games[gameID].questIndex = 0;
	//games[gameID].players
}

function AsyncUpdate(gameID){
	send(gameID, 'Questions', getQuestions(gameID));
	strLog('AsyncUpdate. be aware of  Questions.length!!! it must be games[gameID].Questions' );
	if (games[gameID].questIndex < Questions.length-1){
		games[gameID].questIndex++;
	}
	else{
		FinishGame(gameID, FindWinner(gameID) );
	}
}
function FindWinner(gameID){
	var game = games[gameID];
	strLog(game.scores);
	var userName = getUID(gameID, 0);
	strLog('Winner is: ' + userName);
	return userName;
	/*for (var playerID in userIDs){
		return 
	}*/
}

function getCurrentQuestion(gameID){
	if (games[gameID]){
		var a = Questions[games[gameID].questIndex];
		strLog(JSON.stringify(a));
		strLog('questIndex = ' + games[gameID].questIndex);
		return a;//Questions[games[gameID].questIndex];
	}
	else{
		return { question:'no gameID', answers:[0,1,2,3], correct:1 };
	}
}

function getQuestions(gameID){
	strLog('Rewrite getQuestions function!!');
	var curQuest = getCurrentQuestion(gameID);
	return {question: curQuest.question , answers:curQuest.answers };
	//return games[gameID].Questions;
}

/*var sender = setInterval(function(){
	send()
}, SendPeriod);*/
function Action(gameID, playerID, movement, userName){
	if (AnswerIsCorrect(gameID, movement.answer)){
		games[gameID].scores[userName]++;	
	}
}

function AnswerIsCorrect(gameID, answer){
	if (answer && answer == getCurrentQuestion(gameID).correct ){
		return true;
	}
	else{
		return false;
	}
}

gs.StartGameServer({
	port:5009
}, Init, AsyncUpdate, Action, UpdPeriod);

console.log('started');