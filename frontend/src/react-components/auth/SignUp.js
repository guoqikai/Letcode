import React, { Component } from 'react'
import { Form, Container, Row, Col } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { signUpUser } from '../../api-calls/user-api-calls'
import './MainLogin.css'

class SignUp extends Component {
    state = {
        username: '',
        password: '',
        confirmPwd: ''
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleSubmit = async (e) => {
        e.preventDefault()
        if (!this.state.username  || !this.state.password || !this.state.confirmPwd) {
            alert("Missing required information.")
        } 
        else if (this.state.password !== this.state.confirmPwd) {
            alert("Confirmed password differ from the password.")
        } 
        // else if (this.state.password.length <= 8){
        //     alert("Password need to be no less than 8 characters!")
        // }
        else {
            // let user = {
            //     username: this.state.username,
            //     password: this.state.password,
            //     intro: "hi",
            //     profilePic: '../../assets/placeholder.png'
            // }
            e.preventDefault()
            let data = await signUpUser(this.state.username, this.state.password)
            if (data.user) {
                this.props.history.push("/");
                window.location.reload();
            }
            else { 
                alert(data.errors.username + "\n" + data.errors.password);
            }
        }
        
    }

    render() {
        return (
            <div className="MainLogin-center">
                <Container>
                    <Row>
                        <Col>
                            <h3>Sign Up</h3>
                        </Col>

                    </Row>
                    <Row>

                        <Col>
                            <p>Please fill in this form to create an account!</p>
                        </Col>
                    </Row>

                    <Form>
                        <Form.Row>
                            <Col>
                                <Form.Control placeholder="Username" id="username" onChange={this.handleChange} />
                            </Col>
                        </Form.Row>
                    </Form>
                    <br />
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" id="password" onChange={this.handleChange} />
                                <br></br>
                                <Form.Control type="password" placeholder="Confirm Password" id="confirmPwd" onChange={this.handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <button className="blue" type="submit" onClick={this.handleSubmit} >
                            Sign Up
                        </button>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default withRouter(SignUp)