const mongoose = require('mongoose');
const config = require('../config/default.js');
const { mongodb } = config;

mongoose.connect(mongodb);

const userSchema = {
    'user_id': String,
    'username': String,
    'first_name' : String,
	'last_name' : String,
	'email' : String,
	'hash' : String
};

const submissionSchema = {
	'subId' : Number,
	'market' : String,
	'subDate' : Date,
	'replyDate' : Date,
	'response' : String,
	'comment' : String
}

const readerSchema = {
	'readerId' : Number,
	'name' : String,
	'readDate' : Date,
    'rating': Number,
	'comment' : String
}

const storySchema  = {
    'user_id' : String,
	'storyId' : Number,
    'title' : String,
    'words' : Number,
    'genre' : String,
    'status' : String,
    'comments' : String,
    'submissions' : [submissionSchema],
    'readers' : [readerSchema]
};

module.exports = {
    mongoose,
    User: mongoose.model('User', userSchema),
    Story: mongoose.model('Story', storySchema),
};
