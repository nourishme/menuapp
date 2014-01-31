exports.neo4j = require('node-neo4j');


var db = new neo4j('http://localhost:7474');
var recipes;

//for all nodes
// var checkForNode = function(nodeLabel, nodeProperty, nodeName, callback, arrayToFill){
//   console.log('checkForNode')
//   db.cypherQuery("MATCH (n: "+nodeLabel+") WHERE n."+nodeProperty+" ='"+nodeName+"' Return n", function(err, result){
//     console.log('**result**: ', result)
//     console.log('**result.data**: ', result.data)
//     if(err) {
//       console.log('Could not check on Node');
//     } else {
//       if(!result[0]){
//         callback(nodeName, arrayToFill);
//       }
//     }
//   });
// };

//Recipe Creation

var createRecipePropertyStatement = function(recipe){
  var propertyObj = {};
  for (var key in recipe){
    if(!propertyObj[key] && key!== "ingredients" && key!== "flavors" && key!== "attributes" && key!== "imageUrlsBySize" &&
      recipe[key]!== null) {
      propertyObj[key] = recipe[key];
    }
  }
  // console.log('*****PROP OBJ: ', propertyObj)
  return propertyObj;

};

var recipeRecSoFar = 1,
  recipeBatches = 0,
  recipeBatchSize = 20;

var recipeTemplate = function(val){
  return {
    statement : 'MERGE (r:Recipe {id: {props}.id}) ON CREATE SET r.id = {props}.id, r.rating = {props}.rating, r.totalTimeInSeconds = {props}.totalTimeInSeconds, r.recipeName = {props}.recipeName, r.sourceDisplayName = {props}.sourceDisplayName return r.id',
    parameters : {
      props : {
      id: val.id,
      rating: val.rating,
      totalTimeInSeconds: val.totalTimeInSeconds || 0,
      recipeName: val.recipeName,
      sourceDisplayName: val.sourceDisplayName
      }
    }
  };
};

var errthrow = function() {
};

var recipeNextbatch = function(err,result) {
  if(result.results[0]){
  }
  var done = false;
  recipeRecSoFar = recipeBatches*recipeBatchSize < recipes.length ? recipeBatches*recipeBatchSize : recipes.length;
  msg = {statements: []};

  if ( recipeRecSoFar === recipes.length ) done = true;
  var reclimit = recipeRecSoFar+recipeBatchSize > recipes.length ? recipes.length : recipeRecSoFar+recipeBatchSize;
  for (var i = recipeRecSoFar; i < reclimit; i++) {
    msg.statements.push(recipeTemplate(createRecipePropertyStatement(recipes[i])));

  }
  if (done !== false) {
    // console.log('recipetriggerdone');
    
    db.commitTransaction(result._id, msg, errthrow );
  } else {
    // console.log('****MSGSTMNT****: ', msg.statements);
    // console.log('about to insert batch: ', recipeBatches);
    recipeBatches++;
    db.addStatementsToTransaction(result._id, msg, recipeNextbatch);
  }
};

exports.saveRecipeToDB = function(recipeArray){
  recipes = recipeArray;
  exports.writeRecipes(recipes);
  saveIngredientsToDB(recipes);
};

exports.writeRecipes = function(recs){
  var recipeProps = createRecipePropertyStatement(recs[0])
  db.beginTransaction({
    statements:[{
      statements : 'MERGE (r:Recipe {id: {props}.id}) ON CREATE SET r.id = {props}.id, r.rating = {props}.rating, r.totalTimeInSeconds = {props}.totalTimeInSeconds, r.recipeName = {props}.recipeName, r.sourceDisplayName = {props}.sourceDisplayName return r',
      parameters : {
        props : {
        id: recipeProps.id,
        rating: recipeProps.rating,
        totalTimeInSeconds: recipeProps.totalTimeInSeconds || 0,
        recipeName: recipeProps.recipeName,
        sourceDisplayName: recipeProps.sourceDisplayName
        }
      }
    }]
  },recipeNextbatch );
};

//ingredients
var ingRecSoFar = 1,
  ingBatches = 0,
  ingBatchSize = 1;

var ingredientTemplate = function(val){
  return {
    statement : 'MERGE (i:Ingredient (ingredientName: {props}.ingredientName) RETURN i ON CREATE SET i.ingredientName = {props}.ingredientName',
    parameters : {
      props : {
        ingredientName: val
      }
    }
  };
};

var ingNextBatch = function(err,result) {
  var done = false;
  ingRecSoFar = ingBatches*ingBatchSize < ingredients.length ? ingBatches*ingBatchSize : ingredients.length;
  msg = {statements: []};

  if ( ingRecSoFar === ingredients.length ) done = true;
  var reclimit = ingRecSoFar+ingBatchSize > ingredients.length ? ingredients.length : ingRecSoFar+ingBatchSize;
  for (var i = ingRecSoFar; i < reclimit; i++) {
    msg.statements.push(ingredientTemplate(ingredients[i]));

  }
  if (done !== false) {
    // console.log('ingtriggerdone');
    
    db.commitTransaction(result._id, msg, errthrow );
  } else {
    // console.log('****MSGSTMNT****: ', msg.statements);
    // console.log('about to insert batch: ', ingBatches);
    ingBatches++;
    db.addStatementsToTransaction(result._id, msg, ingNextBatch);
  }
};


var addToIngredientArray = function(ingredient, ingredientArray){
  ingredientArray.push(ingredient);
};

var saveIngredientsToDB = function(recipes){
  var ingredients;
  var ingredientArray = [];
  for (var i = 0 ; i < recipes.length; i ++){
    ingredients = recipes[i];
    ingredientArray.concat(ingredients);
  }
  writeIngredients(ingredientArray);
  setTimeout(saveRelationshipsToDB(recipes), 40000);
};

var writeIngredients = function(ingredients){
  db.beginTransaction({
    statements:[{
      statement : 'MERGE (i:Ingredient (ingredientName: {props}.ingredientName) RETURN i ON CREATE SET i.ingredientName = {props}.ingredientName',
      parameters : {
        props : {
        ingredientName: ingredients[0]
        }
      }
    }]
  },ingNextBatch );
};


//relationships

var relRecSoFar = 1,
  relBatches = 0,
  relBatchSize = 20;

var relTemplate = function(startNode, endNode){
  return {
    statement : 'MATCH (r:Recipe) MATCH (i:Ingredient) where i.ingredientName = "'+endNode+'" AND r.id = "'+startNode+'" MERGE (r)-[:HAS_INGREDIENT]->(i) return r.id'
  };
};

var relNextBatch = function(err,result) {
  var done = false;
  relRecSoFar = relBatches*relBatchSize < recipes.length ? relBatches*relBatchSize : recipes.length;
  msg = {statements: []};

  if ( relRecSoFar === recipes.length ) done = true;
  var reclimit = relRecSoFar+relBatchSize > recipes.length ? recipes.length : relRecSoFar+relBatchSize;
  for (var i = relRecSoFar; i < reclimit; i++) {
    for (var j = 1; j < recipes[i].ingredients.length; j++) {
      msg.statements.push(relTemplate(recipes[i].id, recipes[i].ingredients[j]));
    }
  }
  if (done !== false) {
    // console.log('relationshiptriggerdone');

    db.commitTransaction(result._id, msg, errthrow );
  } else {
    // console.log('about to insert batch: ', relBatches);
    relBatches++;
    // console.log("******: ", msg)

    db.addStatementsToTransaction(result._id, msg, relNextBatch);
  }
};

var saveRelationshipsToDB = function(recipes){
  writeRelationships(recipes[0], recipes[0].ingredients[0]);
};


var writeRelationships = function(startNode, endNode){

  db.beginTransaction({
    statements:[{
      statement : 'MATCH (r:Recipe) MATCH (i:Ingredient) where i.ingredientName = "'+endNode+'" AND r.id = "'+startNode+'" MERGE (r)-[:HAS_INGREDIENT]->(i)'
    }]
  },relNextBatch );
};




