var neo4jDB = require('../neo4jDB.js');
exports.neo4j = neo4j = require('node-neo4j');
exports.db = db = new neo4j('http://localhost:7474');

exports.updateUserInventory = update = function(userid, invChangeObj, cb) {
  var statement = createStatementFromObject(invChangeObject);
  db.beginAndCommitTransaction(statement, cb);
};

exports.getUserInventory = getinventory = function(userid) {
  // match (n) where id(n) = {userid} return n
  // match (n)->[:HAS_INVENTORY]-(b) where id(n) = 406842 return b
  msg = "match (n)-[:HAS_INVENTORY]->(i) where id(n) = "+userid+" return i";
  var cb = function(err, result) {
    console.log(err, result);
    return result;
  };
  db.cypherQuery(msg, cb);
  
};

exports.likeIngredient = like = function(userid, ingredientstring) {
  msg = "match (n:User) where n.userid = " +userid;
  msg += "match (i:Ingredient) where i._id";
  msg += "(n)-[:HAS]->(i)";
  // db.cypherQuery(msg, callback); //?????  
};

module.exports = exports;