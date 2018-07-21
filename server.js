const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// path module
const path = require('path');

// connecting to ROUTES
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');


// initializing express
const app = express();

// Body parser middleware
// this allows us to access req.body.whateverweput
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config (coming from config/keys.js file)
const db = require('./config/keys').mongoURI;

// connect to mongolab mongodb w/mongoose
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// second parameter is like call back function
// app.get('/', (req, res) => res.send('Hello'));

// Passport middleware
app.use(passport.initialize());

// Passport Config 
require('./config/passport')(passport);

// use ROUTES
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// server static assets if in production
// check for production
if(process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        // load react index.html file
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

// second parameter is like call back function
app.listen(port, () => console.log(`Server running on port ${port}`));