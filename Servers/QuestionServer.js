var gs = require('../gameModule');
var app = gs.app;
var games = gs.games;
var send = gs.SendToRoom;
var strLog = gs.strLog;
var getUID = gs.getUID;
var FinishGame = gs.FinishGame;

var UpdPeriod = 4000;
//var SendPeriod = UpdPeriod;
var NUMBER_OF_QUESTIONS=6;

var questionDir = './frontend/games/Questions/';
var questionFolder = 'general';

var fs = require('fs');

app.post('/AddQuestions', function (req, res){
	var data = req.body;
	AddQuestions(data, res);
})

app.post('/Points', function (req, res){
	var data = req.body;
	var login = data.login;
	var gameID= data.gameID;
	var tournamentID = tournamentID;
	if (games[gameID] && login && games[gameID].scores[login]){
		res.json({points: games[gameID].scores[login]});
	}
	else{
		res.json({points:0});
	}
})

function Init(gameID, playerID){
	strLog('custom init works! gameID:'+gameID + ' playerID:'+playerID);

	if (playerID==0){
		games[gameID].questIndex = -1;
		setQuestion(gameID);
		games[gameID].userAnswers = [];
	}
	strLog('FULL GAME INFO');
	strLog(JSON.stringify(games[gameID] ));
	games[gameID].userAnswers.push({});//[playerID] = {};
}

function AsyncUpdate(gameID){
	strLog('AsyncUpdate. be aware of  questions length!!! it must be games[gameID].questions' );
	if (games[gameID].questIndex < games[gameID].questions.length - 1){ // NUMBER_OF_QUESTIONS - 1){
		if (games[gameID].questIndex>=0){
			checkAnswers(gameID);
		}
		games[gameID].questIndex++;
		send(gameID, 'update', getQuestions(gameID));
	}
	else{
		checkAnswers(gameID);
		FinishGame(gameID, FindWinner(gameID) );
	}
}

function Action(gameID, playerID, movement, userName){
	strLog('FIX Action AnswerIsCorrect!!! IF PLAYER WILL PRESS ALL ANSWERS FASTLY, HE WILL INCREASE HIS POINTS');
	var currQuestionIndex = games[gameID].questIndex;
	var time = new Date();

	games[gameID].userAnswers[playerID][currQuestionIndex] = { answer:movement.answer, time:time };
}

var PointsPerSecond=10;

function checkAnswers(gameID){
	var game = games[gameID];

	var currQuestionIndex = game.questIndex;

	for (var i=0; i< game.userAnswers.length; ++i){
		var AnswerData = game.userAnswers[i][currQuestionIndex];
		//console.log(AnswerData);

		if (!AnswerData) continue;

		if (!AnswerData) console.log('no AnswerData after continue');
		var answer = AnswerData.answer;
		if (AnswerIsCorrect(gameID, answer)){
			var userName = getUID(gameID, i);
			//games[gameID].scores[userName]++;
			var now = new Date();
			var diff = now - AnswerData.time;
			games[gameID].scores[userName]+= 1000 + diff*PointsPerSecond/1000;
		}
	}
}

gs.StartGameServer({
	port:5010,
	gameName:'Questions',
	gameTemplate: 'qst_game'
}, Init, AsyncUpdate, Action, UpdPeriod);

console.log('started');


function AddQuestions(data, res){
	strLog('AddQuestions');
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

function tryToLoadQuestion(id, files, gameID){
	//find suitable file name
	if (id>files.length) id = files.length-1;
	var qFileName = files[id];
	while(contains(qFileName,'~') ){
		id--;
		qFileName = files[id];
	}

	// open file by file name
	var jsFile=readJSONfile( questionDir+ questionFolder+'/'+qFileName);

	// add questions to game
	games[gameID].source = qFileName;
	games[gameID].questions = jsFile.qst;
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


/*function loadQuestList(folder, id, cb){
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
	});*/

	/*var file = fs.readFileSync(questionDir+folder+  '.txt', "utf8");
	console.log(file);
	var questions =  JSON.parse(file);
	console.log(JSON.stringify(questions));
}*/

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

/*function getNumberOfQuestionsByTopic(topic){
	fs.readdir(questionDir+folder, function callback (err, files){
		if (err){ strLog('Err while reading file : ' + JSON.stringify(err) ); }
		else{
			strLog('Files: ');

		}

	});
	return 1;
}*/

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
		return { question:'GAME DOES NOT EXIST', answers:[0,1,2,3], correct:1 };
	}
}

function getQuestions(gameID){
	strLog('Rewrite getQuestions function!!');
	var curQuest = getCurrentQuestion(gameID);
	return { question: curQuest.question , answers:curQuest.answers };
}

function AnswerIsCorrect(gameID, answer){
	var correct = getCurrentQuestion(gameID).correct;
	strLog('Player answer = ' + answer + ' , while correct is :' + correct, 'Games');
	if (answer && answer == correct ){
		return true;
	}
	else{
		return false;
	}
}