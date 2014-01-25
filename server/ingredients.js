var test= require('./testData.js');
var dbinventory = require('./middleware/dbinventory.js');

module.exports = {
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
    dbinventory.getIngredientList(req, res);
  },

  getRecipe: function(req, res) {
    // getRecipe/:recipeNumber
    // send 'Salted-dark-chocolate-popcorn-314529'
    // returns recipe object
    dbinventory.getRecipeByIdString(req, res);
    // routes.yumGet(req, res);
  },
  getTopIngredients: function(req, res) {
    // getTopIngredients/
    // getTopIngredients/:count
    // empty request
    // returns array of ingredient objects
    dbinventory.getTopIngredientsList(req, res);
  },
  searchForRecipes: function(req, res) {
    // searchForRecipes/
    // send array of ingredient ids [_id1, _id2, _id3]
    // returns array of recipe objects
    saveSearchQueryAsNode(req, res);
    dbinventory.getRecipesByIngredientSearch(req, res);
  },
  
  saveSearchQueryAsNode: function(req, res) {
    // searchForRecipes/
    // send array of ingredient ids [_id1, _id2, _id3]
    // returns array of recipe objects
    dbinventory.saveSearchQueryAsNode(req, res);
    createUserSearchRelationship(req, res);
  },

  createUserSearchRelationship: function(req, res) {
    // searchForRecipes/
    // send array of ingredient ids [_id1, _id2, _id3]
    // returns array of recipe objects
    dbinventory.createUserSearchRelationship(req, res);
  },


  getCoOccurs: function(req, res) {
    // getCoOccurs/
    // send array of ingredient ids [id1, id2, id3]
    // returns array of ingredient objects
    dbinventory.findCoOccuringIngredients(req, res);
  }


};
