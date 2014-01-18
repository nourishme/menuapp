var yummly = require('../middleware/callyummly.js');
var neo4jDB = require('../neo4jDB');
var url = require('url');

exports.dbcall = dbcall = function(req, res){
  res.send(neo4jDB.goodbyeNode.data);
};

exports.yumSearch = yumSearch = function(req, res) {
  console.log(req.query);
  yummly.searchRecipe(getParamString(req.query), function(result){ res.send(result);} );
};

exports.yumGet = yumGet = function(req, res) {
  // var getString = 'Sauteed-kale-with-garlic-and-onion-_melting-tuscan-kale_-309499';
  yummly.getRecipe(req.path, function(result){ res.send(result);} );
};

module.exports = exports;
