
var io = require('socket.io-client');

var WebdriverIO = require('webdriverio'),
    matrix = WebdriverIO.multiremote({
        browserA: { desiredCapabilities: { browserName: 'chrome' } },
        browserB: { desiredCapabilities: { browserName: 'firefox' } }
    }),
    browserA = matrix.select('browserA'),
    browserB = matrix.select('browserB');
    
var should = require('should');

describe('test mentor broadcasting', function(){
    this.timeout(99999999);
    before(function(){
        browserA.init() 
                .url('https://localhost:8000/sign_in?url=%2FMentor')  
       return browserB.init()
                .url('https://localhost:8000/sign_in/meeting?url=%2FNinja')  

    });
    
    it('should login as mentor',function(){
       return browserA.setValue('input[name="email"]', 'jack')
                        .setValue('input[name="password"]', '123')
                        .click('.btn').pause(1000)
                        .getTitle().should.eventually.equal('Mentor Toolbar');
 
    });
    
    it('should login as ninja',function(){
       return browserB.setValue('input[name="password"]', '123')
                        .click('.btn').pause(1000)
                        .getTitle().should.eventually.equal('Ninja Toolbar');
    });
    
    it('mentor should jump to broadcast page',function(){
        return browserA.click('a=Presentations').pause(1000)
                        .click('#toBroadcast').pause(1000)
                        .getTabIds().then(function (handles) {
                        return this.switchTab(handles[handles.length - 1]);
                        })
                        .getTitle().should.eventually.equal('Broadcasting Page');
    });
    
    it('mentor should start a broadcast',function(){
        return browserA.setValue('#conference-name','mentor')
                        .click('.btn').pause(1500)
                        .getTagName("//div[@id='participants']/video").then(function(tagName) {
                        tagName.should.eventually.equal('video'); 
                        });
    });
    
    /*it('should sign out', function() {
        return browserA.click('#signOut');
	});*/
    
    
});

describe('test ninja eplayer',function(){
    this.timeout(99999999);
    /* before(function() {
        return browserB.init()
            .url('https://localhost:8000/sign_in/meeting?url=%2FNinja')
    });*/

    /*it('should login as ninja', function() {
        return browserB.setValue('input[name="password"]', '123')
            .click('.btn').pause(1000)
            .getTitle().should.eventually.equal('Ninja Toolbar')
    });*/

    it('mentor should jump to eplayer page', function() {
        return browserB.click('a=Presentations').pause(1000)
            .click('#toEplayer').pause(1000)
            .getTabIds().then(function(handles) {
                return this.switchTab(handles[handles.length - 1]);
            })
            .getTitle().should.eventually.equal('Eplayer Page');
    });   
        
});

describe('test mentor video upload',function(){
    this.timeout(99999999);
    it('mentor should back to mentor toolbar',function(){
       return browserA.getTabIds().then(function(handles) {
                return this.switchTab(handles[handles.length - 2]);
            })
            .getTitle().should.eventually.equal('Mentor Toolbar'); 
    });
    
    it('mentor should jump to video upload page',function(){
        return browserA.click('a=Presentations').pause(1000)
                        .click('#toVideoUpload').pause(1000)
                        .getTabIds().then(function (handles) {
                        return this.switchTab(handles[handles.length - 1]);
                        })
                        .getTitle().should.eventually.equal('YouTube API Uploads via CORS');
    });
    
    it('mentor should ')
});
