var neo4jDB = require('../neo4jDB.js');
exports.neo4j = neo4j = require('node-neo4j');
exports.db = db = new neo4j('http://localhost:7474');
exports.phrases = ph = require('../middleware/db.phrase.templates.js');
var routes = require('../config/routes.js');



var callbackWrapper = function (req, res, ifNoResultCallback){
  inventoryCallback = function(err, result) {
    if (err) throw err;
    res.send( result);
  };
  return inventoryCallback;
};

exports.updateUserInventory = update = function(req, res) {
  var userid = req.user;
  invChangeArray = req.body;
  var statement = ph.updateLikeStatusStatementFromObject(userid, invChangeArray);
  res.send( 
    db.beginAndCommitTransaction(
      statement, callbackWrapper(req, res)
    )
  );
};

exports.getUserInventory = getinventory = function(req, res) {
  // match (n)-[:HAS_INVENTORY]->(i) where id(n)=406842 return i
  msg = "match (n)-[:HAS_INVENTORY]->(i) where id(n) = "+req.user+" return i";
  db.cypherQuery(msg, callbackWrapper(req, res));
};

exports.getIngredientList = getIngredientList = function(req, res) {
  msg = "match (i:Ingredient) RETURN i LIMIT 10";
  db.cypherQuery(msg, callbackWrapper(req, res));
};

exports.getTopIngredientsList = getTopIngredientsList = function(req, res) {
  // body...
  var topIngreds = [];
  var count = req.param('count') || 10;
  msg = "match (i:Ingredient) return i LIMIT "+count;
  db.cypherQuery(msg, callbackWrapper(req, res));
};

exports.findCoOccuringIngredients = findCoOccuringIngredients = function(req, res) {
  // body...
  var ingredientsByCoOccurWeight = [];
  return ingredientsByCoOccurWeight;
};

exports.getRecipeByIdString = getRecipeByIdString = function(req, res) {
  msg = ph.matchNodeByPropertyValueAndLabel('id', req.body, 'Recipe');
  db.cypherQuery(msg, callbackWrapper(req, res));
};

exports.getRecipesByIngredientSearch = getRecipesByIngredientSearch = function(req, res) {
  // should take the ingredient ids and get the names of those ingredients from the db. then turn those into a recipe search with yummly. 
// curl -X POST -H "Content-Type: application/json" -d '[1,2,3]' http://localhost:3000/searchForRecipes/  console.log(req.body);
  var transactionBody = {};
  transactionBody.statements = [];
  for (var i = 0; i< req.body.length; i++  ){
    var msg = {};
    msg.statement = ph.matchNodeById(req.body[i], 'a'+i);
    transactionBody.statements.push( msg );
  }
  
  db.beginAndCommitTransaction(transactionBody, callbackWrapper(req, res));
  // msg = "match (r:Recipe) where id(r)="+req.param('recipeNumber')+" Return r.term" ;
  // console.log(req.body);
  // do routes.yumSearch with a string of ingredients words.
};

module.exports = exports;
