/**
 * Module dependencies.
 */

// External dependencies
var neo4jDB = require('./neo4jDB.js'),
express = require("express"),
path = require("path"),
config = require('./config/configfile'),
routes = require('./config/routes.js'),
passportConfig = require('./config/passport'),
yummly = require('./middleware/callyummly.js'),
stylus = require('stylus'),
nib = require('nib'),

// Internal Dependencies
recipe = require('./recipe'),
ingredients = require('./ingredients'),
searchResults = require('./searchResults');


var application_root = __dirname;

/**
 * Start the app.
 */

var app = express();
app.set('title', 'menuapp');
app.use(express.static('public'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: config.ids.facebook.secret }));
app.use(passportConfig.passport.initialize());
app.use(passportConfig.passport.session());
app.use(app.router);

app.use(stylus.middleware({
  src: __dirname + '/resources/',
  dest: __dirname + '/public/',
  debug: true,
  force: true,
}));


/**
 * Routes
 */

app.use('/', express.static( __dirname+ '/../app'));
app.use('/assets', express.static(__dirname + '/public/assets'));

/** 
 * API routes
 */

app.use('/search', routes.yumSearch );
app.use('/get', routes.yumGet );
app.use('/ing', routes.yumIng );


/** 
 * FB auth routes 
 */

// app.get('/login', function(req, res){
//   res.send('<a href="/auth/facebook">Login with Facebook</a>');
// });

// app.get('/auth/facebook', passportConfig.passport.authenticate('facebook'));

// app.get('/auth/facebook/callback',
// passportConfig.passport.authenticate('facebook', {
//   failureRedirect: '/login' }),
//   function(req, res){
//     console.log(req);
//   }

// );


// app.get('/logout', function(req, res){
//   req.logout();
//   res.redirect('/');
// });

// var ensureAuthenticated = function(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/');
// };

/*
* google stuff
*/

app.get('/auth/google', passportConfig.passport.authenticate('google'));

// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
app.get('/auth/google/return',
  passportConfig.passport.authenticate('google', { successRedirect: '/#/landing',
  failureRedirect: '/login' }));



/** 
 * Other Routes
 */



// Ingredients
app.get('/getTopIngredients/',ingredients.getTopIngredients);

app.get('/ingredientInventory/',ingredients.getUsersRecipeList);
app.post('/ingredientInventory/',ingredients.saveUsersList);
app.get('/ingredientList/',ingredients.getIngredientList);



// Search Results
app.get('/searchResults/:ingredientNames',searchResults.get);

// Recipes
app.get('/recipe/:id', recipe.get);

//Start the app by listening on <port>
var port = config.port || 3000;
app.listen(port);
console.log('Express app started on port ' + port);

module.exports = app;

