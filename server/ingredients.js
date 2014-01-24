var test= require('./testData.js');
var dbinventory = require('./middleware/dbinventory.js');

module.exports = {
  // getTopIngredients:function(req,res){
  //   res.send("called Top Ingredients");
  // },

  getUsersRecipeList: function(req,res){
    dbinventory.getUserInventory(req,res);
  },

  saveUsersList: function(req,res){
    dbinventory.updateUserInventory(req.user);
    // res.send(update);
  },

  likeIngredientList: function(req, res){
    
  },

  getIngredientList: function(req, res) {
    dbinventory.getIngredientList(req, res);
  },

  getRecipe: function(req, res) {
    // send recipeId
    // returns recipe object
    // Salted-dark-chocolate-popcorn-314529
    dbinventory.getRecipeById(req, res);
    // routes.yumGet(req, res);
  },

  getTopIngredients: function(req, res) {
    // empty request
    // returns array of ingredient objects
    dbinventory.getTopIngredientsList(req, res);
  },

  searchForRecipes: function(req, res) {
    // send array of ingredient ids [id1, id2, id3]
    // returns array of recipe objects
    dbinventory.getRecipesByIngredientSearch(req, res);
  },

  getCoOccurs: function(req, res) {
    // send array of ingredient ids [id1, id2, id3]
    // returns array of ingredient objects
    dbinventory.findCoOccuringIngredients(req, res);
  }



};
