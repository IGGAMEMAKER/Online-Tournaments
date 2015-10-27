// Add tournament

const Browser = require('zombie');
 
Browser.localhost('localhost');
 
describe('Add tournament with good parameters', function() {
 
  const browser = new Browser();
 
  before(function(done) {
    browser.visit('AddTournament', done);
  });
 
  describe('Deposit money', function() {
 
    before(function(done) {
      //.fill('password', 'wasd')
      browser
        .fill('cash', 10)
        .pressButton('Deposit', done);
    });
 
    it('should be successful', function() {
      browser.assert.success();
    });
 
    it('should see welcome page', function() {
      //browser.assert.text('title', 'Deposit');
      console.log(browser.location.href);
    });

  });
});


/*describe('Cashout money', function() {
 
  const browser = new Browser();
 
  before(function(done) {
    browser.visit('/Cashout', done);
  });
 
  describe('Cashout', function() {
 
    before(function(done) {
      //.fill('password', 'wasd')
      browser
        .fill('money',    '10')
        .pressButton('Cashout', done);
    });
 
    it('should be successful', function() {
      browser.assert.success();
    });
 
    it('should see welcome page', function() {
      browser.assert.text('title', 'Cashout');
      console.log(browser.location.href);
    });
  });
});*/