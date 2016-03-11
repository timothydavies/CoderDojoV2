
describe('Should log in as ninja and log out', function() {
  
  before(function() {
     browser
      .url('https://localhost:8000/sign_in?url=%2FMentor');
  });

  it('should open page', function () {   
          var title=browser.getTitle();
          title.should.equal('Sign In');
          
    });
  it('should open mentor sign in page', function () {   
      /*
        browser.click('#mentorEntry button'); 
        browser.window(browser.windowHandles()).pause(1000);   
        */
      browser.setValue('#email', 'jj')
      browser.setValue('#password', '123')
      browser.click('.btn').pause(5000);
      browser.getTitle().should.equal('Mentor Toolbar');
      browser.click("#signOut");       
    });
});

