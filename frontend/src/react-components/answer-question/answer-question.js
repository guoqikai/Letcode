import React from "react"
import Editor from "./editor"
import { getCodeRunner, getSupportedLang, getVersion } from "../../letcode-code-runner/code-runner-global"
import { TestCase } from "../../letcode-code-runner/code-runner"
import TestCaseViewSmall from "../test-case/test-case-view-sm"
import { TestCaseViewModal } from "../test-case/test-case-view-lg"
import { AddTestCaseModal } from "../test-case/add-test-case"
import { Tabs, Tab, Dropdown, DropdownButton } from "react-bootstrap"
import Fetchwapper from "../fetchWrapper"
import { getQuestionAllInfo } from "../../api-calls/question-api-calls"
import { postAnswer } from "../../api-calls/answers-api-calls";
import { addTestCase } from "../../api-calls/test-case-api-calls"
import "./answer-question.css"


const newLine = ">> "
const maxLogs = 100;

class AnswerQuestion extends React.Component{

    constructor(props) {
        super(props);
        const { preferedLang, testCases, userId, question } = props;
        const supLang = getSupportedLang(question.functionType);
        const defaultLang = preferedLang && supLang.includes(preferedLang) ? preferedLang : supLang[0];
        const runner = getCodeRunner(defaultLang);
        runner.setConsole(this.consoleOnMsg.bind(this), this.consoleOnErr.bind(this));
        const starter = runner.getStarterCode(question.functionType);
        let store = JSON.parse(localStorage.getItem(userId));
        if (!store) {
            store = { [question._id]: { history: [], localTestCase: [] , code:starter} };
        }
        if (!store[question._id]) { 
            store[question._id] = { history: [], localTestCase: [], code: starter };
        }
        localStorage.setItem(userId,  JSON.stringify(store));

        this.state = {
            supportedLang: supLang,
            selectedLang: defaultLang,
            tab: "Question",
            testCases: JSON.parse(JSON.stringify(testCases.concat(store[question._id].localTestCase))),
            codeRunner: runner,
            code: store[question._id].code,
            starterList: starter.split("\n"),
            log: [{ type: "info", value: "Code Runner " + getVersion() }],
            codeRunnerState: runner.state,
            showAddTestCase: false,
            testCaseDetail: null,
            testCaseSortBy: "newest",
            testCasesView: "all",
            runnerState: runner.state === "uninitialized" ? "ready" : runner.state,
            history: store[question._id].history
        };
    }


    onLangSelectChange(e) {
        this.codeRunner.setConsole(null, null);
        const runner = getCodeRunner(e.target.value)
        runner.setConsole(this.consoleOnMsg.bind(this), this.consoleOnErr.bind(this));
        const starter = runner.getStarterCode(this.props.question.functionType);
        this.setState({
            selectedLang: e.target.value,
            codeRunner: runner,
            code: starter,
            starterList: starter.split("\n"),
            codeRunnerState: runner.state
        });
    }

    getMustIncludeStarter() { 
        //lang specific
        if (this.state.selectedLang === "Python") { 
            return this.state.starterList[1];
        }
        return ""
    }

    consoleOnMsg(msg) {
        const newLog = this.state.log;
        newLog.push({ type: "info", value: msg });
        this.setState({ log: newLog.slice(Math.max(newLog.length - maxLogs, 0)) });
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    consoleOnErr(err) { 
        const newLog = this.state.log;
        newLog.push({ type: "error", value: err });
        this.setState({ log: newLog.slice(Math.max(newLog.length - maxLogs, 0)) });
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    onTestCaseAdd(testCase) { 
        if (!testCase.isLocal) { 
            testCase.owner_id = this.props.question._id;
            addTestCase(testCase, (tc) => { 
                this.setState({testCases: tc, showAddTestCase: false})
            })
            return;
        }
        testCase.numRun = 0;
        testCase.date = new Date().toString();
        const local = JSON.parse(localStorage.getItem(this.props.userId));
        local[[this.props.question._id]].localTestCase.push(testCase);
        localStorage.setItem(this.props.userId, JSON.stringify(local));
        const newCases = [...this.state.testCases];
        newCases.push(testCase);
        this.setState({ testCases: newCases, showAddTestCase: false });
    }


    onTestCaseSelect(testCase) { 
        const newCases = [...this.state.testCases];
        const update = { ...testCase };
        update.selected = !update.selected;
        newCases[newCases.indexOf(testCase)] = update;
        this.setState({ testCases: newCases });
    }

    getRecentTestInfo() { 
        if (this.state.history.length === 0) { 
            return <span className="text-secondary text-left d-inline-block small text-truncate pl-2 pt-2"
                style={{ maxWidth: "calc(42vw - 215px)" }}>
                Your code is brand new! Give it a try -{">"}
            </span>
        }
        const lastHistory = this.state.history[0]
        return (
            <span className="text-secondary text-left d-inline-block small text-truncate pl-2 pt-1"
                style={{ maxWidth: "calc(42vw - 215px)" }}>
                {"Most recent test run on " + new Date(lastHistory.testCompletionTime).toLocaleString()}
                <br />
                {String(lastHistory.testPassed) + " passed, " + String(lastHistory.testCases.length - lastHistory.testPassed) + " failed"}
            </span>
        )
    }

    mapTestCases() { 
        let testCases = this.state.testCases;
        if (this.state.testCaseSortBy === "newest")
            testCases = testCases.sort((a, b) => new Date(b.date) - new Date(a.date))
        else if (this.state.testCaseSortBy === "mostRuns") { 
            testCases = testCases.sort((a, b) => b.numRun - a.numRun)
        }
            
        if (this.state.testCasesView === "selectedOnly")
            testCases = testCases.filter(tc => tc.selected);
        return testCases.map((x, ind) =>
            <TestCaseViewSmall
                testCase={x} key={ind} _key={ind}
                onSelect={this.onTestCaseSelect.bind(this)}
                onClick={(testcase) => this.setState({ testCaseDetail: testcase })}
            />);
    }

    mapHistory() { 
        return (
            <ul className="list-group">
                {this.state.history.map((h, ind) => 
                    <li key={ind} className="list-group-item">{
                        new Date(h.testCompletionTime).toLocaleString()
                        + " | " + String(h.testPassed) + " passed, "
                        + String(h.testCases.length - h.testPassed)
                        + " failed"}
                        <button className="btn btn-link float-right p-0" onClick={() => this.setState({code: h.userCode})}>Restore Code</button>
                    </li>
                )}
            </ul>);
    }

    runTest() {
        this.setState({tab:"Test Cases"})
        let runOnce = false;
        this.state.codeRunner.init((runnerState) => { 
            if (runnerState === "ready" && !runOnce) {
                runOnce = true;
                const TestToRun = [];
                const newTestCases = [];
                for (let tc of this.state.testCases) { 
                    const newTc = { ...tc };
                    newTc.actualOutput = null;
                    if (newTc.selected) {
                        newTc.status = "running";
                        const onTestOut = (pass, output) => {
                            const nnTc = { ...newTc };
                            nnTc.numRun += 1;
                            nnTc.status = pass ? "pass" : "fail";
                            nnTc.actualOutput = output;
                            const newTcs = [...this.state.testCases];
                            newTcs[newTcs.indexOf(newTc)] = nnTc;
                            this.setState({ testCases: newTcs });
                        }
                        TestToRun.push(new TestCase(newTc.inputs, newTc.output,
                            (info) => onTestOut(true, info),
                            (err) => onTestOut(false, err)));
                    }
                    else { 
                        newTc.status = null;
                    }
                    newTestCases.push(newTc);
                }
                this.state.codeRunner
                    .runTest(this.props.question.functionType, TestToRun, this.state.code)
                    .then(codeTacker => {
                        const newHistory = [...this.state.history];
                        newHistory.unshift(codeTacker);
                        const store = JSON.parse(localStorage.getItem(this.props.userId));
                        store[this.props.question._id].history = newHistory;
                        localStorage.setItem(this.props.userId, JSON.stringify(store));
                        this.setState({history:newHistory})
                    });
                this.setState({ testCases: newTestCases});
            }
            else if (runnerState === "error") {
                alert("Error occured, try refresh your browser")
            }
            this.setState({ runnerState: runnerState });
        })
    }
    
    
    render() {
        const { question, userId } = this.props;
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-7 p-0">
                        <select className="custom-select rounded-0 border-gray border-bottom-0 "
                            onChange={this.onLangSelectChange.bind(this)}
                            value={this.state.selectedLang}>
                            {this.state.supportedLang.map((x, ind) => <option key={ind}>{x}</option>)}
                        </select>
                        <Editor code={this.state.code}
                            onCodeChange={(code) => {
                                const store = JSON.parse(localStorage.getItem(userId));
                                store[question._id].code = code;
                                localStorage.setItem(userId, JSON.stringify(store));
                                this.setState({ code: code })
                            }}
                            lang={this.state.selectedLang}
                            mustInclude={this.getMustIncludeStarter()}
                            extraTheme="answer-editor"
                        />
                        <div className="answer-console">
                            <div className="answer-console-title">
                                Console Output:
                            </div>
                            <div className="answer-console-body">
                                {this.state.log.map((x, ind) => { 
                                    if (x.type === "info") 
                                        return <p className="answer-console-text m-0 text-secondary" key={ind}><span className="text-info">{newLine}</span>{x.value}</p>
                                    if (x.type === "error") 
                                        return <p className="answer-console-text bg-danger text-white" key={ind}>{x.value}</p>
                                    return null
                                })}
                                <div style={{ float: "left", clear: "both" }}
                                    ref={(el) => { this.messagesEnd = el; }}>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-5 p-0">
                        <div className="answer-info-tab">
                            <Tabs activeKey={this.state.tab} onSelect={(k) => this.setState({tab: k})}>
                                <Tab eventKey="Question" title="Question">
                                    <div className="p-3 answer-question-body">
                                        <br/>
                                        <h4 className="text-center px-4"> {question.name}</h4>
                                        <br/>
                                        <p className="lead px-4">
                                            {question.desc}
                                        </p>
                                        <div className="text-secondary text-right small">Posted by <a href="#">{question.by}</a> on {new Date(question.date).toDateString()}</div>
                                        <div className="text-secondary text-right small">{question.numUpVote} upvote, {question.numAnswers} answers</div>
                                    </div>  
                                </Tab>
                                <Tab className="bg-light" eventKey="Test Cases" title="Test Cases">
                                    <div className="p-2 btn-group" role="group">
                                        <button type="button" className="btn btn-link" onClick={() => this.setState({showAddTestCase:true})}>Add</button>
                                        <DropdownButton variant="link" title="Sort By">
                                            <Dropdown.Item active={this.state.testCaseSortBy === "newest"}
                                                onClick={() => this.setState({ testCaseSortBy: "newest" })}>Newest</Dropdown.Item>
                                            <Dropdown.Item active={this.state.testCaseSortBy === "mostRuns"}
                                                onClick={() => this.setState({ testCaseSortBy: "mostRuns" })}>Most Runs</Dropdown.Item>
                                        </DropdownButton>
                                        <DropdownButton variant="link" title="View">
                                            <Dropdown.Item active={this.state.testCasesView === "all"}
                                                onClick={() => this.setState({ testCasesView: "all" })}>All</Dropdown.Item>
                                            <Dropdown.Item active={this.state.testCasesView === "selectedOnly"}
                                                onClick={() => this.setState({ testCasesView: "selectedOnly" })}>Selected Only</Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                    
                                    <div className="answer-test-case-body">
                                        {this.mapTestCases()}
                                    </div>
                                </Tab>
                                <Tab className="bg-light" eventKey="Test History" title="Test History">
                                    <div className="answer-question-body">
                                        {this.mapHistory()}
                                    </div>
                                </Tab>
                                <Tab eventKey="Setting" title="Setting">
                                    <div className="text-center mt-4">
                                        LetCode Code Runner: {getVersion()}
                                    </div>
                                    <div className="text-center mt-2">
                                        <button type="button" className="btn btn-link" onClick={() => {
                                            localStorage.removeItem(userId);
                                            window.location.reload(false);
                                        }}>Clear Local Storage</button>
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                        <div className="answer-button-group">
                            {this.getRecentTestInfo()}
                            <div className="btn-group float-right py-1" role="group">
                                {this.state.runnerState !== "ready" ? 
                                    <button type="button" className="btn btn-primary rounded-0 mr-2" disabled={true}>
                                        <span className="mr-2">{this.state.runnerState[0].toUpperCase() + this.state.runnerState.slice(1)}</span>
                                        <span className="spinner-border spinner-border-sm"></span>
                                    </button>
                                    :
                                    <button type="button" className="btn btn-primary rounded-0 mr-2" onClick={this.runTest.bind(this)}>
                                        <span className="mr-2">Run Test</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                            <path d="M0 0h24v24H0z" fill="none" />
                                            <path d="M8 5v14l11-7z" fill="white" />
                                        </svg>
                                    </button>
                                }
                                
                                <button type="button" className="btn btn-primary rounded-0 mr-1" onClick={() => { 
                                    postAnswer(question._id, this.state.code, userId, ()=> {
                                        this.props.history.push("/" + question._id + "/detail");
                                    })
                                }}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <TestCaseViewModal functionType={this.props.question.functionType}
                    testCase={this.state.testCaseDetail}
                    onHide={() => this.setState({ testCaseDetail: null })} />
                <AddTestCaseModal show={this.state.showAddTestCase} functionType={this.props.question.functionType}
                    onAdd={this.onTestCaseAdd.bind(this)}
                    onHide={() => { 
                    this.setState({showAddTestCase: false})
                }} local={true}/>

            </div>
            
        )
    }
}


function warppedAnswerQuestion(props) { 
    const Flatten = (props) => {
        return <AnswerQuestion history={props.history} userId={props.data.userId} question={props.data.question} testCases={props.data.testCases} />
    }
    return (
      <Fetchwapper
        fetchData={(cb) =>
          getQuestionAllInfo(props.match.params.question_id, cb)
        }
        private={true}
      >
        <Flatten />
      </Fetchwapper>
    );
}




export default warppedAnswerQuestion;