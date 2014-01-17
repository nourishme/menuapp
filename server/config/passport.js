var config = require ('./configfile');
exports.passport = require('passport');
exports.facebookStrategy = require('passport-facebook').Strategy;



exports.passport.serializeUser(function(user, done) {
  done(null, user.id);
});

exports.passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

exports.passport.use(new exports.facebookStrategy({
 clientID: config.ids.facebook.clientID,
 clientSecret: config.ids.facebook.clientSecret,
 callbackURL: config.ids.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {
 process.nextTick(function () {
   return done(null, profile);
 });
}
));

