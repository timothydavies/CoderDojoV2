
var io = require('socket.io-client');
var ninjaSocket;
var mentorSocket;
var x;

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



describe('test mentor handler', function() {
    
    this.timeout = 99999999;
    before(function(done) {
		mentorSocket = io('https://localhost:8000',{forceNew: true});
		ninjaSocket = io('https://localhost:8000',{forceNew: true});
        browserB.init(done)
                .windowHandleSize({width: 1000, height: 800})
                .url('https://localhost:8000/sign_in?url=%2FMentor')
                .then(function(){
                     ninjaSocket.emit('iceRequest', {mentor:'Test Ninja'});
                 })
                 .call(done);
	});
    after(function() {
		mentorSocket.disconnect();
		ninjaSocket.disconnect();
	});


    it('should fill email and password and login as mentor', function(done) {
               browserB.setValue('#email', 'jj')
                        .setValue('#password', '123')
                        .click('.btn').pause(1000)
                        .getTitle().should.eventually.equal('Mentor Toolbar')
                        .call(done);  
             
    });
    
    it('ninja should request', function(done) {
			
			        browserB.pause(1000).then(function(){
                        ninjaSocket.emit('requestHelp'); 
                    }).pause(1000)
                    .getHTML('#helpQueue .btn',false).then(function(btn){
                        btn.should.exist;
                    })
                    .call(done);
	});
    
    it('mentor should answer', function(done) {
			       browserB.pause(200)
                           .click('#helpQueue .btn').pause(1000)
                           .getHTML('#headingThree h4 a',false).then(function(btn){
                                btn.should.equal('Chats');
                            })
                            .call(done);
	});
    
    it('should add video', function(done) {
            
			browserB.pause(200).then(function(){
                       ninjaSocket.emit('test_addVideo');
                    })
                   .getHTML('#ninjaScreen',false).then(function(btn){
                        btn.should.exist;
                    })
                    .call(done);
	});
    
    it('should enable pointing handler', function(done) {
            
           return browserB.pause(200)
                           .click('#handler-option1').pause(300)
                           .getCssProperty('#handler-bright','display').then(function(display){
                               display.value.should.equal('block');
                           })
                           .call(done);
                  
	});
   
    it('should move handler to trigger socket', function(done) {
   
         function test(data) {
				should.exist(data);
				data.should.have.property('MX');
                data.MX.should.be.above(57);
                data.should.have.property('MY');
                data.MY.should.be.above(37);
           
			};    
         browserB.moveToObject('#handler-bright')
                     .buttonDown().then(function(){
                         ninjaSocket.once('RTPointing', test);
                     })
                     .moveToObject('#screenBox',80,60)
                     .buttonUp() 
                     .call(done);   
	});
     
    it('should sign out', function(done) {
        browserB.click('#signOut')
                        .call(done);
	});
    

   
    it('should end the session', function(done) {
        browserB.pause(2000).end()
                .call(done);
    });

});
