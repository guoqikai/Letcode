import React, { Component } from 'react'
import { getAnswers } from '../../api_code/GetFromBackend'
import Editor from './Editor'
import "./answers.css"

class MyAnswers extends Component {
    state = {
        answers: []
    }

    componentDidMount() {
        getAnswers().then(value => {
            this.setState({
                answers: value
            })
        })
    }

    changeCode = (code) => {
        return
    }

    render() {
        const answerList = this.state.answers.length ? (
            this.state.answers.map((answer, index) => {

                return (
                    <div className="indanswer" key={index}>
                        <div>
                            {/* <p className="answerText">{answer.detail.code}</p> */}
                            <Editor
                                lang={answer.detail.language}
                                code={answer.detail.code}
                                extraTheme="answer-editor"
                                changeCode={this.changeCode}
                                readOnly={true}
                            >
                            </Editor>
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

export default MyAnswers


