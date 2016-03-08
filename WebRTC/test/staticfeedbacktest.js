var webdriverio = require('webdriverio');
var should = require('should');
var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};

var x=webdriverio
    .remote(options);

 
describe('Index page', function() {
var s;

  //this.timeout = 99999999;

  it('should open chat application', function* () {
      
          yield x.init()
            .url('webdriver.io/guide.html');
            
          var title=yield x.getTitle();
          title.should.equal('---');
          console.log(title);
      
    });
    x.end();
    
});