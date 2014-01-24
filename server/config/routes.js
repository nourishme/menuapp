var dbuser = require('../middleware/dbusercontrols.js');
var express = require("express");
var neo4jDB = require('../neo4jDB');
var url = require('url');
var yummly = require('../middleware/callyummly.js');
var passportConfig = require('../config/passport');

// Internal Dependencies
var recipe = require('../recipe'),
ingredients = require('../ingredients'),
searchResults = require('../searchResults');


// TODO: KW - These functions should probably go someplace else

exports.dbcall = dbcall = function(req, res){
  res.send();
};

exports.yumSearch = yumSearch = function(req, res) {
  console.log(req.query);
  yummly.searchRecipe(getParamString(req.query), function(result){ res.send(result);} );
};

exports.yumGet = yumGet = function(req, res) {
  yummly.getRecipe(req.path, function(result){ res.send(result);} );
};

exports.yumIng = yumIng = function(req, res) {
  console.log(req.query);
  yummly.getIng(req, function(result){ res.send(result);} );
};



/**
 * Routes
 */

exports.setRoutes = function(app, application_root){

  // Static
  app.use('/', express.static( application_root + '/../app'));

  // API Routes
  app.use('/search', exports.yumSearch );
  app.use('/get', exports.yumGet );
  app.use('/ing', exports.yumIng );

  // Ingredients
  app.get('/getTopIngredients/',ingredients.getTopIngredients);
  app.get('/ingredientInventory/',ingredients.getUsersRecipeList);
  app.post('/ingredientInventory/',ingredients.saveUsersList);
  app.get('/ingredientList/',ingredients.getIngredientList);
  app.get('/getRecipe/:recipeNumber',ingredients.getRecipe);
  app.get('/getTopIngredients/:count',ingredients.getTopIngredients);
  app.get('/searchForRecipes/',ingredients.searchForRecipes);
  app.get('/getCoOccurs/',ingredients.getCoOccurs);

  // Search Results
  app.get('/searchResults/:ingredientNames',searchResults.get);

  // Recipes
  app.get('/recipe/:id', recipe.get);


  /*
  * google stuff
  */

  app.get('/auth/google', passportConfig.passport.authenticate('google'));

  // Google will redirect the user to this URL after authentication.  Finish
  // the process by verifying the assertion.  If valid, the user will be
  // logged in.  Otherwise, authentication has failed.
  app.get('/auth/google/return',
    passportConfig.passport.authenticate('google', { successRedirect: '/#/landing',
    failureRedirect: '/login' }));



  /** 
   * FB auth routes 
   */

  // app.get('/login', function(req, res){
  //   res.send('<a href="/auth/facebook">Login with Facebook</a>');
  // });

  // app.get('/auth/facebook', passportConfig.passport.authenticate('facebook'));

  // app.get('/auth/facebook/callback',
  // passportConfig.passport.authenticate('facebook', {
  //   failureRedirect: '/login' }),
  //   function(req, res){
  //     console.log(req);
  //   }

  // );


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





// Export
module.exports = exports;


