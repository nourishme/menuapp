var neo4jDB = require('../neo4jDB.js');
exports.neo4j = neo4j = require('node-neo4j');
// exports.db = db = new neo4j('http://localhost:7474');

//todo: this file can probably be dumped.


module.exports = exports;

// Example of a 'statements' parameter:
// {
//   statements: [ {
//     statement : 'CREATE ( bike:Bike { weight: 10 } )CREATE ( frontWheel:Wheel { spokes: 3 } )CREATE ( backWheel:Wheel { spokes: 32 } )CREATE p1 = bike -[:HAS { position: 1 } ]-> frontWheel CREATE p2 = bike -[:HAS { position: 2 } ]-> backWheel RETURN bike, p1, p2',
//     resultDataContents : [ 'row', 'graph' ]
//   } ]
// }



