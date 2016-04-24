// External Modules
var express        = require("express"),
    apiRoutes      = require('./routes/apiRoutes.js');
// Internal Modules
    /* reboot
     config         = require('./config/configfile'),
     passportConfig = require('./config/passport'),
     authRoutes     = require('./authRoutes.js'),
     yummly         = require('./middleware/callyummly.js');
    */

// Configure Express
var app = express();
app.set('title', 'menuapp');
app.use(express.static('app'));
app.use(express.cookieParser());
app.use(express.bodyParser());
/* reboot
 app.use(express.session({ secret: config.ids.facebook.secret }));
 app.use(passportConfig.passport.initialize());
 app.use(passportConfig.passport.session());
 */
app.use(app.router);

// Start the app
var port = 3000;
app.listen(port);
console.log('Welcome friend, visit us on port ' + port);

// Set routes
/* reboot
 routes.setRoutes(app, __dirname); // Set Routes
 authRoutes.setRoutes(app);
*/
module.exports = app;
