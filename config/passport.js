const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = mongoose.model('users');

module.exports = function(passport) {
  // define local strategy
  passport.use(new LocalStrategy({usernameField:'email'},(email,password,done) => {
    // console.log(email); // make sure connect to local strategy
    // Match User
    User.findOne({
      email:email
    })
    .then(user => {
      if(!user) {
        return done(null, false, {message: 'No user found'}); // params (error, user, message)
      }

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Password incorrect'});
        }
      })
    });
  }));
  // Sessions -> serialize, deserialize
  // a session will be established and maintained via a cookie set in the user's browser
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
