
describe('Should log in as ninja and log out', function() {
  
  before(function() {
     browserA
      .url('https://localhost:8000/sign_in?url=%2FMentor');
  });

  it('should open page', function () {   
          var title=browserA.getTitle();
          title.should.equal('Sign In');
          
    });
  it('should open mentor sign in page', function () {   
      /*
        browserA.click('#mentorEntry button'); 
        browserA.window(browserA.windowHandles()).pause(1000);   
        */
      browserA.setValue('#email', 'jj')
      browserA.setValue('#password', '123')
      browserA.click('.btn').pause(5000);
      browserA.getTitle().should.equal('Mentor Toolbar');
      browserA.click("#signOut");       
    });
});


describe('Should log in as ninja and log out', function() {
  
  before(function() {
     browserA
      .url('https://localhost:8000/sign_in?url=%2FMentor');
  });

  it('should open page', function () {   
          var title=browserA.getTitle();
          title.should.equal('Sign In');
          
    });
  it('should open mentor sign in page', function () {   
      /*
        browserA.click('#mentorEntry button'); 
        browserA.window(browserA.windowHandles()).pause(1000);   
        */
      browserA.setValue('#email', 'jj')
      browserA.setValue('#password', '123')
      browserA.click('.btn').pause(5000);
      browserA.getTitle().should.equal('Mentor Toolbar');
      browserA.click("#signOut");       
    });
});





