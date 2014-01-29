
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

  // Ingredients
  app.get('/topIngredients/:count',ingredients.getTopIngredients);
  app.post('/suggestedIngredients/',ingredients.getCoOccurs);
  // app.post('/suggestedIngredients/',ingredients.getIngredientList);
  // app.post('/getCoOccurs/',ingredients.getCoOccurs);

  // Search for Recipes
  app.post('/searchForRecipes/',ingredients.searchForRecipes);
  app.post('/searchforRecipesNumber/',ingredients.searchForRecipesNumber);
  // app.get('/searchResults/:ingredientNames',searchResults.get);

  // Yummly API Routes
  app.use('/search', yummly.yumSearch );
  app.use('/get', yummly.yumGet );
  app.use('/ing', yummly.yumIng );


  //Deprecated

  // app.get('/ingredientInventory/',ingredients.getUsersRecipeList);
  // app.post('/ingredientInventory/',ingredients.saveUsersList);
    // Recipes
  // app.get('/getRecipe/:id',ingredients.getRecipe);
  // app.get('/getRecipe/:recipeNumber',ingredients.getRecipe); //todo: let's make sure this doesn't belong before we delete it. currently it's duplicated above(jfl) 

};

module.exports = exports;
