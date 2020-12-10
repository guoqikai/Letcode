import React from "react"
import { Modal } from "react-bootstrap"


class TestCaseViewLarge extends React.Component {

    render() {
        const { testCase, functionType, isModal } = this.props;
        let header;
        if (!isModal) {
            header =
                <div className="row">
                    <div className="col">
                        <h5>{testCase.name} </h5>
                    </div>
                </div>
        }
        let actualOutputHead;
        let actualOutputVal;
        if (testCase.actualOutput) {
            actualOutputHead =
                <div className="col text-info">
                    Actual Output:
                </div>;
            actualOutputVal =
                <div className="col">
                    {testCase.actualOutput}
                </div>
        }

        return <div className="container-fluid">
            {header}
            <div className="row">
                <div className="col  bg-light rounded p-2">
                    {testCase.desc}
                </div>
            </div>
            <div className="row">
                <div className="col small text-muted pt-1 border-bottom">
                    Submitted on {new Date(testCase.date).toDateString()}, {testCase.numRun} runs
                </div>
            </div>
            <div className="row mt-2">
                <div className="col text-info">
                    Inputs:
                </div>
                <div className="col text-info">
                    Expected Output:
                </div>
                {actualOutputHead}
            </div>
            <div className="row mt-2">
                <div className="col">
                    {testCase.inputs.map((x, ind) => <p key={ind}>{functionType.paramsType[ind].name + ": " + x}</p>)}
                </div>
                <div className="col">
                    {testCase.output}
                </div>
                {actualOutputVal}
            </div>
        </div>

    }
}


class TestCaseViewModal extends React.Component {

    mapStatus(status) {
        if (status === "pass") {
            return <h6 className="text-white bg-success ml-3 p-1 rounded">Passed </h6>;
        }
        if (status === "fail") {
            return <h6 className="text-white bg- bg-danger ml-3 p-1 rounded">Failed </h6>
        }
        if (status === "running") {
            return <h6 className="text-white bg- bg-secondary ml-3 p-1 rounded">Running </h6>
        }
        return null;
    }

    render() {
        const { testCase, functionType, onHide } = this.props;
        if (!testCase) {
            return null;
        }
        return (
            <Modal
                size={testCase.actualOutput ? "lg" : "md"}
                show={true}
                onHide={onHide}
                centered
            >
                <Modal.Header closeButton>
                    <h5>Test Case: {testCase.name} </h5>
                    {this.mapStatus(testCase.status)}
                </Modal.Header>

                <Modal.Body>
                    <TestCaseViewLarge testCase={testCase} functionType={functionType} isModal={true} />
                </Modal.Body>

            </Modal>
        )

    }
}

export { TestCaseViewLarge, TestCaseViewModal };