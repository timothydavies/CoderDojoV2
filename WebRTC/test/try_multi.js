/**
 * Multiremote example
 * To run this script you need to have Mocha installed globally on your system.
 * If not try to run: $ npm install -g mocha
 *
 * To execute it just run it as a spec with a fair amount of timeout:
 * $ mocha -t 9999999 examples/webdriverio.multiremote.chat.js
 */
var io = require('socket.io-client');
var ninjaSocket;
var WebdriverIO = require('webdriverio'),
    matrix = WebdriverIO.multiremote({
       browserB: { desiredCapabilities: { browserName: 'chrome' } },
       /* browserB: { 
            desiredCapabilities: 
            { 
                browserName: 'phantomjs',
                //'phantomjs.binary.path': require('../node_modules/phantomjs').path,
                'phantomjs.cli.args': [
                '--ignore-ssl-errors=true',
                '--ssl-protocol=any', // tlsv1
                '--web-security=false',
                '--load-images=false',
          //'--debug=false',
          //'--webdriver-logfile=webdriver.log',
          //'--webdriver-loglevel=DEBUG',
                ],
                logLevel: 'silent'
            } 
        }
        */
    }),
  //  browserA = matrix.select('browserA'),
    browserB = matrix.select('browserB');
    
var should = require('should');
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');
 
    chai.use(chaiAsPromised);
    expect = chai.expect;
    chai.Should();
    chaiAsPromised.transferPromiseness = browserB.transferPromiseness;

/**
 * Multiremote example
 * To run this script you need to have Mocha installed globally on your system.
 * If not try to run: $ npm install -g mocha
 *
 * To execute it just run it as a spec with a fair amount of timeout:
 * $ mocha -t 9999999 examples/webdriverio.multiremote.chat.js
 */


describe('multiremote', function() {
    
    //this.timeout = 99999999;
    before(function() {
		
		ninjaSocket = io('https://localhost:8000',{forceNew: true});
	});
    it('should open chat application', function() {
        return browserB.init().url('https://localhost:8000/sign_in?url=%2FMentor');
        //return browserB.init().url('http://webdriver.io');
    });

    it('should fill email and password and login as mentor', function() {
        return browserB.setValue('#email', 'jj')
                        .setValue('#password', '123')
                        .click('.btn').pause(1000)
                        .getTitle().should.eventually.equal('Mentor Toolbar');  
             
    });
    
    it('ninja should request', function() {
			ninjaSocket.emit('requestHelp');
			return browserB.getHTML('#helpQueue .btn',false).should.eventually.to.exist;
	});
    
    it('mentor should answer', function() {
			return browserB.click('#helpQueue .btn').pause(1000)
                           .getHTML('#headingThree h4 a',false).should.eventually.equal('Chats');
	});
    
    it('should add video', function() {
            ninjaSocket.emit('test_addVideo');
			return browserB.getHTML('#ninjaScreen',false).should.eventually.to.exist
	});
    
    it('should take screenshot', function() {
            
            return browserB.pause(3000)
                           .click('#takescreenShot').pause(1000)
                           .getElementSize('#myCanvas','width').should.eventually.to.be.above(50);
	});
    
    it('should highlight screenshot', function() {
        var original_Canvas;

             browserB.getAttribute('#myCanvas','textContent').then(function(oc){
                 original_Canvas=oc;
             });
             browserB.pause(3000)
                     .moveToObject('#myCanvas',80,80)
                     .buttonDown().then(function(){
                         browserB.buttonPress()
                         .moveToObject('#myCanvas',180,160)
                         .buttonUp()
                      })
                      
                      .pause(1000)
    
            
                           
         return browserB.getAttribute('#myCanvas','textContent').should.eventually.not.equal(original_Canvas);
	});
    
    it('should clear drawings on screenshot', function() {
        
        var highlighted_Canvas;
        var cleared_Canvas;
        browserB.getAttribute('#myCanvas','textContent').then(function(hc){
              highlighted_Canvas= hc;
              browserB.pause(1000)
                 .click('#clearCanvas')
                 .pause(1000);
              
              browserB.getAttribute('#myCanvas','textContent').then(function(cc){
                  cc.should.equal(highlighted_Canvas);
                  //console.log(highlighted_Canvas)
              });
         });
         return browserB.pause(1000)
	});
    

    it('should end the session', function() {
        return browserB.pause(2000).end();
    });

});
