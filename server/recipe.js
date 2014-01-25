var test= require('./testData.js');

module.exports = {
  get: function(req,res){
    res.send(test.recipe);
  }
};