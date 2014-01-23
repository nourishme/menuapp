var yummly = require('../middleware/callyummly.js');
var dbuser = require('../middleware/dbusercontrols.js');
var neo4jDB = require('../neo4jDB');
var url = require('url');

exports.dbcall = dbcall = function(req, res){
  
  res.send();
};

exports.yumSearch = yumSearch = function(req, res) {
  console.log(req.query);
  yummly.searchRecipe(getParamString(req.query), function(result){ res.send(result);} );
};

exports.yumGet = yumGet = function(req, res) {
  yummly.getRecipe(req.path, function(result){ res.send(result);} );
};

exports.yumIng = yumIng = function(req, res) {
  console.log(req.query);
  yummly.getIng(req, function(result){ res.send(result);} );
};

module.exports = exports;
