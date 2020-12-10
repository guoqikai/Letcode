const Question = require('../models/questionModel');
const Testcase = require('../models/testcaseModel');
const User = require('../models/userModel');

module.exports.postQuestion = (req, res) => { 
    req.body.by = req.uid;
    const question = new Question(req.body)
    question.save()
        .then(question =>{
            const type = JSON.parse(question.functionType);
            const return_question = {_id: question._id, functionType: type, name: question.name, desc: question.desc, date: question.date, by: question.by, numUpVote: question.numUpVote, numAnswers: question.numAnswers}
            res.send(return_question)
        })
        .catch(err =>{
            console.log(err)
        })
}

module.exports.getQuestion = async (req, res) => {
    let collected = false
    if (req.uid) {
        let user = await User.findById(req.uid)
        collected = user.collections.includes(req.params.question_id)
    }
    console.log(collected)
    Question.findById(req.params.question_id)
        .then(question => {
            const return_question = {_id: question._id, functionType: JSON.parse(question.functionType), name: question.name, desc: question.desc, date: question.date, by: question.by, numUpVote: question.numUpVote, numAnswers: question.numAnswers, collected}
            res.send(return_question)
        })
        .catch(err => {
            console.log(err)
        })
}

// bug
module.exports.getAllQuestion = (req, res) => {
    Question.find()
        .then((result) => {
            const data = result.map(question => { return {_id: question._id, functionType: JSON.parse(question.functionType) , name: question.name, desc: question.desc, date: question.date, by: question.by, numUpVote: question.numUpVote, numAnswers: question.numAnswers}})
            res.send(data)
        })
        .catch(err => {
            console.log(err)
        })
}


module.exports.getQuestionAllInfo = async (req, res) => { 
    Question.findById(req.params.question_id)
        .then(question => {
            const type = JSON.parse(question.functionType)
            Testcase.find({owner_id: question._id})
                .then(testcases =>{
                    User.findById(question.by)
                        .then(user => {
                            const return_question = {_id: question._id, functionType: type, name: question.name, desc: question.desc, date: question.date, by: user.username, numUpVote: question.numUpVote, numAnswers: question.numAnswers}
                            const data = {userId: req.uid, question: return_question, testCases: testcases}
                            console.log(data)
                            res.send(data)
                        })
                })
                .catch(err =>{
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })
}

// tested above 

module.exports.deleteQuestion = (req, res) =>{
    Question.deleteOne({_id: req.params._id})
        .then(question =>{
            res.send(question)
        })
        .catch(err =>{
            console.log(err)
        })
}

module.exports.upvoteQuestion = (req, res) =>{
    Question.findById(req.params.question_id)
        .then(question =>{
            question.numUpVote += 1
            question.save()
                .then(question =>{
                    res.send(question)
                })
                .catch(err =>{
                    console.log(err)
                })
        })
        .catch(err =>{
            console.log(err)
        })
}
