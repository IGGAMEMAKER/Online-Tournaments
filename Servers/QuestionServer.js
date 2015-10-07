var gs = require('../gameModule.js');
var app = gs.app;
var games = gs.games;
var send = gs.SendToRoom;
var strLog = gs.strLog;
var getUID = gs.getUID;
var FinishGame = gs.FinishGame;

var UpdPeriod = 2000;
var SendPeriod = UpdPeriod;

var questionDir = './frontend/games/Questions/';
var questionFolder = 'general';

var fs = require('fs');

app.post('/AddQuestions', function (req, res){
	var data = req.body;
	AddQuestions(data, res);
})


var QT0 = [
	{question:'Гагин любимый цвет (QT0)', 					answers:['Красный'	,'Зелёный'	,'Золотой'	,'Синий'], 	correct: 1 },
	{question:'Гагин САМЫЙ любимый футболист', 			answers:['Модрич'	,'Зидан'	,'Рамос'	,'Хамес'], 	correct: 2 },
	{question:'Гагин возраст', 							answers:['20'		,'21'		,'19'		,'13'], 	correct: 1 },
	{question:'Любимая еда Гаги', 					answers:['хачапури'	,'шашлык'	,'отбивная'	,'хинкали'],correct: 3 },
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

	if (playerID==0){
		setQuestion(gameID);
	}
	//games[gameID]

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

function Action(gameID, playerID, movement, userName){
	strLog('FIX Action AnswerIsCorrect!!! IF PLAYER WILL PRESS ALL ANSWERS FASTLY, HE WILL INCREASE HIS POINTS');
	if (AnswerIsCorrect(gameID, movement.answer)){
		games[gameID].scores[userName]++;	
	}
}

gs.StartGameServer({
	port:5010,
	gameName:'Questions',
	gameTemplate: 'qst_game'
}, Init, AsyncUpdate, Action, UpdPeriod);

console.log('started');


function AddQuestions(data, res){

}

function setQuestion(gameID){
	var topic = questionFolder;// 'general';// null;
	strLog('here must be games[gameID].topic instead of null !!!');

	fs.readdir(questionDir+topic, function callback (err, files){
		if (err){ strLog('Err while reading file : ' + JSON.stringify(err) ); }
		else{
			strLog('Files: ' + JSON.stringify(files));
			var qCount = files.length;

			var randomVal = parseInt((parseInt(Math.random()*qCount))%qCount);
			strLog('Rand: ' + randomVal);

			if (randomVal==qCount){
				randomVal=0;
				strLog('RANDOM VALUE EQUALS MAX!!!');
			}
			tryToLoadQuestion(randomVal, files, gameID);
		}
	});
}

function readJSONfile(fullPath){//gives you the json from file
	var file = fs.readFileSync(fullPath, "utf8");
	console.log(file);
	
	var jsFile =  JSON.parse(file);
	//console.log(JSON.stringify(jsFile));
	return jsFile;
}

function contains(word, symbol){
	return word.indexOf(symbol) > -1;
}

function tryToLoadQuestion(id, files, gameID){
	//find suitable file name
	if (id>files.length) id = files.length-1;
	var qFileName = files[id];
	while(contains(qFileName,'~') ){
		id--;
		qFileName = files[id];
	}

	//open file by file name
	var jsFile=readJSONfile( questionDir+ questionFolder+'/'+qFileName);

	//add questions to game
	games[gameID].source = qFileName;
	games[gameID].questions = jsFile.qst;

}

function loadQuestList(folder, id, cb){
	var qFile;
	fs.readdir(questionDir+folder, function callback (err, files){
		if (err){ strLog('Err while reading file : ' + JSON.stringify(err) ); }
		else{
			strLog('Files: ' + JSON.stringify(files));

			if (id>files.length) id = files.length-1;
			qFile = files[id];
			while(contains(qFile,'~') ){
				id--;
				qFile = files[id];
			}
			//qFile = files[id];
			strLog(JSON.stringify(files));

			var q = readJSONfile(questionDir+folder+'/'+qFile);

		}
	});

	/*var file = fs.readFileSync(questionDir+folder+  '.txt', "utf8");
	console.log(file);
	var questions =  JSON.parse(file);
	console.log(JSON.stringify(questions));*/
}

//setTimeout( function(){loadQuestList(questionFolder)}, 1750);

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

/*function getCurrentQuestion(gameID){
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
}*/

function getNumberOfQuestionsByTopic(topic){
	fs.readdir(questionDir+folder, function callback (err, files){
		if (err){ strLog('Err while reading file : ' + JSON.stringify(err) ); }
		else{
			strLog('Files: ');

		}

	});


	return 1;
}
function noQuestions(game){
	return !game.questions;
}
function getCurrentQuestion(gameID){
	strLog('getCurrentQuestion : ' + gameID);
	//get number of questions of this topic
	var game = games[gameID];
	if (game){

		if (games[gameID].questions){
			strLog(JSON.stringify(games[gameID].questions ));
			var currQuestionIndex = games[gameID].questIndex;
			var a = games[gameID].questions[currQuestionIndex];
			
			strLog('questIndex = ' + currQuestionIndex);
			strLog(JSON.stringify(a));
			return a;
		}
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

function AnswerIsCorrect(gameID, answer){
	strLog('Player answer = ' + answer + ' , while correct is :' + getCurrentQuestion(gameID).correct );
	if (answer && answer == getCurrentQuestion(gameID).correct ){
		return true;
	}
	else{
		return false;
	}
}