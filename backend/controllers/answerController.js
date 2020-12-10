const Answer = require('../models/answerModel');
const User = require('../models/userModel');

module.exports.getAnswers = async (req, res) =>{
    Answer.find({ question: req.params.question_id})
      .then((answers) => {
        if (answers === undefined || answers === null) {
          res.status(400).send();
        } else {
          res.status(200).send(answers);
        }
      })
      .catch((err) => {
        console.log(err);
      });
}

module.exports.postAnswer = async (req, res) =>{
    User.findById(req.body.uid)
        .then(user => {
            const username = user.username
            const profilePic = user.profilePic
            const answer = new Answer({user: {username: username, profilePic: profilePic}, detail: {code: req.body.code, language: req.body.language}, votes: 0, question: req.params.question_id})
            answer.save()
                .then(answer =>{
                    res.send(answer)
                })
                .catch(err=>{
                    console.log(err)
                })
        })
}


module.exports.deleteAnswer = (req, res) =>{
    const {id} = req.body
    Answer.deleteOne({_id: id})
        .then(answer =>{
            res.send(answer)
        })
        .catch(err =>{
            console.log(err)
        })
}

