var test= require('./testData.js');
var dbinventory = require('./middleware/dbinventory.js');

module.exports = {
  getTopIngredients:function(req,res){
    res.send("called Top Ingredients");
  },

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
  }

};
