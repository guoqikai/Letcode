import React from "react";
import { Route, Switch } from 'react-router-dom'
import Header from './react-components/layout/Header'
import MainLogin from './react-components/auth/MainLogin'
import MainPage from './react-components/mainpage/MainPage'
import Profile from './react-components/user/Profile'
import CreateQuestion from './react-components/post-question/create-question'
import QuestionPage from './react-components/question-page/QuestionContainer'
import AnswerQuestion from './react-components/answer-question/answer-question'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'


function App() {
  // testRunner();
  return (
    <div className="App">
      <Header></Header>
      <Switch>
        <Route exact path="/" component={MainPage}></Route>
        <Route path='/signin_up' component={MainLogin}></Route>
        <Route path='/:username/profile' component={Profile}></Route>
        <Route path='/newquestion' component={CreateQuestion}></Route>
        <Route path='/:question_id/detail' component={QuestionPage}></Route>
        <Route path='/:question_id/answer_question' component={AnswerQuestion}></Route>
        <Route path='/myprofile' component={Profile}></Route>
      </Switch>
    </div>
  );
}

export default App;
