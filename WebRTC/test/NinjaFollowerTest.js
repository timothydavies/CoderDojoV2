
var io = require('socket.io-client');
var ninjaSocket;
var mentorSocket;
var queue=[];

 var WebdriverIO = require('webdriverio'),
     browserB = WebdriverIO.remote({ 
         user: 'CoderDojoDev',
         key:  'd079bf09-33be-4565-aea4-f07ffd191a7d',
         host: 'ondemand.saucelabs.com',
         logLevel: 'silent',
         port:80,

         
         desiredCapabilities: {
             'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
             browserName: 'firefox',
             name: process.env.TRAVIS_JOB_NUMBER,
             'public': true
         }
     });
    

var should = require('should');
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');
 
    chai.use(chaiAsPromised);
    expect = chai.expect;
    chai.Should();
    chaiAsPromised.transferPromiseness = browserB.transferPromiseness;



describe('test ninja follower', function() {
    
    this.timeout(99999999);
    before(function(done) {
		mentorSocket = io('https://127.0.0.1:8000',{forceNew: true});
        browserB.init(done)
                .windowHandleSize({width: 300, height: 1000})
                .url('https://127.0.0.1:8000/sign_in/meeting?url=%2FNinja')
                .pause(2000)
                .call(done);
	});
    after(function() {
		mentorSocket.disconnect();
	});

    it('should fill email and password and login as ninja', function(done) {
                browserB
                        .setValue('input[name="password"]', '123').pause(500)
                        .click('.btn').pause(1000)
                        .getTitle().then(function(title){
                            title.should.equal('Ninja Toolbar')
                        })
                        .call(done);  
             
    });
     
    it('ninja should request and be answered by mentor', function(done) {
         function addQueue(data){
             mentorSocket.emit('iceRequest', {mentor:'Test Mentor'});
             queue = data.queue;
             mentorSocket.emit('answerRequest',{ninja : queue[0]});

         }
           
			browserB.click('#firstPhaseButton').pause(1000);
            mentorSocket.once('queueUpdate', addQueue);

            browserB.pause(1000)
                    .getHTML('#secondPhaseButton',false).then(function(btn){
                                                             btn.should.equal('OK');
                                                             })
                            .click('#secondPhaseButton').pause(1000)
                            .call(done);
            
              
	});
    
    it('should display follower icon', function(done) {
            
			browserB.pause(1000)
                    .click('#shareButton').then(function(){
                       mentorSocket.emit('test_addVideo'); 
                    }).pause(1000)
                    .click('#follower-option1').pause(2000)
                           .getCssProperty('#follower-dark','display').then(function(display){
                               display.value.should.equal('block');
                           })
                           .call(done);
                     
	});
    
    it('follower should move according to socket location data', function(done) {
            
                   browserB.pause(500).then(function(){
                                mentorSocket.emit('RTPointing',{ MX: 30,
                                 MY: 30,
                                 Mwidth: 400,
                                 Mheight: 300});
                                 })
                            .getLocation('#follower-dark','x').then(function(x){
                                x.should.not.equal(-1);
                            })
                            .getLocation('#follower-dark','y').then(function(y){
                                y.should.not.equal(-1);
                            })
                            .call(done);
                        
    
	});
  
    it('should end the session', function(done) {
        browserB.end()
                .call(done);
    });

});
