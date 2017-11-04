if(process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI:'mongodb://resal:resal@ds249325.mlab.com:49325/vidjot-prod'}
} else {
  module.exports = {mongoURI:'mongodb://localhost/vidjot-dev'}
}
