import React, { Component } from 'react'
import {ListGroup} from 'react-bootstrap'
import { getCurrentUser} from '../../api-calls/user-api-calls'
import {getQuestion} from '../../api-calls/question-api-calls'
import TitleCard from '../mainpage/TitleCard'
import AnswerCard from './AnswerCard'
import FetchWapper from "../fetchWrapper"
import "./profile.css"



function home(user) {
    return (
        <div className='col-10'>
            <div className='row-3'>
                <img className='profileImg' src={user.profilePic} alt="profile"></img>
                <h3 className='text-center'>Welcome back, {user.username}</h3>
            </div>
            <div className='row-1'>
            </div>
            <div className='row-6'>
                <div className='text-center'>
                    <h4>Number of questions: {user.questions.length} </h4>
                    <h4>Number of anwers: {user.answers.length} </h4>
                </div>
            </div>
        </div>
    )
}


function questions(user) {
    return (
        <div className='col-10'>
            {user.questions.map((question, index) => (
                <FetchWapper key={index} fetchData={(cb) => getQuestion(cb, question)}><TitleCard/></FetchWapper>
            )
            )}
            
        </div>
    )
}

function answers(user) {
    return (
        <div className='col-10'>
            {user.answers.map((answer, index) => (
                <FetchWapper key={index} fetchData={(cb) => getQuestion(cb, answer.question)}><AnswerCard/></FetchWapper>
            )
            )}
            
        </div>
    )
}


function collections(user) {
    return (
        <div className='col-10'>
             {user.collections.map((question, index) => (
                <FetchWapper key={index} fetchData={(cb) => getQuestion(cb, question)}><TitleCard/></FetchWapper>
            )
            )}
        </div>
    )
}


class Profile extends Component {
    state = {
        fileUploadState: "",
        displayID: '1',
    }


    render() {
        const user = this.props.data;
        const toggle = tab => {
            if (this.state.displayID !== tab){
                this.setState({
                    displayID: tab
                })
            };
        }
        return (
            <div className="profile-container">
                <div className="row-full-screen">
                    <div className="col-2">
                        <ListGroup>
                            <ListGroup.Item></ListGroup.Item>
                            <ListGroup.Item action onClick={() =>  toggle('1')}>
                                Home
                            </ListGroup.Item>
                            <ListGroup.Item action onClick={() => toggle('2')}>
                                My questions
                            </ListGroup.Item>
                            <ListGroup.Item action onClick={() => toggle('3')}>
                                My answers
                            </ListGroup.Item>
                            <ListGroup.Item action onClick={() => toggle('4')}>
                                Collections
                            </ListGroup.Item>
                        </ListGroup>
                    </div>
                    {this.state.displayID === '1' && home(user)}
                    {/* {this.state.displayID === '2' && personalInfo(this.props.data)} */}
                    {this.state.displayID === '2' && questions(user)}

                    {/* {this.state.displayID === '2' && <FetchWapper fetchData={(cb) => getUserPostHistory(user._id, cb)}><PostHistroy/></FetchWapper>} */}
                    {this.state.displayID === '3' && answers(user)}
                    {/* {this.state.displayID === '4' && <FetchWapper fetchData={(cb) => getUserCollection(user.data._id, cb)}><MyCollection/></FetchWapper>} */}
                    {this.state.displayID === '4' && collections(user)}
                </div>
            </div>
        )
    }
}

function wrappedProfile() {
    return <FetchWapper fetchData={getCurrentUser}><Profile /></FetchWapper>;
}

export default wrappedProfile