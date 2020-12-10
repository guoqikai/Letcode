const Testcase = require('../models/testcaseModel');

module.exports.addTestCase = (req, res) => { 
    const testcase = new Testcase(req.body)
    testcase.save()
        .then(testcase =>{
            res.send(testcase)
        })
        .catch(err =>{
            console.log(err)
        })
}

module.exports.getTestCases = (req, res) =>{
    Testcase.find({owner_id: req.params.question_id})
        .then(testcases =>{
            res.send(testcases)
        })
        .catch(err=>{
            console.log(err)
        })
}

module.exports.deleteTestCase = (req, res) =>{
    const {id} = res.body
    Testcase.deleteOne({_id: id})
        .then(testcase =>{
            res.send(testcase)
        })
        .catch(err =>{
            console.log(err)
        })
}
