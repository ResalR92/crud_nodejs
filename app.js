const express = require('express');
const exphbs = require('express-handlebars');
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
        res.redirect('/ideas');
      });
  }
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
