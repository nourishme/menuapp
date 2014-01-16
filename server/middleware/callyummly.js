var http = require('http')

var yumapi = {
  "id":'acc78ebe',
  "key":'c2e16312871aca681f1e86a62b46c697'
};

// The base url for the Search Recipes GET is
// http://api.yummly.com/v1/api/recipes?_app_id=app-id&_app_key=app-key&your _search_parameters
var yumoptions = {
  host: 'api.yummly.com/v1',
  port: 80,
  path: '/index.html'
}

var searchRecipe = function(req, options, parameters, callback) {
  
  

  http.get(options, function(res) {
    console.log('Got success ',res)
  })
  .on('error', function(e) {
    console.log('Got error ', e);
  })
}

var getRecipe = function(argument) {
  
}

