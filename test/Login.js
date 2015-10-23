const Browser = require('zombie');
 
Browser.localhost('localhost');
 
describe('Wrong password', function() {
  this.timeout(5000);
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

describe('Good login', function() {
  this.timeout(5000);
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

describe('Empty form', function() {
  this.timeout(5000);
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


describe('Adding gifts', function() {
  this.timeout(5000);
  const browser = new Browser();
 
  before(function(done) {
    browser.visit('/AddGift', done);
  });

  describe('Add Gift', function() {
 
    before(function(done) {
      browser
        .fill('name', 'Porsche 911')
        .fill('description', 'JUST Porsche 911')
        .fill('price', '182000')
        .fill('photoURL', 'http://files1.porsche.com/filestore.aspx/porsche-911-Turbo-image?pool=multimedia&type=galleryimagerwd&id=rd-2013-991-tus-gallery-exterior-08&lang=none&filetype=preview&version=a58d3e33-366d-11e3-bd76-001a64c55f5c')
        .fill('URL','http://www.porsche.com/usa/models/911/911-turbo-s/')
        .pressButton('Add Gift', done);
    });
 
    it('should be successful', function() {
      browser.assert.success();
    });
 
    it('should see AddGift page again, but with success message', function() {

      browser.assert.text('title', 'AddGift');
      browser.assert.element('#addResult');
      //browser.assert.text('addResult',{"result":"OK"});
      //console.log(browser.location.href);
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