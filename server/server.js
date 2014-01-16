/**
 * Module dependencies.
 */

var neo4jDB = require('./neo4jDB'),
express = require("express"),
path = require("path");

var yummly = require('./middleware/callyummly.js');
var routes = require('./config/routes.js');

var application_root = __dirname;

/**
 * Start the app.
 */

var app = express();

app.set('title', 'menuapp');

/**
 * Routes
 */

app.use('/', express.static( __dirname+ '/../app'));
app.use('/db', routes.dbcall );
app.use('/apisearch', routes.yumSearch );
app.use('/apiget', routes.yumGet );

//Start the app by listening on <port>
var port = 3000;
app.listen(port);
console.log('Express app started on port ' + port);

// //Initializing logger
// logger.init(app, passport, mongoose);

// //expose app
module.exports = app;
