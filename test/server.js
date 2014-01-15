// instrument by jscoverage, do not modifly this file
(function () {
  var BASE;
  if (typeof global === 'object') {
    BASE = global;
  } else if (typeof window === 'object') {
    BASE = window;
  } else {
    throw new Error('[jscoverage] unknow ENV!');
  }
  if (!BASE._$jscoverage) {
    BASE._$jscoverage = {};
    BASE._$jscoverage_cond = {};
    BASE._$jscoverage_done = function (file, line, express) {
      if (arguments.length === 2) {
        BASE._$jscoverage[file][line] ++;
      } else {
        BASE._$jscoverage_cond[file][line] ++;
        return express;
      }
    };
    BASE._$jscoverage_init = function (base, file, lines) {
      var tmp = [];
      for (var i = 0; i < lines.length; i ++) {
        tmp[lines[i]] = 0;
      }
      base[file] = tmp;
    };
  }
})();
_$jscoverage_init(_$jscoverage, "server/server.js",[4,5,7,8,9,13,14,15]);
_$jscoverage_init(_$jscoverage_cond, "server/server.js",[]);
_$jscoverage["server/server.js"].source = ["/**"," * Module dependencies."," */","var express = require('express');","var app = express();","","app.set('title', 'menuapp');","app.get('/', function(req, res){","  res.send('hello world');","});","","//Start the app by listening on <port>","var port = 3000;","app.listen(port);","console.log('Express app started on port ' + port);","","// //Initializing logger","// logger.init(app, passport, mongoose);","","// //expose app","// exports = module.exports = app;",""];
_$jscoverage_done("server/server.js", 4);
var express = require("express");

_$jscoverage_done("server/server.js", 5);
var app = express();

_$jscoverage_done("server/server.js", 7);
app.set("title", "menuapp");

_$jscoverage_done("server/server.js", 8);
app.get("/", function(req, res) {
    _$jscoverage_done("server/server.js", 9);
    res.send("hello world");
});

_$jscoverage_done("server/server.js", 13);
var port = 3e3;

_$jscoverage_done("server/server.js", 14);
app.listen(port);

_$jscoverage_done("server/server.js", 15);
console.log("Express app started on port " + port);