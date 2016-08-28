var sender = require('../requestSender');
var logger = require('../helpers/logger');

module.exports = function (req, res){
  var login = req.login;
  var data = req.body;
  var question = data.question;

  var answer1 = data.answer1;
  var answer2 = data.answer2;
  var answer3 = data.answer3;
  var answer4 = data.answer4;

  var topic = data.topic;

  var answers = [];
  answers.push(answer1);
  answers.push(answer2);
  answers.push(answer3);
  answers.push(answer4);

  var correct = data.correct;
  var obj = {
    createdBy: login,
    question: question,
    answers: answers,
    correct: correct
  };

  if (topic) {
    obj.topic = topic;
  }
  console.log(obj);

  var question_is_valid = login && question && answer1 && answer2 && answer3 && answer4 && correct && !isNaN(correct);
  if (!question_is_valid) {
    res.json({ code:0, msg: 'Произошла ошибка' });

    return;
  }

  sender.customSend("offerQuestion", obj, '127.0.0.1', 5010, res, function (error, response, body, res){
    if (error) {
      res.json({ code:0, msg: 'Ошибка сервера. Повторите вашу попытку чуть позже' });
      return;
    }

    if (body) {
      var code=0;
      var message = 'Ошибка';

      if (body.result=='ok') {
        code = 1;
        message = 'Добавление произошло успешно, вопрос отправлен на модерацию!';

        // Send('activity', { type:'addQuestion', sender: login, about: topic||' всё обо всём' })
      }
      res.json({ code:code , msg:message });
    }
  });

  // if (login && question && answer1 && answer2 && answer3 && answer4 && correct && !isNaN(correct)){
  //   sender.customSend("offerQuestion", obj, '127.0.0.1', 5010, res, function (error, response, body, res){
  //     if (error) return res.render('AddQuestion', { code:0, msg: 'Ошибка сервера. Повторите вашу попытку чуть позже' })
  //     if (body){
  //       var code=0;
  //       var message = 'Ошибка';
  //       if (body.result=='ok') {
  //         code = 1;
  //         message = 'Добавление произошло успешно, вопрос отправлен на модерацию!'
  //       }
  //       res.render('AddQuestion', { code:code , msg:message });
  //     }
  //   });
  // } else {
  //   res.render('AddQuestion', { code:0, msg: 'Произошла ошибка' });
  // }
};
