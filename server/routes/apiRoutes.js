var Rx = require('rx');

/* visit here for neo4js, rest api stuffs.
  http://neo4j.com/docs/stable/rest-api.html

*/
var api_root = 'http://192.168.99.100:7474';


// HACK: http://neo4j.com/docs/stable/rest-api-security.html
var usernamepassword = "neo4j:password"; // username:"password"
// base 64 encoded username/password http://base64encode.net
var payload = "bmVvNGo6cGFzc3dvcmQ=";
var authpayload = "Basic " + payload;

var http$ = require('rx-http-request').RxHttpRequest /* https://www.npmjs.com/package/rx-http-request */
  .defaults({
    headers: {
      'Authorization': authpayload,
      'Accept': 'application/json; charset=UTF-8'
    }
  })

module.exports = {
  PostWithData: postWithData,
};

function postWithData(data){
  return function(path){
    var uri = api_root + path;
    var options = {
      method: 'POST',
      port: port,
      form: data,
    };
    return http$.post(uri, options)
  }
}
