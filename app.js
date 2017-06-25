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

/*
info on app.use

https://stackoverflow.com/questions/11321635/nodejs-express-what-is-app-use

app.use- used to specify processing/manipulation to be carried out on a http request

app.use(<middleware>)- because there is no route included with this call, the middleware will act on all route requests.

app.use(<route>, <middleware>) (e.g. app.use('/users', users))- because there is route included with this call, middleware will act only on requests to that route 
*/

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
var agenda = new Agenda({db: {address: config.database, collection: "retrieve_articles"}});
require('./jobs/collect_articles')(agenda);
//------------------------------------------------

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
