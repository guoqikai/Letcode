const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    user:{
        type: {
            username: { type: String, required: true},
            profilePic: { type: String, required: false, default: 'https://firebasestorage.googleapis.com/v0/b/csc309-5e855.appspot.com/o/profilePics%2Fdefaultuser.png?alt=media&token=3619fe6d-f7b6-4d10-b318-82313ddd9cb7'}
          },
        required: [true, 'function type cannot be empty']
    },
    detail:{
      type: {
            code: { type: String, required: true},
            language: { type: String, required: false, default: 'Python'}
      }, 
      required: [true, 'solution detail cannot be empty']
    },
    votes: {
        type: Number,
        required: false,
        default: 0
    },
    question: {
        type: String,
        required: [true, 'must have a question']
    }
});


const Answer = mongoose.model('answer', answerSchema);

module.exports = Answer;