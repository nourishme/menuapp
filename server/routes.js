
// External Modules
var express        = require("express"),
    url            = require('url'),

// Internal Modules
    ingredients    = require('./ingredients'),
    searchResults  = require('./searchResults'),
    yummly         = require('./middleware/callyummly.js'),
    passportConfig = require('./config/passport');

/**
 * Routes
 */

exports.setRoutes = function(app, application_root){

  // Static
  app.use('/', express.static( application_root + '/../app'));

  // Yummly API Routes
  app.use('/search', yummly.yumSearch );
  app.use('/get', yummly.yumGet );
  app.use('/ing', yummly.yumIng );

  // Ingredients
  // app.get('/getTopIngredients/',ingredients.getTopIngredients); //Redundant. I believe the one below is correct
  app.get('/getTopIngredients/:count',ingredients.getTopIngredients);

  app.post('/suggestedIngredients/',ingredients.getIngredientList);
  app.get('/ingredientInventory/',ingredients.getUsersRecipeList);
  app.post('/ingredientInventory/',ingredients.saveUsersList);
  app.get('/getCoOccurs/',ingredients.getCoOccurs);

  // Search Results
  app.get('/searchResults/:ingredientNames',searchResults.get);
  app.post('/searchForRecipes/',ingredients.searchForRecipes);
  app.post('/searchforRecipesNumber/',ingredients.searchForRecipesNumber);

  // Recipes
  app.get('/getRecipe/:id',ingredients.getRecipe);
  // app.get('/getRecipe/:recipeNumber',ingredients.getRecipe); //todo: let's make sure this doesn't belong before we delete it. currently it's duplicated above(jfl) 

};

module.exports = exports;
