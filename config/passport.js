const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = mongoose.model('users');

module.exports = function(passport) {
  // define
  passport.use(new LocalStrategy({usernameField:'email'},(email,password,done) => {
    // console.log(email); // make sure connect to local strategy
  }));
}
