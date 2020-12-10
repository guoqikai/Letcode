import React from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'
import { Container, Row, Col } from 'react-bootstrap'

const MainLogin = () => {
    return (
        <Container>
            <Row>
                <Col><SignIn></SignIn></Col>
                <Col><SignUp></SignUp></Col>
            </Row>
        </Container>
    )
}

export default MainLogin