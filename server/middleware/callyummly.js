var http = require('http')
var apiauth = require('../configfile.js').yumapi;

exports.yumoptions = yumoptions = {
  host: 'http://api.yummly.com/v1'
}

var splitupsearchterms = function(searchString) {
  
}


exports.searchRecipe = searchRecipe = function(searchTerms, callback) {    
// The base url for the Search Recipes GET is
// http://api.yummly.com/v1/api/recipes?_app_id=app-id&_app_key=app-key&your_search_parameters
  var options = yumoptions;

  options.path = '/api/recipes'+ apiauth.token + '&q=' + searchTerms;
  http.get( 
    options.host+options.path, 
    function(res) {
      console.log("Got response: " + res.statusCode);
      var str = '';
      res.on('data', function(chunk){
        str += chunk
      })
      res.on('end', function(){
        callback(str);
        return str
      })
    }).on('error', function(err) {
    console.log("Got error: " + err.message)
  });
}

exports.getRecipe = getRecipe = function(recipe_id, callback) {
   // base url for the a Get Recipe GET is 
   // http://api.yummly.com/v1/api/recipe/recipe-id?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY 
   // where recipe IDs may be obtained from the Search Recipes call.
  var options = yumoptions;
  options.path = '/api/recipe/'+ recipe_id + apiauth.token;
  console.log(options.path)
  http.get( 
    options.host+options.path, 
    function(res) {
      console.log("Got response: " + res.statusCode);
      var str = '';
      res.on('data', function(chunk){
        str += chunk
      })
      res.on('end', function(){
        callback(str);
        return str
      })
    }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}

module.exports = exports;