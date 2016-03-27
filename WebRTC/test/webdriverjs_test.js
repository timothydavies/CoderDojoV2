
var should = require('should');
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');
    assert = require('assert');
    chai.use(chaiAsPromised);
    expect = chai.expect;
    chai.Should();
var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var io = require('socket.io-client');
const mochaTimeOut = 30000; //ms
 
test.describe('Feedbacktest', function() {
  this.timeout(mochaTimeOut);
  test.before(function(){
      ninjaSocket = io('https://localhost:8000',{forceNew: true});
  });
  test.it('shows a quote container', function () {
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    driver.get('https://localhost:8000/sign_in?url=%2FMentor');
    driver.isElementPresent(webdriver.By.id('email')).then(function(present) {
      present.should.equal( true);
    });
    driver.quit();
  });
});