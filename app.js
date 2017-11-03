const express = require('express');
const exphbs = require('express-handlebars');
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

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

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

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
