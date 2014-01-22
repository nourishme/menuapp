var neo4jDB = require('../neo4jDB.js');
exports.neo4j = neo4j = require('node-neo4j');
exports.db = db = new neo4j('http://localhost:7474');
exports.phrases = ph = require('../middleware/db.phrase.templates.js');

var callbackWrapper = function (res){
  inventoryCallback = function(err, result) {
    if (err) throw err;
    console.log('inventoryCallback: -->',err, result);
    // console.log(res);
    // return result;
    res.send( result);
  };
  return inventoryCallback;
};

exports.updateUserInventory = update = function(req,res) {
  var userid = req.user;
  invChangeArray = req.body;
  var statement = ph.updateLikeStatusStatementFromObject(userid, invChangeArray);
  res.send( 
    db.beginAndCommitTransaction(
      statement, callbackWrapper(res)
    )
  );
};

exports.getUserInventory = getinventory = function(req,res) {
  // match (n)-[:LIKES]->(b) where id(n) = 406842 return b
  msg = "match (n)-[:LIKES]->(i) where id(n) = "+req.user+" return i";
  db.cypherQuery(msg, callbackWrapper(res));
};

module.exports = exports;