var yummly = require('../middleware/callyummly.js');
var neo4jDB = require('../neo4jDB')


exports.dbcall = dbcall = function(req, res){
  res.send(neo4jDB.goodbyeNode.data);
};

exports.yumSearch = yumSearch = function(req, res) {
  // var result = 
  yummly.searchRecipe('kale', function(result){ res.send(result)} );
  // res.send(result);

}

exports.yumGet = yumGet = function(req, res) {
  // var result = 
  yummly.getRecipe('Sauteed-kale-with-garlic-and-onion-_melting-tuscan-kale_-309499', function(result){ res.send(result)} );
  // res.send(result);


}

module.exports = exports;
