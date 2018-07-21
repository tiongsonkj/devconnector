// authentication, login, passport

// bring in express because we need it to use the router
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


// load user model
const User = require('../../models/User');

// first the local host will go to server and look at /api/users
// then it will come to this file and go to /test
// so the final http will be localhost:5000/api/users/test
// this is going to serve json because of res.json()
// @route GET request to api/posts/tests
// @desc  Tests users route
// @access Public --> this is public data
router.get('/test', (req, res) => res.json({msg: "Users Works"}));

// @route   GET api/users/register
// @desc    Register user
// @access  Public
// .findOne() is a mongoose query
// email is form request name
// THIS IS WORKING CHECKED THROUGH POSTMAN
router.post('/register', (req, res) => {
    // pull out errors and isvalid from function we just brought in
    const { errors, isValid } = validateRegisterInput(req.body);

    // check validation
    if(!isValid) {
        return res.status(400).json({ errors });
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            // if email that was created exists, then send 400 error and json message 
            if(user) {
                errors.email = 'Email already exists';
                return res.status(400).json(errors);
            } else {
                // creating gravatar.. .url() is a function from the gravatar module
                const avatar = gravatar.url(req.body.email, {
                    s: '200', //size
                    r: 'pg', //rating
                    d: 'mm' //default
                })
                // create newUser variable from User schema
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                // encrypting our password
                // not sure what a "salt" is, but thats what we want
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => { //hash is what we want to store in database
                        if(err) throw err;

                        // setting newUser password to hash, hash is what we want
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user)) //send back successful response of user
                            .catch(err => console.log(err));
                    })
                })
            }
        })
});

// @route   GET api/users/login
// @desc    Login user / returning JWT (Json Web Token) Token
// @access  Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // grab the email and password
    const email = req.body.email;
    const password = req.body.password;


    // find user by email
    // findOne because we are looking for that one user's email
    // email is same as email: email because they have the same name (couldve written email: email)
    User.findOne({email})
        .then(user => {
            // check for user
            // if there is no user...
            if(!user) {
                errors.email = 'User not found'
                return res.status(404).json({errors});
            }

            // check password
            // use .compare because the code is hashed. so we are comparing that hashed password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        // res.json({msg: 'Success'});

                        // user matched
                        
                        const payload = { id: user.id, name: user.name, avatar: user.avatar } //create jwt payload

                        // sign token
                        // payload is what we want to include in the token
                        // third parameter is time the key expires (ep 12)
                        jwt.sign(
                            payload, 
                            keys.secretOrKey, 
                            { expiresIn: 3600 }, 
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            });
                    } else {
                        errors.password = "Password incorrect"
                        return res.status(400).json({errors});
                    }
                });
        });
});
// @route   GET api/users/current
// @desc    Return current user
// @access  Private
// this is like any other route but its protected
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    // res.json({msg: 'Success'});
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;