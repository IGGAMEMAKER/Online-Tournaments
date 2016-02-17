var gs = require('../gameModule');
var app = gs.app;
var games = gs.games;
var send = gs.SendToRoom;
var strLog = gs.strLog;
var getUID = gs.getUID;
var FinishGame = gs.FinishGame;

//var SendPeriod = UpdPeriod;
var NUMBER_OF_QUESTIONS=6;

var questionDir = './frontend/games/Questions/';
var questionFolder = 'general';

var fs = require('fs');

var configs = require('../configs');
console.log(configs);
var UpdPeriod = configs.quizQuestionPeriod;// || 4000;

var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://'+configs.db+'/test');

var random = require('mongoose-simple-random');


const MODERATION_NONE = 0;
const MODERATION_REJECTED = 1;
const MODERATION_OK = 2;
const MODERATION_MODIFIED = 3;


var s = new mongoose.Schema({ 
	question: String, language: String,
	answers: Array, correct:Number,
	tournamentID: Number, topic:String,
	questionID: Number,

	moderation: Number,
	createdBy: String
});
s.plugin(random);

var Question = mongoose.model('Question', s);

var lg = console.log;

app.get('/AddQuestion', function (req, res){
	res.render('add_question');
})
app.post('/AddQuestion', function (req, res){

	var data = req.body;
	var answers=[];

	answers.push(data.answer1);
	answers.push(data.answer2);
	answers.push(data.answer3);
	answers.push(data.answer4);

	var obj = {
		question: data.question
		,	answers: answers
		,	correct: data.correct
		//,tournamentID: data.tournamentID
	}

	if (data.tournamentID) {
		obj.tournamentID = data.tournamentID;
	}
	if (data.topic) obj.topic = data.topic;
	
	AddQuestion(obj, res);
})

function AddQuestion(data, res){
	var question = new Question(data);

	question.save(function (err){
		if (err){
			strLog('cannot save new question((( ' + JSON.stringify(err), 'Err');
			if (res) res.json({result:'error', msg:err})
			return;
		}
		if (res) res.json({result:'ok', msg:'question saved'});
		strLog('question saved!', 'Games');
	})
}

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

function add_questions(questions, gameID){
	strLog('add_questions questions for ' + gameID + '   ' + JSON.stringify(questions), 'Games');

	games[gameID].questions=[];
	for (var i = questions.length - 1; i >= 0; i--) {
		var qst = questions[i];
		var question = qst.question;
		var answers = qst.answers;
		var correct = qst.correct;

		games[gameID].questions.push({question:question, answers:answers, correct:correct});
	};
}

//loadRandomQuestions(100);
function add_question_to_list(gameID, qst){
	var question = qst.question;
	var answers = qst.answers;
	var correct = qst.correct;

	games[gameID].questions.push({question:question, answers:answers, correct:correct});
}



function find_random_question(gameID, left, count, attempts){
	//var offset = Math.random()*count;
	//if (!attempts) attempts={};

	var offset = parseInt(Math.random()*count);
	lg('offset = ' + offset, 'left: ' , left, 'attempts', attempts);
	Question.findOne({},'', { skip: offset}, function (err, question){
		if (err) return strLog('find_random_question Err ' + JSON.stringify(err), 'Err');

		// check if it is not prepared for special tournament;
		// and we did not add this question before
		lg('tryToLoadQuestion: ', question.question);

		if (is_not_special(question) && !attempts[offset]) { //!question_was_added(offset, attempts)
			add_question_to_list(gameID, question); //attempts.push(offset);
			attempts[offset] = 1;

			if (left>1) return find_random_question(gameID, left-1, count, attempts);
		} else {
			find_random_question(gameID, left, count, attempts);
		}
	})
}

function question_was_added(offset, attempts){
	return attempts[offset] == 1;
}

function is_not_special(question){
	return (!question.tournamentID);
}

function loadRandomQuestions(gameID){
	Question.count(function (err, count){
		if (err) return lg('err while count', err);
		else {
			lg('count= ' + count);
			games[gameID].questions=[];

			find_random_question(gameID, NUMBER_OF_QUESTIONS, count, {});
		}
	})
}


function load_questions_fromDB(gameID){
	Question.find({tournamentID:gameID}, '', function (err, questions){
		lg('load_questions_fromDB ' + gameID);
		if (err) {
			strLog('err in special questions for ' + gameID, 'Err');
		}

		if (questions && questions.length > 0) return add_questions(questions, gameID);

		strLog('no special questions for ' + gameID, 'Games');
		loadRandomQuestions(gameID);
	})
}

function isNewbieTournament(gameID){
	return games[gameID].settings && games[gameID].settings.hidden;
}

function load_newbie_questions(gameID){
	var topic = games[gameID].settings.topic;
	strLog("searching questions for newbies... Topic:"+ topic, "Games");
	Question.find({topic:topic}, '', function (err, questions){
		lg('load_newbie_questions ' + gameID);
		if (err) {
			strLog('err in load_newbie_questions for ' + gameID, 'Err');
		}

		if (questions && questions.length > 0) return add_questions(questions, gameID);

		strLog('no special questions for ' + gameID, 'Games');
		loadRandomQuestions(gameID);
	})
}

function Init(gameID, playerID){
	strLog('custom init works! gameID:'+gameID + ' playerID:'+playerID);

	if (playerID==0){
		games[gameID].questIndex = -1;
		console.log(games[gameID].settings);

		if (isNewbieTournament(gameID)) { 
			load_newbie_questions(gameID);
		} else {
			load_questions_fromDB(gameID);
		}
		
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

function contains(word, symbol){
	return word.indexOf(symbol) > -1;
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
	}	else {
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
	} else {
		return false;
	}
}