
exports.updateUserInventory = update = function(userid, invChangeObj, cb) {
  var statement = createStatementFromObject(invChangeObject);
  db.beginAndCommitTransaction(statement, cb);
};

exports.getUserInventory = getinventory = function(userid) {
  msg = "match (n:User {props})-[:HAS]-(inventory) return inventory";
  // db.cypherQuery(msg, callback); //?????  
  
};

exports.likeIngredient = like = function(userid, ingredientstring) {
  msg = "match (n:User) where n.userid = " +userid;
  msg += "match (i:Ingredient) where i._id";
  msg += "(n)-[:HAS]->(i)";
  // db.cypherQuery(msg, callback); //?????  
};

module.exports = exports;