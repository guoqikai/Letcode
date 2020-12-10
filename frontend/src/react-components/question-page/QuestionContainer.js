import React, { useState } from 'react'
import { Link, useLocation} from 'react-router-dom'
import QuestionDesc from './QuestionDesc'
import Answers from './Answers'
import TestCases from './TestCases'
import { TabContent, TabPane, Nav, NavItem, Row, Col, Button } from 'reactstrap'
import {NavLink, Container} from 'react-bootstrap'
import classnames from 'classnames'
import FetchWrapper from "../fetchWrapper"
import { getQuestion } from "../../api-calls/question-api-calls"

const QuestionContainer = (props) => {
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }
    
    const location = useLocation();
    const path = location.pathname.substring(0, location.pathname.lastIndexOf('/')) + '/answer_question';

    return (
        <Container>
            <Row>
                <Col sm="12">
                    <QuestionDesc question={props.data}></QuestionDesc>
                </Col>
            </Row>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '1' })}
                        onClick={() => { toggle('1'); }}
                    >
                        Answers
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '2' })}
                        onClick={() => { toggle('2'); }}
                    >
                        Test cases
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    <Row>
                        <Col sm="3">
                            <NavLink as={Link} to={path}>Add Answers</NavLink>
                        </Col>
                        <Col sm={{ size: 'auto', offset: 5 }}>
                            <Button color="link">Sort by newest</Button>
                            <Button color="link">Sort by most upvote</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12">
                            <Answers id={props.data._id}></Answers>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="2">
                    <Row>
                        <Col>
                            {/* <TestCaseViewModal></TestCaseViewModal> */}
                            <TestCases type={props.data.functionType} id={props.data._id}></TestCases>
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </Container>
    )
}

function warppedQuestionContainer(props) { 
    return <FetchWrapper fetchData={(cb) => getQuestion(cb, props.match.params.question_id)}><QuestionContainer/></FetchWrapper>
}


export default warppedQuestionContainer
