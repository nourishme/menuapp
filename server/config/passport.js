var config = require ('./configfile');
exports.passport = require('passport');
exports.facebookStrategy = require('passport-facebook').Strategy;
var database = require('../neo4jDB');



exports.passport.serializeUser(function(account, done) {
  done(null, account.facebook.id);
});


exports.passport.deserializeUser(function(account, done) {
  findOrCreate(account, function(err, account){
    if(!err) {
      done(null, account.facebook.id);
    } else {
      done(err, null);
    }
  });
  done(null, account.facebook.id);
});

// exports.passport.deserializeUser(function(account, done) {
//   findOrCreate(account, function(err, account){
//     if(!err) {
//       done(null, account.facebook.id);
//     } else {
//       done(err, null);
//     }
//   });
//   done(null, account.facebook.id);
// });

exports.passport.use(new exports.facebookStrategy({
 clientID: config.ids.facebook.clientID,
 clientSecret: config.ids.facebook.clientSecret,
 callbackURL: config.ids.facebook.callbackURL
},
  function(accessToken, refreshToken, profile, done) {
    findOrCreate({facebook: profile}, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  })
);

var findOrCreate = function(account, callback){
  debugger
  console.log('account: ', account)

  var getQuery = "MATCH (u: User) WHERE u.fbUserID = " + account.facebook.id + " RETURN u";
  var createQuery = "CREATE (u: User "+
      " { fbUserID: " + account.facebook.id +
      " , fbFName: " + account.facebook.name.givenName +
      " , fbLName: " + account.facebook.name.familyName +
      " , fbEmail: " + account.facebook.emails[0].value +
      " }) return u";

  db.cypherQuery(getQuery, function(err, result){
    if(result.data.length > 0){
      console.log('get err: ', err)
      return callback(err, result.data[0]);
    } else {
      db.cypherQuery(createQuery, function(err, result){
              console.log('create err: ', err)
        return callback(err, result.data[0]);
      });
    }

  });


};




