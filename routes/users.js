const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load helpers
const {ensureLogged} = require('../helpers/auth');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// User Login Route
router.get('/login', ensureLogged, (req,res) => {
  res.render('users/login');
});

// Login Form -> POST
router.post('/login', (req,res,next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req,res,next);
});

// User Register Route
router.get('/register', ensureLogged, (req,res) => {
  res.render('users/register');
});

// Register Form -> POST
router.post('/register', (req,res) => {
  // console.log(req.body);
  // res.send('register');

  let errors = [];

  if(req.body.password != req.body.password2) {
    errors.push({text:'Password do not match'});
  }

  if(req.body.password < 4) {
    errors.push({text: 'Password must be at least 4 characters'});
  }

  if(errors.length > 0) {
    res.render('users/register', {
      errors:errors,
      name : req.body.name,
      email: req.body.email,
      password : req.body.password,
      password2 : req.body.password2
    })
  } else {
    User.findOne({email: req.body.email})
      .then(user => {
        if(user) {
          req.flash('error_msg','Email already registered');
          res.redirect('register');
        } else{
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          // console.log(newUser);
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash("success_msg", "You are now registered and can login");
                  res.redirect("login");
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
    // res.send('passed');
  }
});

// Logout user
router.get('/logout', (req,res) => {
  req.logout();
  req.flash('success_msg', 'You are logout');

  res.redirect('login');
});

module.exports = router;
