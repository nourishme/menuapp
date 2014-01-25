var neo4jDB = require('../neo4jDB.js');
exports.neo4j = neo4j = require('node-neo4j');
exports.db = db = new neo4j('http://localhost:7474');
exports.phrases = ph = require('../middleware/db.phrase.templates.js');

/* 
Pointwise mutual information (pmi) 

PMI(a,b) = log( p(a,b) / p(a)*p(b) )

p(a,b) = (# recipes containing a & b ) / (# recipes)
p(a) = (# recipes containing a) / (# recipes)
p(b) = (# recipes containing b) / (# recipes)


write a function that loops through all the ingredients that co-occur with an ingredient and runs "calculate pmi"
write a function to calculate the pmi for 2 ingredients and store that value on the ingredient
set a flag on each ingredient that shows whether it's been updated since the last time it's pmi's have been calculated
When recipes are added to the database, set the processed flag to false
create a function that "processes" a single recipe. This should add relationships between all the ingredients in the recipe
create a function that runs "process recipe" on the top n recipes where processed is false
create a cron job that runs process recipes at some regular interval


Here's a query to return the count of recipies with a, with b, with a&b:
    
    MATCH (ia:Ingredient)<-[hasa:HAS_INGREDIENT]-(reca:Recipe)
      WHERE id(ia)=430878
      WITH count(DISTINCT reca) AS recwitha

    MATCH (ib:Ingredient)<-[hasb:HAS_INGREDIENT]-(recb:Recipe)
      WHERE id(ib)=430905
      WITH count(DISTINCT recb) AS recwithb, recwitha

    MATCH (ia:Ingredient)<-[:HAS_INGREDIENT]-(recab:Recipe)-[:HAS_INGREDIENT]->(ib:Ingredient)
      WHERE id(ia)=430878 AND id(ib)=430905 
      RETURN count(DISTINCT recab) as recwithab, recwithb, recwitha

*/


var calculateP = function(ingredient) { 
  
};

var calcPmiForIngredients = function(ingredient1, ingredient2) {
  



  db.beginTransaction({
    statements: [{
      statement: 'MATCH (r:Recipes) RETURN count(DISTINCT r)'      
    }]
  }, nextingredient);

};

var markForUpdate = function(recipe) {
  // body...
};

var relateIngredints = function(ingredient1, ingredient2) {
  
  // CREATE (i1)-[:HAS_INGREDIENT]->(i2) 

}; 

var processRecipe = function(recipe) {
  // body...
};

var getRecipeForProcessing = function(recipes) {
  // body...
};

var processGraphPmi = function(recipes) {
  // body...
};



