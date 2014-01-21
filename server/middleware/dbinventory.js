var neo4jDB = require('../neo4jDB.js');
exports.neo4j = neo4j = require('node-neo4j');
exports.db = db = new neo4j('http://localhost:7474');
exports.phrases = ph = require('../middleware/db.phrase.templates.js');

var cb = function(err, result) {
    if (err) throw err;
    console.log(err, result);
    return result.data;
  };

exports.updateUserInventory = update = function(request) {
  var userid = request.user;
  invChangeArray = request.data;
  var statement = ph.updateLikeStatusStatementFromObject(userid, invChangeArray);
  db.beginAndCommitTransaction(statement, cb);
};

/* invChangeArray looks like this:
[ { name: 'carrots', liked: true },
  { name: 'bacon', liked: true },
  { name: 'beets', liked: false },
  { name: 'onions', liked: false } ]

CASE n.eyes
 WHEN 'blue' THEN 1
 WHEN 'brown' THEN 2
 ELSE 3
END

*/



exports.getUserInventory = getinventory = function(userid) {
  // match (n) where id(n) = {userid} return n
  // match (n)->[:HAS_INVENTORY]-(b) where id(n) = 406842 return b
  msg = "match (n)-[:HAS_INVENTORY]->(i) where id(n) = "+userid+" return i";
  
  db.cypherQuery(msg, cb);
  
};

exports.likeIngredient = like = function(userid, ingredientstring) {
  msg = "match (n:User) where n.userid = " +userid;
  msg += "match (i:Ingredient) where i._id";
  msg += "(n)-[:HAS]->(i)";
  // db.cypherQuery(msg, callback); //?????  
};

module.exports = exports;