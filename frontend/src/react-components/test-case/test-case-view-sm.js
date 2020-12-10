import React from 'react'
import "./test-case-view-sm.css"


class TestCaseViewSmall extends React.Component{


    getIconByStatus(status) { 
        if (status) { 
            if (status === "running") { 
                return (
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                )
            }
            if (status === "pass") { 
                return (
                    <svg className="testcase-fade-in" xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 48 48">
                        <path fill="#28a745" d="M18 32.34L9.66 24l-2.83 2.83L18 38l24-24-2.83-2.83z" />
                    </svg>
                );
            }
            return (
                <svg className="testcase-fade-in" xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 48 48">
                    <path fill="#dc3545" d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z" />
                </svg>
            );
        }
        if (this.props.testCase.selected) { 
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 48 48">
                    <path fill="#007bff" d="M45.4 37.9L27.1 19.6c1.8-4.6.8-10.1-2.9-13.8-4-4-10-4.8-14.8-2.5l8.7 8.7-6.1 6.1-8.7-8.7C1 14.2 1.8 20.2 5.8 24.2c3.7 3.7 9.2 4.7 13.8 2.9l18.3 18.3c.8.8 2.1.8 2.8 0l4.7-4.7c.8-.7.8-2 0-2.8z" />
                </svg>
            );
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 48 48">
                <path fill="grey"d="M24 14c5.52 0 10 4.48 10 10 0 1.29-.26 2.52-.71 3.65l5.85 5.85c3.02-2.52 5.4-5.78 6.87-9.5-3.47-8.78-12-15-22.01-15-2.8 0-5.48.5-7.97 1.4l4.32 4.31c1.13-.44 2.36-.71 3.65-.71zM4 8.55l4.56 4.56.91.91C6.17 16.6 3.56 20.03 2 24c3.46 8.78 12 15 22 15 3.1 0 6.06-.6 8.77-1.69l.85.85L39.45 44 42 41.46 6.55 6 4 8.55zM15.06 19.6l3.09 3.09c-.09.43-.15.86-.15 1.31 0 3.31 2.69 6 6 6 .45 0 .88-.06 1.3-.15l3.09 3.09C27.06 33.6 25.58 34 24 34c-5.52 0-10-4.48-10-10 0-1.58.4-3.06 1.06-4.4zm8.61-1.57l6.3 6.3L30 24c0-3.31-2.69-6-6-6l-.33.03z" />
            </svg>
        )
    }

    getHeader(canSelect, _key, title) { 
        if (canSelect) { 
            return (
                <div className="form-check">
                    <input type="checkbox" className="form-check-input bg-light" id={"select-case" + _key} onChange={
                        () => {
                            this.props.onSelect(this.props.testCase);
                        }} checked={!!this.props.testCase.selected}
                        autoComplete="off" />
                    <label className="form-check-label" id="select-case-label" htmlFor={"select-case" + _key} ><h5 className="card-title" id="select-case-label-text">{title} </h5></label>
                </div>
            );
        }
        return <h5 className="card-title">{title} </h5>;
    }

    render() {
        const { testCase, onClick, _key } = this.props;
        return (
            <div className="card testcase-view-sm-body" onClick={(e) => {
                if (e.target.id !== "select-case" + _key && e.target.id !== "select-case-label" && e.target.id !== "select-case-label-text") { 
                    onClick(testCase)
                }
            }}>
                <div className={"row no-gutters testcase-card-hover-" + (testCase.status ? testCase.status : "default")}>
                    <div className="col-md-10">
                        <div className="card-body">
                            {this.getHeader(testCase.status !== "running", _key, testCase.name)}
                            <p className="card-text">{testCase.desc}</p>
                            <p className="card-text small text-muted">Submitted on {new Date(testCase.date).toDateString()}, {testCase.numRun} runs</p>
                        </div>
                    </div>
                    <div className="col-md-2 my-auto">
                        {this.getIconByStatus(testCase.status)}
                    </div>
                </div>
            </div>)
    }
}


export default TestCaseViewSmall;