var test= require('../app/testData.js');

module.exports = {
  getUsersList: function(req,res){
    res.send(test.possibleIngredients);
  },
  saveUsersList: function(req,res){
    res.send(201);
  }

};
