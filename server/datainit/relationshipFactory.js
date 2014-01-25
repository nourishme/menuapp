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
// var ing = [{"smallImageUrls":["http://yummly-recipeimages-compressed.s3.amazonaws.com/Salted-dark-chocolate-popcorn-314529-275548.s.jpg"],"ingredients":["fine sea salt","oil","dark chocolate","popcorn"],"flavors":{"salty":0.16666666666666666,"sweet":0.8333333333333334,"meaty":0.3333333333333333,"bitter":1.0},"imageUrlsBySize":{"90":"http://lh4.ggpht.com/EFNxIJJbi2IYEqjEUrkmOfW9rc7pg4jTE67orK4mt769LAu-AU2T-WBAz3FdmmJkzvbu8acePGvRcRsvGNV_Gw=s90-c"},"attributes":{},"totalTimeInSeconds":4800.0,"rating":5,"recipeName":"Salted Dark Chocolate Popcorn","sourceDisplayName":"The Kitchn","id":"Salted-dark-chocolate-popcorn-314529"},{"smallImageUrls":["http://yummly-recipeimages-compressed.s3.amazonaws.com/Salted-Caramel-Frosting-Recipe-Chow-48346-39352.s.png"],"ingredients":["heavy cream","powdered sugar","unsalted butter","water","granulated sugar","vanilla extract","fine salt"],"flavors":{"sour":0.16666666666666666,"salty":0.5,"sweet":1.0,"meaty":0.5,"bitter":0.16666666666666666},"imageUrlsBySize":{"90":"http://lh3.ggpht.com/pW4wFmhaX8E3z-QWRMMvi-A8SL-bkds5POb9MZvUsGv4NifPZnUfnzJPLmaNba73BE0f9SAQd5uiFq4kzHZn=s90-c"},"attributes":{"course":["Desserts"]},"totalTimeInSeconds":2700.0,"rating":4,"recipeName":"Salted Caramel Frosting Recipe","sourceDisplayName":"Chow","id":"Salted-Caramel-Frosting-Recipe-Chow-48346"},{"smallImageUrls":["http://yummly-recipeimages-compressed.s3.amazonaws.com/Olive-oil_-lemon-_-sea-salt-sundaes-308165-272173.s.jpg"],"ingredients":["sea salt","vanilla ice cream","lemon","extra-virgin olive oil"],"flavors":{"sour":0.16666666666666666,"salty":0.5,"sweet":0.8333333333333334,"meaty":0.3333333333333333,"bitter":0.16666666666666666},"imageUrlsBySize":{"90":"http://lh6.ggpht.com/OpGHN_Vy51QSeaE9MTJVxV_UU5wW-eA1yJ_WtndvO97qsghHahAv0dMkZ48F8s-r58Qw9WpGZI3j8R6OAAgfIA=s90-c"},"attributes":{},"totalTimeInSeconds":1500.0,"rating":5,"recipeName":"Olive Oil, Lemon & Sea Salt Sundaes","sourceDisplayName":"The Kitchn","id":"Olive-oil_-lemon-_-sea-salt-sundaes-308165"},{"smallImageUrls":["http://yummly-recipeimages-compressed.s3.amazonaws.com/Salted-brown-butter-crispy-treats-305678-270273.s.jpg"],"ingredients":["cereal","marshmallows","sea salt","unsalted butter"],"flavors":{"salty":0.5,"sweet":0.5,"meaty":0.16666666666666666,"bitter":0.16666666666666666},"imageUrlsBySize":{"90":"http://lh4.ggpht.com/62nWcBtmqiAqBp-IndN8mM4Jcxjp2MUJ1gXy3RE6aJ10XnPnKpnrbzFf2_UTpM_gYCJ-Tb3yhN5py0UAG7Fn=s90-c"},"attributes":{},"totalTimeInSeconds":2100.0,"rating":5,"recipeName":"Salted Brown Butter Crispy Treats","sourceDisplayName":"Smitten Kitchen","id":"Salted-brown-butter-crispy-treats-305678"}];


/* 

MATCH (r:Recipe) MATCH (i:Ingredient) where i.ingredientName = 'fine sea salt' AND r.id = 'Salted-dark-chocolate-popcorn-314529'
 CREATE (r)-[ll:HAS_INGREDIENT]->(i)
 return ll

MATCH (r:Recipe) where r.id = 'Salted-dark-chocolate-popcorn-314529' return r

"ingredients":["fine sea salt","oil","dark chocolate","popcorn"],
*/




var allRecipes = [ recipes1, recipes2, recipes3, recipes4, recipes5, recipes6, recipes7, recipes8, recipes9, recipes10, recipes11];

var allRecipesInArray = function() {
  var recipesArray = [];
  for (var i = 0 ; i < allRecipes.length; i ++){
    recipesArray = recipesArray.concat(allRecipes[i]);
  }
  return recipesArray;
};


var db = new neo4j('http://localhost:7474');



var recsofar = 1,
  batches = 0,
  batchsize = 1;



// MATCH (r:Recipe) MATCH (i:Ingredient) where i.ingredientName = 'fine sea salt' AND r.id = 'Salted-dark-chocolate-popcorn-314529'
//  CREATE (r)-[ll:HAS_INGREDIENT]->(i)
//  return ll


var template = function(startNode, endNode){
  return {
      statement : 'MATCH (r:Recipe) MATCH (i:Ingredient) where i.ingredientName = "'+endNode+'" AND r.id = "'+startNode+'" CREATE (r)-[:HAS_INGREDIENT]->(i) return r.id'
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
    for (var j = 1; j < ing[i].ingredients.length; j++) {
      msg.statements.push(template(ing[i].id, ing[i].ingredients[j]));
    }
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


var recipesCreate =function(startNode, endNode){

db.beginTransaction({
  statements:[{
    statement : 'MATCH (r:Recipe) MATCH (i:Ingredient) where i.ingredientName = "'+endNode+'" AND r.id = "'+startNode+'" CREATE (r)-[:HAS_INGREDIENT]->(i)'
      
    }]
  },nextbatch );
}



var ing = allRecipesInArray()
// var ing = [{"smallImageUrls":["http://yummly-recipeimages-compressed.s3.amazonaws.com/Salted-dark-chocolate-popcorn-314529-275548.s.jpg"],"ingredients":["fine sea salt","oil","dark chocolate","popcorn"],"flavors":{"salty":0.16666666666666666,"sweet":0.8333333333333334,"meaty":0.3333333333333333,"bitter":1.0},"imageUrlsBySize":{"90":"http://lh4.ggpht.com/EFNxIJJbi2IYEqjEUrkmOfW9rc7pg4jTE67orK4mt769LAu-AU2T-WBAz3FdmmJkzvbu8acePGvRcRsvGNV_Gw=s90-c"},"attributes":{},"totalTimeInSeconds":4800.0,"rating":5,"recipeName":"Salted Dark Chocolate Popcorn","sourceDisplayName":"The Kitchn","id":"Salted-dark-chocolate-popcorn-314529"},{"smallImageUrls":["http://yummly-recipeimages-compressed.s3.amazonaws.com/Salted-Caramel-Frosting-Recipe-Chow-48346-39352.s.png"],"ingredients":["heavy cream","powdered sugar","unsalted butter","water","granulated sugar","vanilla extract","fine salt"],"flavors":{"sour":0.16666666666666666,"salty":0.5,"sweet":1.0,"meaty":0.5,"bitter":0.16666666666666666},"imageUrlsBySize":{"90":"http://lh3.ggpht.com/pW4wFmhaX8E3z-QWRMMvi-A8SL-bkds5POb9MZvUsGv4NifPZnUfnzJPLmaNba73BE0f9SAQd5uiFq4kzHZn=s90-c"},"attributes":{"course":["Desserts"]},"totalTimeInSeconds":2700.0,"rating":4,"recipeName":"Salted Caramel Frosting Recipe","sourceDisplayName":"Chow","id":"Salted-Caramel-Frosting-Recipe-Chow-48346"},{"smallImageUrls":["http://yummly-recipeimages-compressed.s3.amazonaws.com/Olive-oil_-lemon-_-sea-salt-sundaes-308165-272173.s.jpg"],"ingredients":["sea salt","vanilla ice cream","lemon","extra-virgin olive oil"],"flavors":{"sour":0.16666666666666666,"salty":0.5,"sweet":0.8333333333333334,"meaty":0.3333333333333333,"bitter":0.16666666666666666},"imageUrlsBySize":{"90":"http://lh6.ggpht.com/OpGHN_Vy51QSeaE9MTJVxV_UU5wW-eA1yJ_WtndvO97qsghHahAv0dMkZ48F8s-r58Qw9WpGZI3j8R6OAAgfIA=s90-c"},"attributes":{},"totalTimeInSeconds":1500.0,"rating":5,"recipeName":"Olive Oil, Lemon & Sea Salt Sundaes","sourceDisplayName":"The Kitchn","id":"Olive-oil_-lemon-_-sea-salt-sundaes-308165"},{"smallImageUrls":["http://yummly-recipeimages-compressed.s3.amazonaws.com/Salted-brown-butter-crispy-treats-305678-270273.s.jpg"],"ingredients":["cereal","marshmallows","sea salt","unsalted butter"],"flavors":{"salty":0.5,"sweet":0.5,"meaty":0.16666666666666666,"bitter":0.16666666666666666},"imageUrlsBySize":{"90":"http://lh4.ggpht.com/62nWcBtmqiAqBp-IndN8mM4Jcxjp2MUJ1gXy3RE6aJ10XnPnKpnrbzFf2_UTpM_gYCJ-Tb3yhN5py0UAG7Fn=s90-c"},"attributes":{},"totalTimeInSeconds":2100.0,"rating":5,"recipeName":"Salted Brown Butter Crispy Treats","sourceDisplayName":"Smitten Kitchen","id":"Salted-brown-butter-crispy-treats-305678"}];

recipesCreate(ing[0], ing[0].ingredients[0] );

