import React, { Component } from 'react'
import Editor from './Editor'
import { UpOne, DownOne } from '@icon-park/react'
import "./answers.css"
import profilePic from '../../img_source/placeholder.png'
import FetchWapper from "../fetchWrapper"
import { getAnswers } from "../../api-calls/answers-api-calls"

class Answers extends Component {

    changeCode = (code) => {
        return
    }

    render() {
        const answers = this.props.data;
        const answerList = answers.length ? (
            answers.map((answer, index) => {
                return (
                    <div className="indanswer" key={index}>
                        <div className="answerProfile">
                            <img className="answerProfilePic" src={answer.user.profilePic} alt="profile"></img>
                            <h4 className="answerHeader">{answer.user.username}</h4>
                        </div>

                        {/* <div className="answerComment">
                            <h5>comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment</h5>
                        </div> */}

                        <div>
                            {/* <p className="answerText">{answer.detail.code}</p> */}
                            <Editor
                                lang={answer.detail.language}
                                changeCode={this.changeCode}
                                code={answer.detail.code}
                                readOnly={true}
                            >
                            </Editor>
                        </div>
                        <div className="answerReply">
                            <h5>replies</h5>
                            <div className="row">
                                <img className='replyImg' src={profilePic} alt="reply"></img>
                                <h6>username</h6>
                            </div>
                            <div className='commentSolution'>
                                <p>comment on the solution</p>
                            </div>

                        </div>
                        <div className="answerButtons">
                            <button className="answerButton">
                                {answer.upvotes}
                                <UpOne theme="outline" size="24" fill="#333" />
                            </button>
                            <button className="answerButton" >
                                {answer.downvotes}
                                <DownOne theme="outline" size="24" fill="#333" />
                            </button>
                        </div>
                    </div>
                )
            })
        ) : (
                <div>No answers</div>
            )
        return (
            <div>
                {answerList}
            </div>
        )
    }
}

function warppedAnswers(props) { 
    return <FetchWapper fetchData={(cb) => getAnswers(props.id, cb)}><Answers/></FetchWapper>
}

export default warppedAnswers


