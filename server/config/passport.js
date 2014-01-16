exports.passport = require('passport')
exports.facebookStrategy = require('passport-facebook').Strategy;


passport.use(new facebookStrategy(
  function()))

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});