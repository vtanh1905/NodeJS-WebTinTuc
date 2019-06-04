var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var account_model = require('../models/account.model');
const bcrypt = require("bcrypt");

module.exports = function (app) {

  app.use(passport.initialize());
  app.use(passport.session());

  var ls = new LocalStrategy({
    usernameField: 'login_username',
    passwordField: 'login_password'
  }, (username, password, done) => {
    account_model.singleByUsernameStatus(username).then(rows => {
      if (rows.length === 0) {
        return done(null, false, { message: 'Invalid username' });
      }

      var user = rows[0];
      var ret = bcrypt.compareSync(password, user.Password);
      //var ret = user.password === password ? true : false;
      if (ret) {
        return done(null, user);
      }

      return done(null, false, { message: 'Invalid password' });
    }).catch(err => {
      return done(err, false);
    })
  })

  passport.use(ls);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}
