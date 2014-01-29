var config = require ('./configfile');
exports.passport = require('passport');
exports.facebookStrategy = require('passport-facebook').Strategy;
exports.googleStrategy = require('passport-google').Strategy;

var database = require('../neo4jDB');

exports.passport.serializeUser(function(account, done) {
   done(null, account);
});

exports.passport.deserializeUser(function(id, done) {
  findById(id, function(err, id) {
    if(!err) {
      done(null, id);
    } else {
      done(err, null);
    }
  });
});


exports.passport.use(new exports.googleStrategy({
    returnURL: 'http://localhost:3000/auth/google/return', //TODO: make this not hardcoded
    realm: 'http://localhost:3000/'
  },
  function(identifier, profile, done) {
    findOrCreate(profile, function(err, user) {
      if(err){
        done(err, null);
      }
      done(null, user);
    });
  }));


/* data from google looks like this:
{ displayName: 'Kamla Kasichainula',
  emails: [ { value: 'kasikamla@gmail.com' } ],
  name: { familyName: 'Kasichainula', givenName: 'Kamla' } }
*/


var findOrCreate = function(profile, callback){
  
  var getQuery = "MATCH (u: User) WHERE u.googEmail = '" + profile.emails[0].value + "' RETURN id(u)";
  var createQuery = "CREATE (u: User "+
      " { googFName: '" + profile.name.givenName +
      "' , googLName: '" + profile.name.familyName +
      "' , googEmail: '" + profile.emails[0].value +
      "' }) return id(u)";

  db.cypherQuery(getQuery, function(err, result){
    if(!result.data[0]){
      db.cypherQuery(createQuery, function(err, result){
        return callback(err, result.data[0]);
      });
    } else {
      return callback(err, result.data[0]);
    }
  });


};

var findById = function(id, callback){
  var getQuery = "MATCH (u: User) WHERE id(u) = " + id + "RETURN id(u)";
  db.cypherQuery(getQuery, function(err, result){
    return callback(err, result.data[0]);
  });
};








