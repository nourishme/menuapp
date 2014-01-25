var neo4jDB = require('../neo4jDB.js');
exports.neo4j = neo4j = require('node-neo4j');
exports.db = db = new neo4j('http://localhost:7474');
exports.phrases = ph = require('../middleware/db.phrase.templates.js');
var yum = require('../middleware/callyummly.js');



var callbackWrapper = function (req, res, altCallback){
  resultSendCallback = function(err, result) {
    if (err) throw err;
    res.send( result);
  };
  var callback = altCallback || resultSendCallback;
  return callback;
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
  var topIngreds = [];
  var count = req.param('count') || 10;
  msg = "match (i:Ingredient) return i LIMIT "+count;
  db.cypherQuery(msg, callbackWrapper(req, res));
};

exports.findCoOccuringIngredients = findCoOccuringIngredients = function(req, res) {
  var ingredientsByCoOccurWeight = [];
  return ingredientsByCoOccurWeight;
};

exports.getRecipeByIdString = getRecipeByIdString = function(req, res) {
  msg = ph.matchNodeByPropertyValueAndLabel('id', req.body, 'Recipe');
  db.cypherQuery(msg, callbackWrapper(req, res));
};

exports.getRecipesByIngredientSearch = getRecipesByIngredientSearch = function(req, res) {
// curl -X POST -H "Content-Type: application/json" -d '[402112,402113,402114]' http://localhost:3000/searchForRecipes/  
  var transactionBody = {};
  transactionBody.statements = [];
  for (var i = 0; i< req.body.length; i++  ){
    var query = {};
    query = ph.matchNodeById(req.body[i]);
    transactionBody.statements.push( {statement: query.msg+' RETURN n'});
  }
  backwardsSearchRecipeResponseCallback = function(result, err) {
    if (err) throw err;
    res.send( result);
  };
  var searchYummlyWithIngredientNames = function(err, dbResultObj, req, res) {
    var result = dbResultObj.results;
    var paramsForYumSearch = '&q=';
    for (var i = 0; i < result.length; i++) {
        paramsForYumSearch += result[i].data[0].row[0].term+ ' ';
    }
    yum.searchRecipe(paramsForYumSearch, callbackWrapper( req, res, backwardsSearchRecipeResponseCallback ));
  };
  db.beginAndCommitTransaction(transactionBody, callbackWrapper(req, res, searchYummlyWithIngredientNames));
};

exports.saveSearchQueryAsNode = saveSearchQueryAsNode = function(req, res){
  console.log("***** REQ *****: ", req);
  console.log("***** RES *****: ", res);
  msg = 'create (s:Search {params:'+req.body+'}) return s.params ';
  if(!checkSearchQueryNode(req.body)){
    db.cypherQuery(msg, function(err, result){
      if(err){
        console.log('**ERROR**: ', err);
      } else {
        createSearchIngredientRelationship(result);
      }
    });
  }
};

exports.checkSearchQueryNode = findSearchQueryNode = function(query){
  msg = 'match (s:Search) where s.params ='+ query +' return s';
  return db.cypherQuery(msg, function(err, result){
    if(result[0]){
      return true;
    } else {
      return false;
    }
  });

};

exports.createSearchIngredientRelationship = createSearchIngredientRelationship = function(query){
  var ingredient;
  for (var i = 0 ; i < query.length ; i++){
    ingredient = query[i];
    msg = 'match (i: Ingredient) where i.ingredientName="'+ingredient+'" '+
    'match (s: Search) where s.params='+query+' '+
    'create (i)-[r:ISPARAM]->(s) return r; ';
    db.cypherQuery(msg, function(err, result){
      if(err){
        console.log('**ERROR**: ', err);
      }
    });
  }
};

exports.createUserSearchRelationship = createUserSearchRelationship = function(req, res){
  msg = 'match (u: User) where id(u)='+req.user+' '+
    'match (s: Search) where s.params='+req.body+' '+
    'create (u)-[r:ISPARAM]->(s) return r; ';
  db.cypherQuery(msg, function(err, result){
    if(err){
      console.log('***ERROR**: ', err);
    }
  });

};





module.exports = exports;

