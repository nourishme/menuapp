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
    dbinventory.getRecipeById(res, req);
  },

  getTopIngredients: function(res, req) {
    dbinventory.getTopIngredientsList(res, req);
  },

  searchForRecipes: function(res, req) {
    dbinventory.getRecipesByIngredientSearch(res, req);
  },

  getCoOccurs: function(res, req) {
    dbinventory.findCoOccuringIngredients(res, req);
  }



};
