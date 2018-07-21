// this will post likes and comments. and you will be able to take back your likes
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create Schema
const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, //just like profiles, connect each post to a user
        ref: 'users' //refers to the users collection
    },
    text: {
        type: String,
        required: true
    },
    name: { //this will fill in programmatically, will come from user object/string
        type: String,
    },
    avatar: { //just like name...
        type: String
    },
    likes: [ //wanna link these likes to the user who liked it so that there will only be one like
        {
            user: { //we send the like into the array and if there was a dislike we take it out of the
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            name: {  
                type: String,
            },
            avatar: { 
                type: String
            },
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('post', PostSchema);