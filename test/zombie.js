const Browser = require('zombie');
 
// We're going to make requests to http://example.com/signup 
// Which will be routed to our test server localhost:3000 
Browser.localhost('localhost');
 
describe('User visits signup page', function() {
 
  const browser = new Browser();
 
  before(function(done) {
    browser.visit('/Login', done);
  });
 
  describe('Correct Login and password', function() {
 
    before(function(done) {
      browser
        .fill('login',    'gaginho')
        .fill('password', 'wasd')
        .pressButton('Log in', done);
    });
 
    it('should be successful', function() {
      browser.assert.success();
    });
 
    it('should see welcome page', function() {
      browser.assert.text('title', 'Tournaments');
      console.log(browser.location.href);
    });
  });
});

describe('User visits signup page', function() {
 
  const browser = new Browser();
 
  before(function(done) {
    browser.visit('/Login', done);
  });

  describe('Correct login and wrong password', function() {
 
    before(function(done) {
      browser
        .fill('login',    'gaginho')
        .fill('password', 'wasd1')
        .pressButton('Log in', done);
    });
 
    it('should be successful', function() {
      browser.assert.success();
    });
 
    it('should see login page again', function() {
      browser.assert.text('title', 'Login');
      console.log(browser.location.href);
    });
  });
});

describe('User visits signup page', function() {
 
  const browser = new Browser();
 
  before(function(done) {
    browser.visit('/Login', done);
  });

  describe('Empty form', function() {
 
    before(function(done) {
      browser
        .pressButton('Log in', done);
    });
 
    it('should be successful', function() {
      browser.assert.success();
    });
 
    it('should see login page again', function() {
      browser.assert.text('title', 'Login');
      console.log(browser.location.href);
    });
  });
});

  //describe('Profile', function() {
 
    /*before(function(done) {
      browser
        .fill('login',    'gaginho')
        .fill('password', 'wasd1')
        .pressButton('Log in', done);
    });*/
  /*
    it('should be successful', function() {
      browser.assert.success();
    });
 
    it('should see welcome page', function() {
      browser.assert.text('title', 'Tournaments');
      console.log(browser.location.href);
    });
  });*/


//});