const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const questionRoute = require("./routes/questionRoute");
const answerRoute = require("./routes/answerRoute");
const testcaseRoute = require("./routes/testcaseRoute")

const app = express();

//middleware
// app.use(express.static('public'))
app.use(express.json());
app.use(cookieParser());



// database connection
const port = process.env.PORT || 5000;
const dbURI = 'mongodb+srv://letcode:letcode123456@letcode.4epuu.mongodb.net/Letcode?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => app.listen(port))
    .catch(err => console.log(err))

app.use(express.static(__dirname + "/../frontend/build"));
// Routes
// app.get('*', checkUser);

app.use('/api/', authRoute);
app.use('/api/user', userRoute);
app.use('/api/question', questionRoute);
app.use('/api/answer', answerRoute);
app.use('/api/testcase', testcaseRoute);
app.get("*", (req, res) => {
    res.sendFile(path.resolve("../frontend/build/index.html"));
});
// handle 404 page not found 