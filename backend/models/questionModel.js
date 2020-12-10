
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    functionType:{
        type: String,
        required: [true, 'function type cannot be empty']
    },
    name:{
      type: String,
      required: [true, 'function name cannot be empty']
    },
    desc:{
        type: String,
        required: [true, 'function description cannot be empty']
    },
    date: {
        type: Date,
        default: new Date().toString()
    },
    numUpVote: {
        type: Number,
        required: false,
        default: 0,
        min: [0, 'numLikes must be at least 0.']
    },
    numAnswers: {
        type: Number,
        required: false,
        default: 0
    },
    by: {
        type: String,
        required: [true, 'Author cannot be empty.']
    },
});


const Question = mongoose.model('question', questionSchema);

module.exports = Question;