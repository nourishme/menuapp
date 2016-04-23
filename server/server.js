
// External Modules
var neo4jDB        = require('./neo4jDB.js'),
    express        = require("express"),
    path           = require("path"),

// Internal Modules

    config         = require('./config/configfile'),
    routes         = require('./routes.js'),
    // passportConfig = require('./config/passport'),
    authRoutes     = require('./authRoutes.js'),
    yummly         = require('./middleware/callyummly.js');

// Configure Express
var app = express();
app.set('title', 'menuapp');
app.use(express.static('public'));
app.use(express.cookieParser());
app.use(express.bodyParser());
// app.use(express.session({ secret: config.ids.facebook.secret }));
// app.use(passportConfig.passport.initialize());
// app.use(passportConfig.passport.session());
app.use(app.router);

// Start the app
var port = 3000;
app.listen(port);
console.log('Express app started on port ' + port);

// Set routes
routes.setRoutes(app, __dirname); // Set Routes
authRoutes.setRoutes(app);

module.exports = app;

