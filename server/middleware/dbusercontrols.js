exports.neo4j = neo4j = require('node-neo4j');
exports.db = db = new neo4j('http://localhost:7474');

// Insert a Node with these three labels -> ('user', 'evil', man'): 
// db.insertNode({ name:'Darth Vader', level: 99, hobbies: ['lightsaber fighting', 'cycling in space'], shipIds: [123, 321] }, ['User', 'Evil' ,'Man'], callback);
// returns { _id: 17, name:'Darth Vader', level: 99, hobbies: ['lightsaber fighting', 'cycling in space'], shipIds: [123, 321] }        */
var fakedata = { 
  name: 'Test User', 
  fbID: 123321, 
  email:'thisuser@example.com'
};

exports.newUser = function(userObject, cb) {
  userObject = userObject || fakedata;
  db.insertNode(userObject, ['User'], cb);
};

exports.getUserOnLogin = function(userid, cb) {
  db.readNodesWithLabelsAndProperties(['User'], {userid: userid}, cb);
};

module.exports = exports;