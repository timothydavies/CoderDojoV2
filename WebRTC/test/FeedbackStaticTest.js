
var io = require('socket.io-client');

var ninjaSocket;

  
 var WebdriverIO = require('webdriverio'),
     browserB = WebdriverIO.remote({ 
         
         host: 'ondemand.saucelabs.com',
         logLevel: 'silent',
         port:80,
         user: 'CoderDojoDev',
         key:  'd079bf09-33be-4565-aea4-f07ffd191a7d',
         
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
    assert = require('assert');
    chai.use(chaiAsPromised);
    expect = chai.expect;
    chai.Should();
//    chaiAsPromised.transferPromiseness = browserB.transferPromiseness;



describe('test mentor static feedback', function() {
    this.timeout(99999999);
    before(function(done) {
		ninjaSocket = io('https://127.0.0.1:8000',{forceNew: true});
        browserB
                .init(done)
                .windowHandleSize({width: 1200, height: 800})
                .url('https://127.0.0.1:8000/sign_in?url=%2FMentor')
                .then(function(){
                     ninjaSocket.emit('iceRequest', {mentor:'Test Ninja'});
                 }).call(done);
	});
    after(function() {
		ninjaSocket.disconnect();
	});


    it('should fill email and password and login as mentor', function(done) {
               browserB.getTitle().then(function(v){
                   console.log(v);
               })
                        .setValue('input[name="email"]', 'jj')
                        .setValue('input[name="password"]', '123')
                 
                        .click('button').pause(1000)
                        .getTitle().should.eventually.equal('Mentor Toolbar')
                        .call(done);  
             
    });
    
    
    it('ninja should request', function(done) {
			
			browserB.getTitle().then(function(){
                        
                        ninjaSocket.emit('requestHelp');
                    }).pause(1000)
                    .getHTML('#helpQueue .btn',false).then(function(ele){
                        ele.should.exist;
                    })
                    .call(done);
	});
    
    it('mentor should answer', function(done) {
			       browserB.click('#helpQueue .btn').pause(1000)
                           .getHTML('#headingThree h4 a',false).then(function(ele){
                               ele.should.equal('Chats');
                           })
                           .call(done);
	});
    
    it('should add video', function(done) {
            
	browserB.getTitle().then(function(){
                ninjaSocket.emit('test_addVideo');
            })
            .getHTML('#ninjaScreen',false).then(function(ele){
                        ele.should.exist;
                    })
            .call(done);
	});
    
    it('should take screenshot', function(done) {
            
            browserB.click('#takescreenShot')
                            .isVisible('#myCanvas').then(function(isVisible) {
                              isVisible.should.equal(true);
                            }) 
                            .call(done);
                         
	});
    
    
    
    
    it('should cancel current screenshot and take a new one', function(done) {

                browserB.click('#closeCanvas').pause(1000)
                        .isVisible('#myCanvas').then(function(isVisible) {
                            isVisible.should.equal(false);
                        }) 
                        .click('#takescreenShot').pause(1000)
                        .isVisible('#myCanvas').then(function(isVisible) {
                            isVisible.should.equal(true);
                        })
                        .call(done);  
	});
    
    it('should highlight screenshot', function(done) {
        ninjaSocket.emit('test_highlight');
         browserB.getAttribute('#myCanvas', 'textContent').then(function(txtContent) {
                            txtContent.should.equal('changed'); 
                        })
                        .pause(1000)
                        .call(done);
    });
    it('should send out image', function(done) {

        function test(data){
            data.should.have.property('image');
            data.should.have.property('name');
            //console.log(data);
        }
        browserB.click('#sendscreenShot').pause(2000)
                       .isExisting('img.fancybox').then(function(isExisting) {
                          isExisting.should.equal(true); 
                         });
                         //.pause(2000);  
                         
        ninjaSocket.once('screenshot',test);
        browserB.call(done);
	});
    
    it('should sign out', function(done) {
        
         browserB.click('#signOut')
                        .pause(1000)
                        .call(done);
	});

    it('should end the session', function(done) {
         browserB.end()
                       .call(done);
    });

});
