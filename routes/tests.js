var API = require('../helpers/API');
var respond = require('../middlewares/api-response');

module.exports = (app) => {
  app.get('/api/tests', respond(req => {
    return API.tests.get();
  }));

  app.get('/api/tests/:id', respond(req => {
    return API.tests.getTestDataById(req.params.id);
  }));

  app.post('/api/tests/like/:id', (req, res) => {
    if (req.login) {
      // save this to TestResult
      // increment likes in Tests
    } else {
      // increment likes in Tests0
    }
  });

  app.post('/api/tests/save-test-result', (req, res) => {
    res.json({
      msg: 'ok'
    });
  });

  app.post('/api/tests/my-test-results', (req, res) => {
    // get login
    res.json({
      results: [
        {
          id: 'qweqweqwe',
          score: 5
        }
      ]
    })
  })
};
