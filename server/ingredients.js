var test= require('./testData.js');
var dbinventory = require('./middleware/dbinventory.js');

module.exports = {
  getUsersRecipeList: function(req,res){
    // var ingredients = dbinventory.getUserInventory(req.userid); //TODO: this should work, isntead of hardcode below
    var ingredients = dbinventory.getUserInventory(406842); 
    res.send(ingredients);
  },

  saveUsersList: function(req,res){
    console.log(req.body);
    var update = updateUserInventory(req);
    res.send(update);
  },

  likeIngredientList: function(res, req){
    
  }

};
