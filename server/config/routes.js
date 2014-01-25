
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

  //Google Auth
  app.get('/auth/google', passportConfig.passport.authenticate('google'));

    // Google will redirect the user to this URL after authentication.  Finish
    // the process by verifying the assertion.  If valid, the user will be
    // logged in.  Otherwise, authentication has failed.
  app.get('/auth/google/return',
    passportConfig.passport.authenticate('google', { successRedirect: '/#/landing',
    failureRedirect: '/login' }));

  //FB Auth
  // app.get('/auth/facebook', passportConfig.passport.authenticate('facebook'));
  // app.get('/auth/facebook/callback',
    // passportConfig.passport.authenticate('facebook', {
    //   failureRedirect: '/login' }),
    //   function(req, res){
    //     console.log(req);
    //   }
  // );

  // Auth Helper Functions
  // app.get('/logout', function(req, res){
  //   req.logout();
  //   res.redirect('/');
  // });

  // var ensureAuthenticated = function(req, res, next) {
  //   if (req.isAuthenticated()) {
  //     return next();
  //   }
  //   res.redirect('/');
  // };
};


module.exports = exports;

