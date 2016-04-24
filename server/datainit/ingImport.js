exports.neo4j = require('node-neo4j');
// var recipes1 = require('./1.js').recipes;
// var recipes2 = require('./2.js').recipes;
// var recipes3 = require('./3.js').recipes;
// var recipes4 = require('./4.js').recipes;
// var recipes5 = require('./5.js').recipes;
// var recipes6 = require('./6.js').recipes;
// var recipes7 = require('./7.js').recipes;
// var recipes8 = require('./8.js').recipes;
// var recipes9 = require('./9.js').recipes;
// var recipes10 = require('./10.js').recipes;
// var recipes11 = require('./11.js').recipes;

exports.neo4j = neo4j = require('node-neo4j');

// var allRecipes = [recipes1, recipes2, recipes3, recipes4, recipes5, recipes6, recipes7, recipes8, recipes9, recipes10, recipes11]

// var allRecipesInArray = function() {
//   recipesArray = []
//   for (var i = 0 ; i  allRecipes.length; i ++){
//     recipesArray.concat(allRecipes[i])
//   }
//   return recipesArray
// };


var db = new neo4j('http://localhost:7474');

var createIngredientArray = function(){
  var ingredients = [];
  for (var i = 0 ; i < allRecipes.length ; i++ ){
    for (var j = 0 ; j < allRecipes[i].length; j++){
      for (var k = 0 ; k < allRecipes[i][j].ingredients.length; k ++){
        if(ingredients.indexOf(allRecipes[i][j].ingredients[k]) === -1){
          ingredients.push(allRecipes[i][j].ingredients[k]);
        } else {
          continue;
        }

      }
    }
  }
    return ingredients;
};



// var createFlavorArrays = function(){
// var flavors = {flavorNames:[],flavorProps:[]};
//     for (var i = 0 ; i < allRecipes.length ; i++ ){
//       for (var j = 0 ; j < allRecipes[i].length; j++){
//         for (var flavor in allRecipes[i][j].flavors){
//           if(flavors.flavorNames.indexOf(flavor) === -1){
//             flavors.flavorNames.push(flavor);
//           } else {
//             continue
//           }
//         flavors.flavorProps.push({
//           'recipeId': allRecipes[i][j].id,
//           'flavorName': flavor,
//           'amt': allRecipes[i][j].flavors[flavor]
//         });
//       }
//     }
//   }

//   return flavors;
// };


var recsofar = 1,
  batches = 0,
  batchsize = 1;


var template = function(val){
  return {
      statement : 'CREATE (n:Ingredient {props}) RETURN n',
      parameters : {
        props : {'ingredientName': val}
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
    msg.statements.push(template(ing[i]));

  }
  if (done !== false) {
    console.log('triggerdone');

    db.commitTransaction(result._id, msg, errthrow );
  } else {
    console.log('about to insert batch: ', batches);
    batches++;

    db.addStatementsToTransaction(result._id, msg, nextbatch);
  }
};


var ingredientsCreate =function(ing){
db.beginTransaction({
  statements:[{
    statement : 'CREATE (n:Ingredient {props}) RETURN n; ',
      parameters : {
        props : {'ingredientName':ing[0] }
      }
    }]
  },nextbatch );
}



var ing = createIngredientArray();


ingredientsCreate(ing)
