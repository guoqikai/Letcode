const mongoose = require('mongoose');

const testcaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'testcase cannot be empty']
    },
    desc:{
        type: String,
        required: [true, 'testcase description cannot be empty']
    },
    
    // testcase owner problem
    owner_id: {
        type: String,
        required: [true, 'owner_id cannot be empty.']
    },
    inputs: {
        type: [String],
        required: [true, 'testcase input cannot be empty.']
    },
    output: {
        type: String,
        required: [true, 'testcase output cannot be empty.']
    },
    numRun: {
        type: Number,
        require: false,
        default: 0
    },
    date: {
        type: Date,
        require: false,
        default: new Date().toString()
    }
});

const Testcase = mongoose.model('testcase', testcaseSchema);

module.exports = Testcase;
