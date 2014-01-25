/* 
Pointwise mutual information (pmi) 

p(a,b) = (# recipes containing a & b ) / (# recipes)
p(a) = (# recipes containing a) / (# recipes)
p(b) = (# recipes containing b) / (# recipes)


write a function to calculate the pmi for 2 ingredients and store that value on the ingredient
write a function that loops through all the ingredients that co-occur with an ingredient and runs "calculate pmi"
set a flag on each ingredient that shows whether it's been updated since the last time it's pmi's have been calculated
When recipes are added to the database, set the processed flag to false
create a function that "processes" a single recipe. This should add relationships between all the ingredients in the recipe
create a function that runs "process recipe" on the top n recipes where processed is false
create a cron job that runs process recipes at some regular interval
*/

module.exports = {
  calculateP: function(ingredient) {
    
  },

  calcPmiForIngredients: function(ingredient1, ingredient2) {
    // body...
  },

  markForUpdate: function(recipe) {
    // body...
  },

  relateIngredints: function(ingredient1, ingredient2) {
    // body...
  }, 

  processRecipe: function(recipe) {
    // body...
  },

  getRecipeForProcessing: function(recipes) {
    // body...
  },

  processGraphPmi: function(recipes) {
    // body...
  }
};