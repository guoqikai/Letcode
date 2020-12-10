
import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Star} from '@icon-park/react'
import {addCollection, removeCollection} from '../../api-calls/user-api-calls'

class QuestionDesc extends Component {

    state = {
        collected: false
    }

    componentDidMount() {
        this.setState({
            collected: this.props.question.collected
        })
    }

    toggleCollect = (id) => {
        if (this.state.collected) {
            removeCollection(id)
        } else {
            addCollection(id)
        }
        this.setState({
            collected: !this.state.collected
        })
    }

    render() {
        const question = this.props.question
        return (
            <Container>
                <Row>
                    <Col>
                        <br></br>
                        <h4>{question.name}</h4>
                        <div onClick={() => this.toggleCollect(question._id)}>
                            {!this.state.collected && <Star theme="outline" size="24" />}
                            {this.state.collected && <Star theme="filled" size="24" fill="#fcef4e" strokeWidth={3} />}
                        </div>
                        <br></br>
                        <p>{question.desc}</p>
                        
                    </Col>
                </Row>
            </Container>
        )
    }
    
}

export default QuestionDesc