// var test= require('./testData.js');
// var dbinventory = require('./middleware/dbinventory.js');
// var pmi = require('./middleware/ingredientcorelation.js');

module.exports = {
  getTopIngredients: function(req, res) {
    // getTopIngredients/
    // getTopIngredients/:count
    // empty request
    // returns array of ingredient objects
    dbinventory.getTopIngredientsList(req, res);
  },

  getUsersRecipeList: function(req,res){
    // GET: ingredientInventory/
    dbinventory.getUserInventory(req,res);
  },

  saveUsersList: function(req,res){
    // POST ingredientInventory/
    dbinventory.updateUserInventory(req.user);
  },

  likeIngredientList: function(req, res){

  },

  getIngredientList: function(req, res) {
    // ingredientList/
    pmi.getCoOccursPlusOne(req, res);
  },

  getRecipe: function(req, res) {
    // getRecipe/:recipeNumber
    // send 'Salted-dark-chocolate-popcorn-314529'
    // returns recipe object
    dbinventory.getRecipeByIdString(req, res);
    // routes.yumGet(req, res);
  },
  searchForRecipes: function(req, res) {
    // searchForRecipes/
    // send array of ingredient ids [_id1, _id2, _id3]
    // returns array of recipe objects
    dbinventory.checkSearchQueryNode(req, res);
    dbinventory.getRecipesByIngredientSearch(req, res);
  },
  getCoOccurs: function(req, res) {
    // getCoOccurs/
    // send array of ingredient ids [id1, id2, id3]
    // returns array of ingredient objects
    pmi.getCoOccursPlusOne(req, res);
    // dbinventory.findCoOccuringIngredients(req, res); //todo: testing (jfl)

  },
  searchForRecipesNumber: function(req, res){
    dbinventory.getRecipesByIngredientsNeeded(req, res);
  }


};
