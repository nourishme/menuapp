var neo4jDB = require('../neo4jDB.js');
exports.neo4j = neo4j = require('node-neo4j');
exports.db = db = new neo4j('http://localhost:7474');
exports.phrases = ph = require('../middleware/db.phrase.templates.js');
exports.saveToDB = require('../middleware/saveRecipesToDB')
var yum = require('../middleware/callyummly.js');


var callbackWrapper = function (req, res, altCallback){
  resultSendCallback = function(err, result) {
    if (err) console.log(err);
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
  var count = req.param('count') || 100;
  msg = "MATCH (:Ingredient)-[r:PMI]->(:Ingredient) WITH startNode(r).ingredientName AS name ORDER BY r.weight DESC RETURN DISTINCT name LIMIT "+count;
  db.cypherQuery(msg, callbackWrapper(req, res));
};

exports.getRecipeByIdString = getRecipeByIdString = function(req, res) {
  msg = ph.matchNodeByPropertyValueAndLabel('id', req.param('id'), 'Recipe');
  db.cypherQuery(msg.msg, callbackWrapper(req, res));
};

/***
Recipes by Ingredients Object
***/

exports.makeRecObjByIngredient = makeRecObjByIngredient = function(recipes){
  var recipeObjByIngredient = {};
  for (var i = 0; i < recipes.length; i++){
    ingredients = getIngredientListFromRecipe(recipes[i]);
    for (var j = 0; j < ingredients.length; j++){
      if (!recipeObjByIngredient[ingredients[j]]){
        recipeObjByIngredient[ingredients[j]] = [];
      }
      recipeObjByIngredient[ingredients[j]].push(recipes[i]);
    }
  }
  return recipeObjByIngredient;
};

exports.getIngredientListFromRecipe = getIngredientListFromRecipe = function(recipe){
    return recipe.ingredients;
};

/***
Recipes by Ingredients Needed Object
***/

exports.makeRecByIngNeededObj = makeRecByIngNeededObj = function(recipes, query){
  var recipesByIngNeeded = {};
  var ingNumber;
  for (var i = 0 ; i < recipes.length; i++){
    ingNumber = countIngredients(recipes[i]);
    if(!recipesByIngNeeded[ingNumber-query.length]){
      recipesByIngNeeded[ingNumber-query.length] = [];
    }
    recipesByIngNeeded[ingNumber-query.length] = recipes[i];
  }
  return recipesByIngNeeded;
};

exports.countIngredients = countIngredients = function(recipe){
  return recipe['ingredients'].length;
};


exports.getRecipesByIngredientsNeeded = getRecipesByIngredientsNeeded = function(req, res) {
  var transactionBody = {};
  transactionBody.statements = [];
  for (var i = 0; i< req.body.length; i++  ){
    var query = {};
    query = ph.matchNodeById(req.body[i]);
    // console.log("query is ",query.msg);
    transactionBody.statements.push( {statement: query.msg+' RETURN n'});
  }

  searchResultBigCallback = function(result, err){
    if (err) throw err;
    var recipes = (JSON.parse(result)).matches;
    exports.saveToDB.saveRecipeToDB(recipes);
    var byIngredient = makeRecObjByIngredient(recipes);
    var byNumIngNeeded = makeRecByIngNeededObj(recipes, req.body);
    var recipesByIngredient = {
      'byIngredient': byIngredient,
      'byNumIngNeeded': byNumIngNeeded
    };

    res.send(recipesByIngredient);
  };

  var searchYummlyWithIngredientNames = function(err, dbResultObj, req, res) {
    var result = dbResultObj.results;
    var paramsForYumSearch = '&q=';
    for (var i = 0; i < result.length; i++) {
      paramsForYumSearch += result[i].data[0].row[0].ingredientName+ ' ';
    }
    //todo: change back to 900
    paramsForYumSearch900=paramsForYumSearch +'&maxResult=900';
    yum.searchRecipe(paramsForYumSearch900, callbackWrapper( req, res, searchResultBigCallback ));
  };

  db.beginAndCommitTransaction(transactionBody, callbackWrapper(req, res, searchYummlyWithIngredientNames));
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
    res.send(result);
  };

  var searchYummlyWithIngredientNames = function(err, dbResultObj, req, res) {
    var result = dbResultObj.results;
    var paramsForYumSearch = '&q=';
    for (var i = 0; i < result.length; i++) {
      paramsForYumSearch += result[i].data[0].row[0].ingredientName+ ' ';
    }
    paramsForYumSearch=paramsForYumSearch +'&maxResult=10';
    yum.searchRecipe(paramsForYumSearch, callbackWrapper( req, res, backwardsSearchRecipeResponseCallback ));
  };

  db.beginAndCommitTransaction(transactionBody, callbackWrapper(req, res, searchYummlyWithIngredientNames));
};

exports.checkSearchQueryNode = checkSearchQueryNode = function(req, res){
  var query = '';
  var msg;
  query = req.body[0] ;
  if(req.body.length > 1){
    for (var i = 1; i< req.body.length; i++  ){
      query+=', '+req.body[i];
    }
  }
  msg = 'match (s:Search) where s.params ="'+ query +'" return s';
  db.cypherQuery(msg, function(err, result){
    if(result['data'].length > 0){
      createUserSearchRelationship(req, query);
    } else {
      saveSearchQueryAsNode(req, query);
    }
  });

};

exports.saveSearchQueryAsNode = saveSearchQueryAsNode = function(req, query){
  msg = 'create (s:Search {params:"'+query+'"}) return s.params';
  db.cypherQuery(msg, function(err, result){
    if(err){
      console.log('*SAVESEARCHERR*: ', err);
    } else {
      createSearchIngredientRelationship(req, query);
      createUserSearchRelationship(req, query);
    }
  });
};

exports.createRelationshipQuery = createRelationshipQuery = function(ingredient, query){
  var msg = 'match (i: Ingredient) where id(i)='+ingredient+' '+
  'match (s: Search) where s.params="'+query+'" '+
  'create (i)-[r:IS_PARAM]->(s) return r';

  return msg;
};


exports.createSearchIngredientRelationship = createSearchIngredientRelationship = function(req, query){
  for (var i = 0 ; i < req.body.length ; i++){
    var msg = createRelationshipQuery(req.body[i], query);
    db.cypherQuery(msg, function(err, result){
      if(err){
        console.log('***CREATESEARCHERR***', err);
      }
    });
  }
};

exports.createUserSearchRelationship = createUserSearchRelationship = function(req, query){
  msg = 'match (u: User) where id(u)='+req.user+' '+
    'match (s: Search) where s.params="'+query+'" '+
    'create (u)-[r:SEARCHED]->(s) return u; ';
  db.cypherQuery(msg, function(err, result){
    if(err){
      console.log('***CREATEUSERSEARCHERROR**: ', err);
    }
  });

};





module.exports = exports;

