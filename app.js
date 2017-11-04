const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require("method-override"); //update
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose'); //mongoose odm

const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

// Map global promise - get rid of warning - deprecated promise
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev',{
  useMongoClient: true
})
.then(()=> console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public'))); //set public

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

// Passport middleware -> use Session
app.use(passport.initialize());
app.use(passport.session());

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

// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
