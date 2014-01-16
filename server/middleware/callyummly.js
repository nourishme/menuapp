var http = require('http')
var exports = {}

exports.yumapi = apiauth = {
  "id":'acc78ebe',
  "key":'c2e16312871aca681f1e86a62b46c697'
};

exports.yumoptions = yumoptions = {
  host: 'http://api.yummly.com/v1'
}

exports.searchRecipe = searchRecipe = function(searchTerms, callback) {    
// The base url for the Search Recipes GET is
// http://api.yummly.com/v1/api/recipes?_app_id=app-id&_app_key=app-key&your_search_parameters
  var options = yumoptions;
  options.path = '/api/recipes?_app_id=' + apiauth.id + '&_app_key=' + apiauth.key + '&' + searchTerms;
  // options.method = 'GET'
  console.log( );

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
    })
  .on('error', function(e) {
    console.log("Got error: " + e.message);
  });

}

exports.getRecipe = getRecipe = function(argument) {
  
}

module.exports = exports;