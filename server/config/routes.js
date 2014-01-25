
// External Modules
var express        = require("express"),
    url            = require('url'),

// Internal Modules
    recipe         = require('../recipe'),
    ingredients    = require('../ingredients'),
    searchResults  = require('../searchResults'),
    yummly         = require('../middleware/callyummly.js'),
    passportConfig = require('../config/passport');

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
  app.get('/getTopIngredients/',ingredients.getTopIngredients);
  app.get('/ingredientList/',ingredients.getIngredientList);
  app.get('/getRecipe/:recipeNumber',ingredients.getRecipe);
  app.get('/getTopIngredients/:count',ingredients.getTopIngredients);
  app.get('/searchForRecipes/',ingredients.searchForRecipes);
  app.get('/getCoOccurs/',ingredients.getCoOccurs);
  app.get('/ingredientInventory/',ingredients.getUsersRecipeList);
  app.post('/ingredientInventory/',ingredients.saveUsersList);

  // Search Results
  app.get('/searchResults/:ingredientNames',searchResults.get);

  // Recipes
  app.get('/recipe/:id', recipe.get);

};


module.exports = exports;

