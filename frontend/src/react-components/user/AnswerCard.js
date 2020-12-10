import React, { Component } from 'react'
import { Card, ListGroup } from 'react-bootstrap'
import Editor from '../question-page/Editor'
import "./profile.css"


class AnswerCard extends Component {
    changeCode = (code) => {
        return
    }

    render() {
        return (
            <div class="list-group">
                {this.state.props.map((answer, index) => (
                    <a key={ index } href={"/" + answer._id + '/detail'} class="list-group-item list-group-item-action flex-column align-items-start">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">Go to question</h5>
                            <small>Votes: {answer.votes}</small>
                        </div>
                        <Editor
                            lang={answer.detail.language}
                            changeCode={this.changeCode}
                            code={answer.detail.code}
                            readOnly={true}
                        >
                        </Editor>
                        <small>{answer.detail.language}</small>
                    </a>
                )
                )}

            </div>
        )
        
    }  
    
}

export default AnswerCard 
