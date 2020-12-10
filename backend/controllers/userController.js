const User = require('../models/userModel');
const Question = require('../models/questionModel');

module.exports.getUser = (req, res) => {
    if (!req.params.user_id) {
        req.params.user_id = req.uid
    }
    User.findById(req.params.user_id)
        .then(user => {
            user.password = undefined;
            if (user._id != req.uid) { 
                user.collections = undefined;
            }
            res.send(user)
        })
        .catch(err => {
            console.log(err)
            res.status(400).send();
        })
}

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.uid)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send();
    });
};


module.exports.getUserPostHistory = async(req, res) => {
    Question.find({username: req.params.username})
        .then(questions =>{
            res.send(questions)
        })
        .catch (err =>{
            console.log(err)
        })
}


module.exports.getUserCollection = async (req, res) => {
    User.findOne({_id: req.uid})
    .then(user =>{
        const collection = user.collections
        const collections = []
        for (let i = 0; i < collection.lenth; i++){
            Question.findById(collection[i])
                .then(question =>{
                    collections.push(question)
                })
        }
        res.send(collections)
    })
    .catch(err =>{
        console.log(err)
    })
}

// collect item
module.exports.collectQuestion = async (req, res) =>{
    User.findOne({_id: req.uid})
        .then(user =>{
            user.collections.push(req.params.question_id)
            user.save()
                .then(user =>{
                    res.send(user)
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })
  }
  
  // uncollect item
module.exports.uncollectQuestion = async (req, res) =>{
    User.findOne({ _id: req.uid })
      .then((user) => {
        user.collections.remove(req.params.question_id);
        user
          .save()
          .then((user) => {
            res.send(user);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
