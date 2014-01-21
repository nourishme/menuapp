var config = require ('./configfile');
exports.passport = require('passport');
exports.facebookStrategy = require('passport-facebook').Strategy;
exports.googleStrategy = require('passport-google').Strategy;

var database = require('../neo4jDB');

exports.passport.serializeUser(function(account, done) {
  done(null, account);
});

exports.passport.deserializeUser(function(account, done) {
  //findOrCreate(account, function(err, account){
  //   if(!err) {
  //     done(null, account.facebook.id);
  //   } else {
  //     done(err, null);
  //   }
  // });
  done(null, account);
});


exports.passport.use(new exports.googleStrategy({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000/'
  },
  function(identifier, profile, done) {
    findOrCreate(profile, function(err, user) {
      // console.log("!****user: ", user);
      // console.log("profile!****: ", profile);
      done(null, profile);
    });
  }));


/* data from google looks like this:
{ displayName: 'Kamla Kasichainula',
  emails: [ { value: 'kasikamla@gmail.com' } ],
  name: { familyName: 'Kasichainula', givenName: 'Kamla' } }
*/


var findOrCreate = function(profile, callback){

  var getQuery = "MATCH (u: User) WHERE u.googEmail = '" + profile.emails[0].value + "' RETURN u";
  var createQuery = "CREATE (u: User "+
      " { googFName: '" + profile.name.givenName +
      "' , googLName: '" + profile.name.familyName +
      "' , googEmail: '" + profile.emails[0].value +
      "' }) return u";

  db.cypherQuery(getQuery, function(err, result){
    console.log('**!!! ERR: ', err);
    console.log('**!!! RESULT: ', result);
    if(!result.data[0]){
        console.log('CREATING*!!!!: ', createQuery);
      db.cypherQuery(createQuery, function(err, result){
        return callback(err, result.data[0]);
      });
    } else {
      return callback(err, result.data[0]);
    }
  });


};