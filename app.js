const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const Agenda = require('agenda'); // for scheduling jobs

/*
    ng build (inside angular-src will build, so if nodemon is also called, can access ui/api on localhost:3000)
    ng serve (inside angular-src will build and run on angular-cli webpack, can access ui on localhost:4200)

*/


// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

const app = express();

const users = require('./routes/users');
const articles = require('./routes/articles');

// Port Number
const port = process.env.PORT || 8080;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/frontpage', articles);

//---------------------------------------------
//begin collection job
var connectionString = "mongodb://admin:admin@ds137882.mlab.com:37882/aggregator_database";
var agenda = new Agenda({db: {address: connectionString, collection: "retrieve_articles"}});
 
agenda.define('retrieve articles', function(job, done) {
  console.log('cool!');
  console.log(job);
  
  // here pull articles from all in news vendor domain array.
  // save articles by domain in db
  
  done();
});
 
agenda.on('ready', function() {
  agenda.every('10 seconds', 'retrieve articles');
 
  agenda.start();
});

console.log('Wait 10 seconds...');
//------------------------------------------

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint yup yup');
});

// send everything to index.html (excluding our defined routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});
