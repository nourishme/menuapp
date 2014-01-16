var passportConfig = require("./config/passport");

app.post('/login', passport.authenticate('local', { 
  successRedirect: '/',
  failureRedirect: '/login' 
}));