var test= require('./testData.js');
var dbinventory = require('./middleware/dbinventory.js');

module.exports = {
  getUsersRecipeList: function(req,res){
    console.log(req);
    var ingredients = dbinventory.getUserInventory(req.user); //TODO: this should work, isntead of hardcode below
    // var ingredients = dbinventory.getUserInventory(req.user); 
    res.send(ingredients);
  },

  saveUsersList: function(req,res){
    console.log(req.body);
    console.log(req.user);
    
    var update = dbinventory.updateUserInventory(req);
    res.send(update);
  },

  likeIngredientList: function(res, req){
    
  }

};
