const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require("method-override"); //update
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); //mongoose odm

const app = express();

// Map global promise - get rid of warning - deprecated promise
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev',{
  useMongoClient: true
})
.then(()=> console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// Express Session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Connect Flash
app.use(flash());

// Global variable
app.use(function(req,res,next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // for passport

  next();
});

// How middleware works
app.use((req, res, next) => {
  // console.log(Date.now());
  req.name = 'Resal Ramdahadi';
  next();
});

// Index Route
app.get('/', (req, res) => {
  // console.log(req.name);
  // res.send('INDEX');
  const title = 'Welcome';
  // res.render('index');
  res.render('index', {
    title: title
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

// Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});

// Add idea form
app.get("/ideas/add", (req, res) => {
  res.render('ideas/add');
});

// Process form
app.post('/ideas', (req,res) => {
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
app.get("/ideas/edit/:id", (req, res) => {
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
app.put('/ideas/:id', (req,res) => {
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
app.delete('/ideas/:id', (req,res) => {
  // res.send('DELETE');
  Idea.remove({
    _id : req.params.id
  })
  .then(() => {
    req.flash('success_msg','Video Idea removed');
    res.redirect('/ideas');
  });
})

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
