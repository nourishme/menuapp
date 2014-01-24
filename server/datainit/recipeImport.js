exports.neo4j = require('node-neo4j');
var recipes1 = require('./1.js').recipes;
var recipes2 = require('./2.js').recipes;
var recipes3 = require('./3.js').recipes;
var recipes4 = require('./4.js').recipes;
var recipes5 = require('./5.js').recipes;
var recipes6 = require('./6.js').recipes;
var recipes7 = require('./7.js').recipes;
var recipes8 = require('./8.js').recipes;
var recipes9 = require('./9.js').recipes;
var recipes10 = require('./10.js').recipes;
var recipes11 = require('./11.js').recipes;

exports.neo4j = neo4j = require('node-neo4j');

var allRecipes = [recipes1, recipes2, recipes3, recipes4, recipes5, recipes6, recipes7, recipes8, recipes9, recipes10, recipes11];

var allRecipesInArray = function() {
  var recipesArray = [];
  for (var i = 0 ; i < allRecipes.length; i ++){
    for (var j = 0 ; j < allRecipes[i].length; j ++){
      if(recipesArray.indexOf(allRecipes[i][j]) === -1){
        recipesArray.push(allRecipes[i][j]);
      }
    }
  }
  console.log(recipesArray)
  return recipesArray;
};


var db = new neo4j('http://localhost:7474');



var recsofar = 1,
  batches = 0,
  batchsize = 1;

var template = function(val){
  return {
      statement : 'CREATE (r:Recipe {props}) RETURN n; ',
      parameters : {
        props : val
      }
    };
};

var errthrow = function() {
  console.log(arguments[1].errors);
};

var nextbatch = function(err,result) {
  var done = false;
  recsofar = batches*batchsize < ing.length ? batches*batchsize : ing.length;
  msg = {statements: []};

  if ( recsofar === ing.length ) done = true;
  var reclimit = recsofar+batchsize > ing.length ? ing.length : recsofar+batchsize;
  for (var i = recsofar; i < reclimit; i++) {
    msg.statements.push(createPropertyObject(ing[i]));

  }
  if (done !== false) {
    console.log('triggerdone');
    console.log("*****: ", result._id, msg, errthrow )

    db.commitTransaction(result._id, msg, errthrow );
  } else {
    console.log('about to insert batch: ', batches);
    batches++;
    console.log("******: ", msg)

    db.addStatementsToTransaction(result._id, msg, nextbatch);
  }
};

var createPropertyObject = function(recipe){
  var propertyObj = {};
  for (var key in recipe){
    if(!propertyObj[key] && key!== "ingredients" && key!== "flavors" && key!== "attributes" && key!== "imageUrlsBySize" &&
      key!== "smallImageUrls" && recipe[key]!== null) {
      propertyObj[key] = recipe[key];
    }
  }
  console.log('*****PROP OBJ: ', propertyObj)
  return propertyObj;

};

var recipesCreate =function(ing){
db.beginTransaction({
  statements:[{
    statement : 'CREATE (r:Recipe {props}) RETURN r ',
      parameters : {
        props : createPropertyObject(ing[0])
      }
    }]
  },nextbatch );
}



var ing = allRecipesInArray()

recipesCreate(ing);

