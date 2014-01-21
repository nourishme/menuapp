var neo4jDB = require('./neo4jDB.js');
exports.neo4j = neo4j = require('node-neo4j');
ports.db = db = new neo4j('http://localhost:7474');

// Insert a Node with these three labels -> ('user', 'evil', man'): 
// db.insertNode({ name:'Darth Vader', level: 99, hobbies: ['lightsaber fighting', 'cycling in space'], shipIds: [123, 321] }, ['User', 'Evil' ,'Man'], callback);
// returns { _id: 17, name:'Darth Vader', level: 99, hobbies: ['lightsaber fighting', 'cycling in space'], shipIds: [123, 321] }        */

exports.newUser = function(userObject, cb) {
  userObject = userObject || fakedata;
  db.insertNode(userObject, ['User'], cb);
};

exports.getUserOnLogin = function(userid, cb) {
  db.readNodesWithLabelsAndProperties(['User'], {userid: userid}, cb);
};



module.exports = exports;

// Example of a 'statements' parameter:
// {
//   statements: [ { 
//     statement : 'CREATE ( bike:Bike { weight: 10 } )CREATE ( frontWheel:Wheel { spokes: 3 } )CREATE ( backWheel:Wheel { spokes: 32 } )CREATE p1 = bike -[:HAS { position: 1 } ]-> frontWheel CREATE p2 = bike -[:HAS { position: 2 } ]-> backWheel RETURN bike, p1, p2',
//     resultDataContents : [ 'row', 'graph' ]
//   } ]
// }



// var fakedata = { 
//   name: 'Test User',
//   userid: 123321, 
//   email:'thisuser@example.com'
// };
// create (n:User {  name: 'Test User',  userid: 123321,  email:'thisuser@example.com'}) return n;
// create (n:User {  name: 'Another User',  userid: 123321,  email:'thisuser@example.com'}) return n;
// create (n:User {  name: 'More User',  userid: 123321,  email:'thisuser@example.com'}) return n;
// create (n:User {  name: 'Such User',  userid: 123321,  email:'thisuser@example.com'}) return n;

