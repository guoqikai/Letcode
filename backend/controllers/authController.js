const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const age = 180 * 60;
const TOKEN_SECRET = "I'm a furniture.jpg";

function authenticateToken(req, res, next) {
    const token = req.cookies.jwt;
  if (!token) return res.status(401).send();

  jwt.verify(token, TOKEN_SECRET, (err, uid) => {
    console.log(err);
    if (err) return res.status(401).send();
    req.uid = uid;
    next();
  });
}

function tryAuthenticateToken(req, res, next) {
    const token = req.cookies.jwt;
  
  if (!token) next();

  jwt.verify(token, TOKEN_SECRET, (err, uid) => {
    console.log(err);
    req.uid = uid;
    next();
  });
}



function generateAccessToken(uid) {
  return jwt.sign(uid, TOKEN_SECRET);
}

const handleErrors = (err) => {
  let errors = {
    username: "",
    password: "",
  };

  if (err.message === "Username does not exist.") {
    errors.username = "Username does not exist.";
    return errors;
  }

  if (err.message === "Incorrect password.") {
    errors.password = "Incorrect password.";
    return errors;
  }

  if (err.code === 11000) {
    errors.username = "Username already registered";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

async function signIn(user, res) {
    const _id = user._id;
    const token = generateAccessToken(_id.toString());

    res.cookie("jwt", token, { httpOnly: true, maxAge: age * 1000 }).send({ user: user });
};

async function signup(req, res) {
  try {
    var { username, password } = req.body;
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    const user = await User.create({ username, password });
    signIn(user, res);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.login(username, password);
    signIn(user, res);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

async function logout(req, res) {
  res.cookie("jwt", null, { maxAge: 1 }).status(200).send();
};

module.exports = {
    authenticateToken: authenticateToken,
    tryAuthenticateToken: tryAuthenticateToken,
    signup: signup,
    login: login,
    logout: logout
}
