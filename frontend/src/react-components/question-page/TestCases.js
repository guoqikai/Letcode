import React, { Component } from 'react'
import { TestCaseViewLarge, TestCaseViewModal } from "../test-case/test-case-view-lg"
import { Type, FunctionType, VariableType } from "../../letcode-code-runner/type"
import { AddTestCaseModal } from "../test-case/add-test-case"
import FetchWrapper from "../fetchWrapper"
import { getTestCases, addTestCase } from "../../api-calls/test-case-api-calls"

class TestCases extends Component {
    constructor(props) { 
        super(props);
        this.state = {
            showAddTestCase: false,
            testCases: props.data
        }
    }
    
    onTestCaseAdd(testCase) {
        testCase.owner_id = this.props.qid
        addTestCase(testCase, tc => { this.setState({showAddTestCase:false, testCases:tc})})
    }

    render() {
        return (
            <div>
                <button type="button" className="btn btn-link" onClick={() => this.setState({ showAddTestCase: true })}>Add</button>
                {this.props.data.map((x, ind) => {
                    return (
                        <TestCaseViewLarge key={ind}
                            testCase={x}
                            functionType={this.props.type}
                            isModal={false} />)
                    })
                }
                <AddTestCaseModal show={this.state.showAddTestCase} functionType={this.props.type}
                    onAdd={this.onTestCaseAdd.bind(this)}
                    onHide={() => {
                        this.setState({ showAddTestCase: false })
                    }} local={false} />
        </div>
    )}
    
}

function wrappedTestCase(props) {
    return <FetchWrapper fetchData={(cb) => getTestCases(props.id, cb)}><TestCases qid={ props.id} type={props.type}/></FetchWrapper>
    
}

export default wrappedTestCase