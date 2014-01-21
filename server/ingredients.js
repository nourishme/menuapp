var test= require('./testData.js');
var dbinventory = require('./middleware/dbinventory.js');

module.exports = {
  getUsersRecipeList: function(req,res){
    var ingredients = dbinventory.getinventory(req.userid); 
    res.send(ingredients);
  },

  saveUsersList: function(req,res){
    console.log(req.body);
    res.send(201);
  },

  likeIngredientList: function(res, req){
    
  }

};
