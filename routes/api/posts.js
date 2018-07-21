// bring in express because we need it to use the router
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport'); //this will protect the routes

// Post model
const Post = require('../../models/Post');

// Profile model
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

// first the local host will go to server and look at /api/posts
// then it will come to this file and go to /test
// so the final http will be localhost:5000/api/posts/test
// this is going to serve json because of res.json()
// @route GET request to api/posts/tests
// @desc  Tests posts route
// @access Public --> this is public data
router.get('/test', (req, res) => res.json({msg: "posts Works"}));

// @route API request to api/posts
// @desc  Get post
// @access public
router.get('/', (req, res) => {
    Post.find()
        .sort({date: -1}) //sort by date
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopostsfound: 'No post found'}))
});

// @route API request to api/posts/:id
// @desc  Get post by id
// @access public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopostfound: 'No post found with that ID'}));
});

// @route POST request to api/posts
// @desc  Create post
// @access private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if(!isValid) {
        // if any errors, send 400 with errors object
        res.status(400).json(errors);
    }
    
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));
});

// @route DELETE api/posts/:id
// @desc  Delete post by id
// @access Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // check for post owner bc we dont want anyone to just delete the post
                    if(post.user.toString() != req.user.id) { //post.user is not a string, so have to add toString
                        return res.status(401).json({ notauthorized: 'User not authorized'}); //want to protect this in backend
                    }

                    // delete
                    post.remove().then(() => res.json({ success: true }));
                }).catch(err => res.status(404).json({ postnotfound: 'Post not found'}));
        })
});

// @route POST api/posts/like/:id    -> id is the post id that will be liked
// @desc  Like post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //checks to see if this post already has a like
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({ alreadyliked: 'User already liked this post'});
                    } 

                    // add user id to likes array
                    post.likes.unshift({ user: req.user.id }); //unshift adds to beginning of array

                    post.save().then(post => res.json(post)); //save to database
                }).catch(err => res.status(404).json({ postnotfound: 'Post not found'}));
        })
});

// @route POST api/posts/unlike/:id    -> id is the post id that will be liked
// @desc  Unlike post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //checks to see if this post already has a like
                    //equals zero because they are not there
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({ notliked: 'You have not yet liked this post'});
                    } 

                    // get remove index to know which like to move
                    const removeIndex = post.likes
                                        .map(item => item.user.toString())
                                        .indexOf(req.user.id);

                    // splice out of array
                    post.likes.splice(removeIndex, 1);

                    // save
                    post.save().then(post => res.json(post));
                }).catch(err => res.status(404).json({ postnotfound: 'Post not found'}));
        })
});

// @route POST api/posts/comment/:id    -> id is the post id that will be commented
// @desc  add comment to post
// @access Private
router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if(!isValid) {
        // if any errors, send 400 with errors object
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id) 
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }

            // add to comments array
            post.comments.unshift(newComment);

            // save
            post.save().then(post => res.json(post))
        }).catch(err => res.status(404).json({ postnotfound: 'No post found'}));
});

// @route DELETE api/posts/comment/:id/:comment_id 
// @desc  delete comment 
// @access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), (req,res) => {

    Post.findById(req.params.id) 
        .then(post => {
            // check to see if comment exists, do this with filter
            if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({ commentnotexists: 'Comment does not exist'})
            }

            // get remove index
            const removeIndex = post.comments
                                .map(item => item._id.toString())
                                .indexOf(req.params.comment_id);

            //splice comment out of array
            post.comments.splice(removeIndex, 1);

            post.save().then(post => res.json(post));
        }).catch(err => res.status(404).json({ postnotfound: 'No post found'}));
});
module.exports = router;