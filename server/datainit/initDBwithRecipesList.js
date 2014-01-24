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

var db = new neo4j('http://localhost:7474');



var createPropertyObject = function(recipe){
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

var createRecipeNode = function(recipe){
  var properties = createPropertyObject(recipe);
  if(!checkForNode('Recipe', recipe.id, 'id')){
    db.cypherQuery("CREATE (r:Recipe "+properties+");", function(err, result){
      // console.log('createdRecipe');
    });
    return;
  } else {
    // console.log("recipe already exists");
  }
};

var createIngredientQuery = function(ingredient){
  var properties = {"ingredientName":ingredient,"description":ingredient,"term":ingredient};
  return "CREATE (i:Ingredient "+properties+") ";
};

var createFlavorQuery = function(flavor){
  return "CREATE (f:Flavor {flavorName:"+flavor+"})";
};

var createMatchQuery = function(nodeLabel, nodeProperty, nodeName) {
  return "MATCH(n: "+nodeLabel+") WHERE n."+nodeProperty+" ='"+nodeName+"' ";
};

var createRelationshipQuery = function(nodeLabel, amtObj){
  if(nodeLabel === "Ingredient"){
    return "CREATE (r)-[:HAS_INGREDIENT]->(n) ";
  } else {
    return "CREATE (r)-[:HAS_FLAVOR "+amtObj+"]->(n)";
  }
};

var checkForNode = function(nodeLabel, nodeName, nodeProperty){
  db.cypherQuery("MATCH (n: "+nodeLabel+") WHERE n."+nodeProperty+" ='"+nodeName+"' Return n", function(err, result){
    if(!result.data[0]){
      return false;
    } else {
      return true;
    }
  });
};

var createAllRelationshipsQuery = function(recipe, nodeNames, nodeLabel){
  var relationshipsQuery="";
  var nodeProperty = nodeNames + 'Name';
  var matchRecipe;
  var matchIngOrFlav;
  var relationship;
  if(!nodeNames.length){
    for (var node in recipe.nodeNames){
      matchRecipe=createMatchQuery('Recipe', 'id', recipe.id);
      matchIngOrFlav = createMatchQuery(nodeLabel, nodeProperty, node);
      relationship = createRelationshipQuery(nodeLabel, recipe.nodeNames.node);
    }
  } else  {
    for(var i = 0; i < nodeNames.length; i++){
      matchRecipe=createMatchQuery('Recipe', 'id', recipe.id);
      matchIngOrFlav = createMatchQuery(nodeLabel, nodeProperty, i);
      relationship = createRelationshipQuery(nodeLabel);
    }
  }
      
  relationshipsQuery += matchRecipe+" "+matchIngOrFlav+" "+relationship+";";
  return relationshipsQuery;

};

var createAllIngredientsQuery = function(recipe){
  var addIngredientsQuery = "";
  for (var i =0 ; i < recipe.ingredients.length; i ++){
    if(!checkForNode('Ingredient', recipe.ingredients[i], i)){
      addIngredientsQuery+=createIngredientQuery(recipe.ingredients[i])+";";
    }

  }
  return addIngredientsQuery;
};

var createAllFlavorsQuery = function(recipe){
  var addFlavorsQuery = "";
  for (var flavor in recipe.flavors){
    if(!checkForNode('Flavor', recipe.flavors[flavor], flavor)){
      addFlavorsQuery+=createFlavorQuery(recipe.flavors[flavor])+";";
    }
  }
  return addFlavorsQuery;
};

var dbQueriesForRecipeNodes = function(recipe){
  var flavors = createAllFlavorsQuery(recipe);
  var ingredients = createAllIngredientsQuery(recipe);
  if(ingredients === ""){
    return;
  } else {
    db.cypherQuery(ingredients, function(err, results){
      // console.log('insertedIngredients');
    });
  }

  if(flavors === ""){
    return;
  } else {
    db.cypherQuery(flavors, function(err, results){
      // console.log('insertedFlavors');
    });
  }
};

var dbQueriesForRecipeRelationships = function(recipe){
  var flavorRelationships = "";
  var ingredientRelationships = "";
  if(!recipe.flavors){
    flavorRelationships="";
  } else {
    flavorRelationships+=createAllRelationshipsQuery(recipe, recipe.flavors, 'Flavor');
  }
  ingredientRelationships+=createAllRelationshipsQuery(recipe, recipe.ingredients, 'Ingredient');
  db.cypherQuery(flavorRelationships, function(err, res){
    // console.log('added flavor relationships');
  });
  db.cypherQuery(ingredientRelationships, function(err, res){
    // console.log('added ingredient relationships');
  });
};

var allDBQueries = function(recipes){
  for (var i = 0; i < recipes.length; i++){
    createRecipeNode(recipes[i]);
    dbQueriesForRecipeNodes(recipes[i]);
    dbQueriesForRecipeRelationships(recipes[i]);
  }
};

var recsofar = 1,
  batches = 0,
  batchsize = 1;

var template = function(val){
  return {
      statement : 'CREATE (r:Recipe {props}) RETURN r ',
      parameters : {
        props : val
      }
    };
};

var errthrow = function() {
  // console.log("ARGUMENTS[1].errors: ", arguments[1].errors);
};

var nextbatch = function(err,result) {
  console.log(result._id, recsofar);
  var done = false;
  recsofar = batches*batchsize < recipes.length ? batches*batchsize : recipes.length;
  msg = {statements: []};

  if ( recsofar === recipes.length ) done = true;
  var reclimit = recsofar+batchsize > recipes.length ? recipes.length : recsofar+batchsize;
  for (var i = recsofar; i < reclimit; i++) {
    msg.statements.push(template(createPropertyObject(recipes[i])));

  }
  if (done !== false) {
    // console.log('triggerdone');
    
    db.commitTransaction(result._id, msg, errthrow );
  } else {
    // console.log('****MSGSTMNT****: ', msg.statements);
    // console.log('about to insert batch: ', batches);
    batches++;
    db.addStatementsToTransaction(result._id, msg, nextbatch);
  }
};

// console.log(recipes.length);


// db.beginTransaction({
// statements:[{
//   statement1 : 'CREATE (r:Recipe {props}) RETURN r ',
//     parameters : {
//       props : createPropertyObject(recipes[0])
//     }
//   }]
// }, nextbatch );




//allDBQueries(recipes);


// CREATE (r:Recipe {
//   smallImageURLs: "http://yummly-recipeimages-compressed.s3.amazonaws.com/Salted-dark-chocolate-popcorn-314529-275548.s.jpg",
//   totalTimeInSeconds: 4800.0,
//   rating: 5,
//   recipeName: "Salted Dark Chocolate Popcorn",
//   sourceDisplayName:"The Kitchn",
//   id:"Salted-dark-chocolate-popcorn-314529"
// }),
// (i:Ingredient {ingredientName:"fine sea salt"}),
// (r)-[:HAS_INGREDIENT]->(i),
// (j:Ingredient {ingredientName:"oil"}),
// (r)-[:HAS_INGREDIENT]->(j),
// (k:Ingredient {ingredientName:"dark chocolate"}),
// (r)-[:HAS_INGREDIENT]->(k),
// (l:Ingredient {ingredientName:"popcorn"}),
// (r)-[:HAS_INGREDIENT]->(l),
// (m:Flavor {flavorName:"salty"}),
// (r)-[:HAS_FLAVOR {amt:0.16666666666666666}]->(m),
// (n:Flavor {flavorName:"sweet"}),
// (r)-[:HAS_FLAVOR {amt:0.8333333333333334}]->(n),
// (o:Flavor {flavorName:"meaty"}),
// (r)-[:HAS_FLAVOR {amt:0.3333333333333333}]->(o),
// (p:Flavor {flavorName:"bitter"}),
// (r)-[:HAS_FLAVOR {amt:1.0}]->(p);

// {"smallImageUrls":["http://yummly-recipeimages-compressed.s3.amazonaws.com/Salted-dark-chocolate-popcorn-314529-275548.s.jpg"],
//   "ingredients":["fine sea salt",
//   "oil",
//   "dark chocolate",
//   "popcorn"],
//   "flavors":{"salty":0.16666666666666666,
//   "sweet":0.8333333333333334,
//   "meaty":0.3333333333333333,
//   "bitter":1.0},
//   "imageUrlsBySize":{"90":"http://lh4.ggpht.com/EFNxIJJbi2IYEqjEUrkmOfW9rc7pg4jTE67orK4mt769LAu-AU2T-WBAz3FdmmJkzvbu8acePGvRcRsvGNV_Gw=s90-c"},
//   "attributes":{"cuisine":[American], "course":[Dessert], "holiday":[Christmas]},
//   "totalTimeInSeconds":4800.0,
//   "rating":5,
//   "recipeName":"Salted Dark Chocolate Popcorn",
//   "sourceDisplayName":"The Kitchn",
//   "id":"Salted-dark-chocolate-popcorn-314529"
// }
//