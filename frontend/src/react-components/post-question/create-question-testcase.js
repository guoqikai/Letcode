import React from "react";
import { AddtestCaseForm } from "../test-case/add-test-case";
import { TestCaseViewLarge } from "../test-case/test-case-view-lg";

class TestCasePage extends React.Component {
  state = {
    testCases: [],
  };

  render() {
    const { functionType, onBack, onSubmit } = this.props;
    return (
      <div className="container">
        <h2 className="mt-2">2. Add Test Case To Your Question</h2>
        <div className="row mb-4">
          <div className="col-12">
            <AddtestCaseForm
              functionType={functionType}
              local={false}
              onAdd={(tc) => {
                const newTc = [...this.state.testCases];
                newTc.push(tc);
                this.setState({ testCases: newTc });
              }}
            />
          </div>
        </div>

        {this.state.testCases.length === 0 ? (
          <div className="row bg-light p-4 my-2">
            <h5 className="center"> No Test Case Yet</h5>
          </div>
        ) : (
          this.state.testCases.map((x, ind) => (
            <div className="row card p-2 my-2" key={ind}>
              <div className="col">
                <button
                  type="button"
                  className="close float-right"
                  aria-label="Close"
                  onClick={e =>
                    this.setState({
                      testCases: this.state.testCases.filter((x, i) => String(i) !== e.target.id)
                    })
                  }
                >
                  <span aria-hidden="true" id={ind}>
                    &times;
                  </span>
                </button>
              </div>

              <TestCaseViewLarge
                testCase={x}
                functionType={functionType}
                isModal={false}
              />
            </div>
          ))
        )}
            <button className="btn btn-link mb-5 mt-2 " onClick={onBack}>{"<<"} Back</button>
            <button className="btn btn-primary float-right mb-5 mt-2" onClick={() => onSubmit(this.state.testCases)}>Post Question</button>
       
      </div>
    );
  }
}

export default TestCasePage;
