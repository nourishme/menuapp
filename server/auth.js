var passportConfig = require('./config/passport');

module.exports = function(app){
  
  //Google Auth
  app.get('/auth/google', passportConfig.passport.authenticate('google'));

    // Google will redirect the user to this URL after authentication.  Finish
    // the process by verifying the assertion.  If valid, the user will be
    // logged in.  Otherwise, authentication has failed.
  app.get('/auth/google/return',
    passportConfig.passport.authenticate('google', { successRedirect: '/#/landing',
    failureRedirect: '/login' }));

  
  //FB Auth
  // app.get('/auth/facebook', passportConfig.passport.authenticate('facebook'));
  // app.get('/auth/facebook/callback',
    // passportConfig.passport.authenticate('facebook', {
    //   failureRedirect: '/login' }),
    //   function(req, res){
    //     console.log(req);
    //   }
  // );

  
  // Auth Helper Functions
  
  // app.get('/logout', function(req, res){
  //   req.logout();
  //   res.redirect('/');
  // });

  // var ensureAuthenticated = function(req, res, next) {
  //   if (req.isAuthenticated()) {
  //     return next();
  //   }
  //   res.redirect('/');
  // };

};