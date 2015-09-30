var gs = require('../gameModule.js');
var app = gs.app;
var games = gs.games;
var send = gs.SendToRoom;
var strLog = gs.strLog;
var getUID = gs.getUID;
var FinishGame = gs.FinishGame;

var UpdPeriod = 10000;
var SendPeriod = UpdPeriod;


var QT0 = [
	{question:'Гагин любимый цвет (QT0)', 					answers:['Красный'	,'Зелёный'	,'Золотой'	,'Синий'], 	correct: 1 },
	{question:'Гагин САМЫЙ любимый футболист', 			answers:['Модрич'	,'Зидан'	,'Рамос'	,'Хамес'], 	correct: 2 },
	{question:'Гагин возраст', 							answers:['20'		,'21'		,'19'		,'13'], 	correct: 1 },
	{question:'Гагина любимая еда', 					answers:['хачапури'	,'шашлык'	,'отбивная'	,'хинкали'],correct: 3 },
	{question:'Гагин любимый футбольный клуб', 			answers:['Барселона','МЮ'		,'Реал Мадрид','Челси'],correct: 3 },
	{question:'Гагин любимый язык программирования', 	answers:['js'		,'Java'		,'C++'		,'C#'],		correct: 4 }
];
var QT1 = [
	{question:'Самая большая страна в мире',			answers:['Россия'	,'Китай'	,'США'	,'Никарагуа'], 	correct: 1 },
	{question:'Количество дней в январе', 				answers:['365','30','367','31'], correct: 4 },
	{question:'Самый быстрый человек в мире',			answers:['Усейн Болт','Роналду'	,'Форрест Гамп','Бэйл'],correct: 1 },
	{question:'Возраст самого пожилого человека в мире',answers:['150'	,'200'	,'125'	,'94'], correct: 3 },
	{question:'Количество дней в високосном году',		answers:['365','366','367','400'], correct: 2 },
	{question:'Самая высокая гора в мире',	 			answers:['Эльбрус'	,'Монт Блан','Эверест'	,'Альпы'], 	correct: 3 }
];
var QT2 = [
	{question:'Самая большая страна в мире',			answers:['Россия'	,'Китай'	,'США'	,'Никарагуа'], 	correct: 1 },
	{question:'Количество дней в январе', 				answers:['365','30','367','31'], correct: 4 },
	{question:'Самый быстрый человек в мире',			answers:['Усейн Болт','Роналду'	,'Форрест Гамп','Бэйл'],correct: 1 },
	{question:'Возраст самого пожилого человека в мире',answers:['150'	,'200'	,'125'	,'94'], correct: 3 },
	{question:'Количество дней в високосном году',		answers:['365','366','367','400'], correct: 2 },
	{question:'Самая высокая гора в мире',	 			answers:['Эльбрус'	,'Монт Блан','Эверест'	,'Альпы'], 	correct: 3 }
];

var Questions = [QT0,QT1,QT2,QT0,QT1,QT2,QT0,QT0,QT1,QT2,QT0,QT1,QT2,QT0,QT0,QT1,QT2,QT0,QT1,QT2,QT0];

function Init(gameID, playerID){
	strLog('custom init works! gameID:'+gameID + ' playerID:'+playerID);
	games[gameID].questIndex = -1;
	//games[gameID].players
}
var NUMBER_OF_QUESTIONS=6;
function AsyncUpdate(gameID){
	
	strLog('AsyncUpdate. be aware of  questions length!!! it must be games[gameID].questions' );
	if (games[gameID].questIndex < NUMBER_OF_QUESTIONS - 1){
		games[gameID].questIndex++;
		send(gameID, 'update', getQuestions(gameID));
	}
	else{
		FinishGame(gameID, FindWinner(gameID) );
	}
}
function FindWinner(gameID){
	var game = games[gameID];
	strLog(JSON.stringify(game.scores));
	var userName = getUID(gameID, 0);
	var maxScore=0;
	for (var playerID in game.userIDs){
		var uName = getUID(gameID,playerID);
		var curScore = game.scores[uName];
		if (curScore > maxScore){
			maxScore = curScore;
			userName = uName;
		}
	}
	strLog('Winner is: ' + userName);
	return userName;
}

function getCurrentQuestion(gameID){
	strLog('getCurrentQuestion : ' + gameID);
	if (games[gameID]){
		var currQuestionIndex = games[gameID].questIndex;
		var a;
		if (gameID< Questions.length -1){
			a = Questions[gameID][currQuestionIndex];
		}
		else{
			a = QT2[currQuestionIndex];
		}
		
		strLog('questIndex = ' + currQuestionIndex);
		strLog(JSON.stringify(a));
		return a;
	}
	else{
		return { question:'no gameID', answers:[0,1,2,3], correct:1 };
	}
}

function getQuestions(gameID){
	strLog('Rewrite getQuestions function!!');
	var curQuest = getCurrentQuestion(gameID);
	return { question: curQuest.question , answers:curQuest.answers };
}

function Action(gameID, playerID, movement, userName){
	strLog('FIX Action AnswerIsCorrect!!! IF PLAYER WILL PRESS ALL ANSWERS FASTLY, HE WILL INCREASE HIS POINTS');
	if (AnswerIsCorrect(gameID, movement.answer)){
		games[gameID].scores[userName]++;	
	}
}

function AnswerIsCorrect(gameID, answer){
	strLog('Player answer = ' + answer + ' , while correct is :' + getCurrentQuestion(gameID).correct );
	if (answer && answer == getCurrentQuestion(gameID).correct ){
		return true;
	}
	else{
		return false;
	}
}

gs.StartGameServer({
	port:5010,
	gameName:'Questions'
}, Init, AsyncUpdate, Action, UpdPeriod);

console.log('started');