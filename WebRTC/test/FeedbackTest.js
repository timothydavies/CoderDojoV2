
var io = require('socket.io-client');

var ninjaSocket;

  
 var WebdriverIO = require('webdriverio'),
     browserB = WebdriverIO.remote({ 
         
         host: 'ondemand.saucelabs.com',
         logLevel: 'silent',
         port:80,

         
         desiredCapabilities: {
            'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
             browserName: 'chrome',
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



describe('test mentor feedback', function() {
    this.timeout(99999999);
      before(function(done) {
		mentorSocket = io('https://127.0.0.1:8000',{forceNew: true});
		ninjaSocket = io('https://127.0.0.1:8000',{forceNew: true});
        browserB
                .init(done)
                .windowHandleSize({width: 1300, height: 1000})
                .url('https://127.0.0.1:8000/sign_in?url=%2FMentor')
                .then(function(){
                     ninjaSocket.emit('iceRequest', {mentor:'Test Ninja'});
                 }).call(done);
	});
    after(function() {
		mentorSocket.disconnect();
		ninjaSocket.disconnect();
	});

    describe('static', function() {
    it('should fill email and password and login as mentor', function(done) {
               browserB .setValue('input[name="email"]', 'jj')
                        .setValue('input[name="password"]', '123')
                        .pause(1000)
                        .click('.btn').pause(1000)
                        .getTitle().then(function(title){
                            title.should.equal('Mentor Toolbar');
                        })
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
            ninjaSocket.emit('test_addVideo');
         
            browserB.pause(1000)
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
         browserB.pause(2000).getAttribute('#myCanvas', 'textContent').then(function(txtContent) {
                            txtContent.should.not.equal(' '); 
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

});



describe('test mentor handler', function() {
   
    
    it('should enable pointing handler', function(done) {
           ninjaSocket.emit('test_addVideo'); 
           browserB.pause(1000)
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
                data.MX.should.not.equal(0);
                data.should.have.property('MY');
                data.MY.should.not.equal(0);
           
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
        browserB.end()
                .call(done);
    });

});
});


