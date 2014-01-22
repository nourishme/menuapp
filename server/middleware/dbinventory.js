var neo4jDB = require('../neo4jDB.js');
exports.neo4j = neo4j = require('node-neo4j');
exports.db = db = new neo4j('http://localhost:7474');
exports.phrases = ph = require('../middleware/db.phrase.templates.js');

var inventoryCallback = function(err, result) {
    if (err) throw err;
    console.log(err, result);
    return result;
  };

exports.updateUserInventory = update = function(req,res) {
  var userid = req.user;
  console.log('userid in dbinventory.js ',userid);
  invChangeArray = req.body;
  console.log('invChangeArray in dbinventory.js ',invChangeArray);
  var statement = ph.updateLikeStatusStatementFromObject(userid, invChangeArray);
  console.log(statement);
  res.send( db.beginAndCommitTransaction(statement, inventoryCallback));
};

/* invChangeArray looks like this:
[ { name: 'carrots', liked: true },
  { name: 'bacon', liked: true },
  { name: 'beets', liked: false },
  { name: 'onions', liked: false } ]

match (i:Ingredient {term:'eggs'})
 match (n) where id(n)=406846 match (i) where id(i)=406839 create (n)-[:HAS_INVENTORY]->(i) return id(i)

match (n)-[:HAS_INVENTORY]->(i) where id(n)=406842 return i
*/

exports.getUserInventory = getinventory = function(req,res) {
  // match (n)-[:LIKES]->(b) where id(n) = 406842 return b
  msg = "match (n)-[:LIKES]->(i) where id(n) = "+req.user+" return i";
  
  res.send(db.cypherQuery(msg, inventoryCallback));
  
};

module.exports = exports;