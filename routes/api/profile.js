// users profile

// bring in express because we need it to use the router
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');


// bringing in models
const Profile = require('../../models/Profile');
const User = require('../../models/User');


// first the local host will go to server and look at /api/profile
// then it will come to this file and go to /test
// so the final http will be localhost:5000/api/profile/test
// this is going to serve json because of res.json()
// @route GET request to api/profile/tests
// @desc  Tests users route
// @access Public --> this is public data
router.get('/test', (req, res) => res.json({msg: "Profile Works"}));

// @route GET request to api/profile
// @desc  Get current users profile
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};

    // from Profile schema
    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar']) //fetches the user object so id, name, and avatar
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route GET request to api/profile/all
// @desc  get all profiles
// @access Public
router.get('/all', (req, res) => {
    const errors = {};

    Profile.find() //.find() to find more than one
        .populate('user', ['name', 'avatar']) //populate with name and avatar from user collection
        .then(profiles => {
            if(!profiles) {
                errors.noprofile = 'There are no profiles';
                return res.status(404).json(errors);
            }

            res.json(profiles);
        }).catch(err => res.status(4040).json({ profile: 'There are no profiles' }));
});

// @route GET request to api/profile/handle/:handle
// @desc  get the profile by the handle
// @access Public
router.get('/handle/:handle', (req, res) => {
    const errors = {};

    Profile.findOne({ handle: req.params.handle }) //this will grab whatever :handle is
        .populate('user', ['name', 'avatar']) 
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }

            res.json(profile);
        }).catch(err => res.status(404).json(errors));
});

// @route GET request to api/profile/user/:user_id
// @desc  get the profile by the id
// @access Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.params.user_id }) //this will grab whatever :handle is
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }

            res.json(profile);
        }).catch(err => res.status(404).json(errors));
});

// @route POST request to api/profile
// @desc  create users profile
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // // check validation
    if(!isValid) {
        // return any errors with 400 status
        return res.status(400).json(errors);
    }
    
    // grab the fields that come in
    // this relates to the models/Profile so there is going to be alot
    const profileFields = {};
    profileFields.user = req.user.id;
    
    // checking to see if this was sent in from the field
    // if so, send it to req.body.handle
    if (req.body.handle) {
        profileFields.handle = req.body.handle;
    }
    if (req.body.company) {
        profileFields.company = req.body.company;
    }
    if (req.body.website) {
        profileFields.website = req.body.website;
    }
    if (req.body.location) {
        profileFields.location = req.body.location;
    }
    if (req.body.bio) {
        profileFields.bio = req.body.bio;
    }
    if (req.body.status) {
        profileFields.status = req.body.status;
    }
    if (req.body.githubusername) {
        profileFields.githubusername = req.body.githubusername;
    }
    // Skills - split this into an array because its an array
    if (typeof req.body.skills !== 'undefined') {
        // splits it by the comma ","
        profileFields.skills = req.body.skills.split(',');
    }
    // Social
    // need to turn this into an object
    profileFields.social = {};
    if (req.body.youtube) {
        // set the youtube key in .social to req.body.youtube value
        profileFields.social.youtube = req.body.youtube;
    }
    if (req.body.twitter) {
        // set the twitter key in .social to req.body.twitter value
        profileFields.social.twitter = req.body.twitter;
    }
    if (req.body.facebook) {
        // set the facebook key in .social to req.body.facebook value
        profileFields.social.facebook = req.body.facebook;
    }
    if (req.body.instagram) {
        // set the instagram key in .social to req.body.instagram value
        profileFields.social.instagram = req.body.instagram;
    }
    if (req.body.linkedin) {
        // set the linkedin key in .social to req.body.linkedin value
        profileFields.social.linkedin = req.body.linkedin;
    }

    // look for user
    Profile.findOne({ user: req.user.id })
        .then(profile => {  //should give us the profile
            if(profile) {   //if profile exists
                // update
                Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields }, 
                    { new: true }
                ).then(profile => res.json(profile));
            }  else {
                // create

                // check if handle exists
                Profile.findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if(profile) {
                            errors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        }

                        // save profile
                        new Profile(profileFields).save().then(profile => res.json(profile));
                    });
            }
        });
});

// @route POST request to api/profile/experience
// @desc  add experience to profile
// @access Private because we need actual user who is submitting the form
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
    // bring in validation/experience function
    const { errors, isValid } = validateExperienceInput(req.body);

    // // check validation
    if(!isValid) {
        // return any errors with 400 status
        return res.status(400).json(errors);
    }
    
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            //  add to exp array
            // unshift adds to front of array
            profile.experience.unshift(newExp);

            profile.save().then(profile => res.json(profile));
        })
});

// @route POST request to api/profile/education
// @desc  add education to profile
// @access Private because we need actual user who is submitting the form
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
    // bring in validation/experience function
    const { errors, isValid } = validateEducationInput(req.body);

    // // check validation
    if(!isValid) {
        // return any errors with 400 status
        return res.status(400).json(errors);
    }
    
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            //  add to exp array
            // unshift adds to front of array
            profile.education.unshift(newEdu);

            profile.save().then(profile => res.json(profile));
        })
});

// @route DELETE request to api/profile/experience/:exp_id
// @desc  delete experience of :id
// @access Private because we need actual user who is deleting their exp
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            // get the remove index
            // map the array to something else
            // we want to match req.params.exp_id
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id);
          
                // splice out of array to find out which one we want to remove
                profile.experience.splice(removeIndex, 1);

                // save
                profile.save().then(profile => res.json(profile));
        }).catch(err => res.status(404).json(err));
});

// @route DELETE request to api/profile/education/:edu_id
// @desc  delete education of :id
// @access Private because we need actual user who is deleting their exp
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            // get the remove index
            // map the array to something else
            // we want to match req.params.exp_id
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id); //returns index of the edu_id
          
                // splice out of array to find out which one we want to remove
                profile.education.splice(removeIndex, 1);

                // save
                profile.save().then(profile => res.json(profile));
        }).catch(err => res.status(404).json(err));
});

// @route DELETE request to api/profile
// @desc  delete user and profile
// @access Private because we need actual user who is deleting their profile
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {

    Profile.findOneAndRemove({ user: req.user.id })
        .then(() => {
            User.findOneAndRemove({ _id: req.user.id }) //matching id thats in the collection
        .then(() => res.json({ success: true }));
    });
});
module.exports = router;