const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea Index Page
router.get('/', (req, res) => {
  Idea.find({})
  .sort({date:'desc'})
  .then(ideas => {
    res.render('ideas/index', {
      ideas:ideas
    });
  });
});

// Add idea form
router.get("/add", (req, res) => {
  res.render('ideas/add');
});

// Process form
router.post('/', (req,res) => {
  // console.log(req.body);
  // res.send('ok');

  let errors = [];
  if (!req.body.title) {
    errors.push({ text:'Please add a title' });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }

  if(errors.length > 0) {
    res.render('ideas/add', {
      errors : errors,
      title : req.body.title,
      details : req.body.details
    });
  } else {
    // res.send('passed');
    const newUser = {
      title : req.body.title,
      details : req.body.details
    }
    new Idea(newUser) // model
    .save()
      .then(idea => {
        req.flash("success_msg", "Video Idea added");
        res.redirect('/ideas');
      });
  }
});

// Edit idea form
router.get("/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea : idea
    });
  })
});

// Edit Form process
router.put('/:id', (req,res) => {
  // res.send('PUT');
  Idea.findOne({
    _id : req.params.id
  })
  .then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
    .then(idea => {
      req.flash("success_msg", "Video Idea updated");
        res.redirect('/ideas');
      });
    });
});

// Delete Idea
router.delete('/:id', (req,res) => {
  // res.send('DELETE');
  Idea.remove({
    _id : req.params.id
  })
  .then(() => {
    req.flash('success_msg','Video Idea removed');
    res.redirect('/ideas');
  });
});

module.exports = router;
