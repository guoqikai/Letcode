import React, { Component } from 'react'
import { Form, Container, Row, Col, ThemeProvider } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { loginUser } from '../../api-calls/user-api-calls'
import './MainLogin.css'
import  wrappedHeader from '../layout/Header'

class SignIn extends Component {
    state = {
        username: '',
        password: ''
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    onSubmit = async (e) => {
        e.preventDefault()
        const data = await loginUser(this.state.username, this.state.password)
        if (data.errors){
            alert("error")
        }
        else if (data.user) {
            wrappedHeader()
            this.props.history.push("/");
            window.location.reload();
            
        }
    }

    render() {
        return (
            <div className="MainLogin-center">
                <Container>
                    <Row>
                        <Col>
                            <h3>Sign In</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Username" id="username" onChange={this.handleChange} />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                        </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" id="password" onChange={this.handleChange} />
                            </Form.Group>

                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <button className="blue" type="submit" onClick={this.onSubmit}>
                            Sign In
                    </button>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default withRouter(SignIn)