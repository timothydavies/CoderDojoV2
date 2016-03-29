
var io = require('socket.io-client');
var ninjaSocket;
var mentorSocket;
var queue=[];


   var WebdriverIO = require('webdriverio'),
     browserB = WebdriverIO.remote({ 
         desiredCapabilities: {
             browserName: 'firefox'
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
    
    //this.timeout = 99999999;
    before(function(done) {
		mentorSocket = io('https://localhost:8000',{forceNew: true});
		ninjaSocket = io('https://localhost:8000',{forceNew: true});
        browserB.init(done)
                .windowHandleSize({width: 200, height: 800})
                .url('https://localhost:8000/sign_in/meeting?url=%2FNinja')
                .pause(2000)
                .call(done);
	});
    after(function() {
		mentorSocket.disconnect();
		ninjaSocket.disconnect();
	});

    it('should fill email and password and login as mentor', function(done) {
                browserB.setValue('label input', '123')
                        .click('.btn').pause(1000)
                        .getTitle().then(function(title){
                            title.should.equal('Ninja')
                        })
                        .call(done);  
             
    });
     
    it('ninja should request and be answered ny mentor', function(done) {
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
            
			browserB.click('#shareButton').then(function(){
               mentorSocket.emit('test_addVideo'); 
            }).pause(2000);
            
            
                   browserB.click('#follower-option1').pause(1000)
                           .getCssProperty('#follower-bright','display').then(function(display){
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
                            .getLocation('#follower-bright','x').should.eventually.be.above(50)
                            .getLocation('#follower-bright','y').should.eventually.be.above(340)
                            .call(done);
                        
    
	});
  
    it('should end the session', function(done) {
        browserB.end()
                .call(done);
    });

});
