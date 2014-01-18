var yummly = require('../middleware/callyummly.js');
var neo4jDB = require('../neo4jDB');
var url = require('url');

exports.dbcall = dbcall = function(req, res){
  res.send(neo4jDB.goodbyeNode.data);
};

exports.yumSearch = yumSearch = function(req, res) {
  // var result = 
  // var searchParams = getParamsFromQuery(url.query);
  console.log(req.query);
  yummly.searchRecipe(req.query, function(result){ res.send(result);} );
  // res.send(result);

};

exports.yumGet = yumGet = function(req, res) {
  // var result = 
  var getString = 'Sauteed-kale-with-garlic-and-onion-_melting-tuscan-kale_-309499';
  yummly.getRecipe(getString, function(result){ res.send(result);} );
  // res.send(result);


};

module.exports = exports;
