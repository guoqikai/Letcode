const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var fs = require('fs');
const path = require('path');
const question = require('./questionModel')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be empty.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.']
    },
    profilePic: {
        type: String, 
        required: false,
        default: 'https://firebasestorage.googleapis.com/v0/b/csc309-5e855.appspot.com/o/profilePics%2Fdefaultuser.png?alt=media&token=3619fe6d-f7b6-4d10-b318-82313ddd9cb7'
    },
    intro: {
        type: String,
        required: false,
        default: 'Write something to introduce yourself.'
    },
    collections: {
        type: [String],
        required: false,
        default: []
    },
    questions: {
        type: [String],
        required: false,
        default: []
    },
    answers: {
        type: [String],
        required: false,
        default: []
    }
});


userSchema.statics.login = async function(username, password) {
    const user = await this.findOne({username});
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect password.');
    }
    throw Error('Username does not exist.');
}

const User = mongoose.model('user', userSchema);

module.exports = User;