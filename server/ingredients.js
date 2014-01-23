var test= require('./testData.js');
var dbinventory = require('./middleware/dbinventory.js');

module.exports = {
  getUsersRecipeList: function(req,res){
    dbinventory.getUserInventory(req,res); 
  },

  saveUsersList: function(req,res){
    dbinventory.updateUserInventory(req.user);
    // res.send(update);
  },

  likeIngredientList: function(res, req){
    
  },

  getIngredientList: function(res, req) {
    dbinventory.getIngredientList(res, req);
  },

  getRecipe: function(res, req) {
    // send recipeId
    // returns recipe object
    dbinventory.getRecipeById(res, req);
  },

  getTopIngredients: function(res, req) {
    // empty request
    // returns array of ingredient objects
    dbinventory.getTopIngredientsList(res, req);
  },

  searchForRecipes: function(res, req) {
    // send array of ingredient ids [id1, id2, id3]
    // returns array of recipe objects
    dbinventory.getRecipesByIngredientSearch(res, req);
  },

  getCoOccurs: function(res, req) {
    // send array of ingredient ids [id1, id2, id3]
    // returns array of ingredient objects
    dbinventory.findCoOccuringIngredients(res, req);
  }



};
