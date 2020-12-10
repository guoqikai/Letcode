import React, { Component } from "react";
import { TypePopup, getTypeselectionFrom } from "./type-popup";
import { Type } from "../../letcode-code-runner/type";
import { LetCodeTypeMapper } from "../../letcode-code-runner/letcode-mapper";
import { FunctionType, VariableType } from "../../letcode-code-runner/type";
import TestCasePage from "./create-question-testcase";
import { postQuestion } from "../../api-calls/question-api-calls"
import { addTestCase } from "../../api-calls/test-case-api-calls";

class CreateQuestion extends Component {
  state = {
    title: "",
    description: "",
    functionName: "",
    returnDescription: "",
    returnType: null,
    currentInputName: "",
    currentInputDescription: "",
    currentInputType: null,
    page: 0,
    inputs: [],
    testcases: [],
    popUps: []
  };

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  pushModal(type, onComplete) {
    const newPopUps = this.state.popUps;
    newPopUps.push(() => (
      <TypePopup
        type={type}
        onComplete={onComplete}
        onCancel={this.popLast.bind(this)}
        pushModal={this.pushModal.bind(this)}
      />
    ));
    this.setState({ popUps: newPopUps });
  }

  popLast() {
    const newPopUps = this.state.popUps;
    newPopUps.pop();
    this.setState({ popUps: newPopUps });
  }

  handleTypeSelection(e) {
    if (e.target.value === "dict" || e.target.value === "list") {
      this.pushModal(e.target.value, (type) => {
        this.setState({ [e.target.id]: type });
      });
    } else {
      this.setState({
        [e.target.id]: {
          int: Type.INT,
          float: Type.FLOAT,
          bool: Type.BOOL,
          string: Type.STRING,
        }[e.target.value],
      });
    }
  }

  handleAddInput = (e) => {
    e.preventDefault();
    const inputs = [
      ...this.state.inputs,
      { inputName: "", inputDescription: "", inputType: null },
    ];
    this.setState({
      inputs: inputs,
    });
  };

  getFunctionType() { 
    return new FunctionType(this.state.functionName, this.state.inputs.map(
      x => new VariableType(x.inputName, x.inputType)
    ),
    new VariableType("return", this.state.returnType));
  }

  postCurrentQuestion(testCases) { 
    this.checkVaild();
    postQuestion({
      functionType: this.getFunctionType(),
      name: this.state.title,
      desc: this.state.description
    }, question => { 
        testCases.forEach(tc => {
          tc.owner_id = question._id;
          addTestCase(tc);
        });
        this.props.history.push("/");
    })
  }

  checkVaild() { 
    if (this.state.title === ""
      || this.state.description === ""
      || this.state.functionName === ""
      || this.state.returnType === null
      || this.state.returnDescription === ""
    ) { 
      alert("Please fill all fields ")
      return false;
    }
    if (this.state.inputs.length === 0) { 
      alert("The function needs to have at least one input!")
      return false;
    }
    return true;
  }

  render() {
    return this.state.page === 0 ? (
      <div className="container">
        <div className="row mt-2">
          <div className="col">
            <h2>1. Describe Your Question</h2>
          </div>
        </div>
        <form>
          <label htmlFor="title" className="mt-2">
            Title:
          </label>
          <input
            className="form-control"
            type="text"
            placeholder="Enter title"
            id="title"
            value={this.state.title}
            onChange={this.handleChange.bind(this)}
          />
          <label htmlFor="description" className="mt-2">
            Description:
          </label>
          <textarea
            className="form-control"
            id="description"
            placeholder="Enter description here"
            value={this.state.description}
            onChange={this.handleChange.bind(this)}
            rows={10}
          />

          <label htmlFor="create-question-function" className="mt-3">
            <h4>Describe Your Function:</h4>
          </label>
          <div
            className="create-question-function-div"
            id="create-question-function"
          >
            <div className="create-question-function-name">
              <label htmlFor="functionName">Function Name:</label>
              <input
                id="functionName"
                className="form-control"
                aria-describedby="functionNameHint"
                value={this.state.functionName}
                onChange={this.handleChange.bind(this)}
              />
              <small id="functionNameHint" className="text-muted">
                Must be 4-20 characters long. You can use whatever naming
                convention you like, but no space is allowed.
              </small>
            </div>

            <label htmlFor="create-question-input" className="mt-2">
              Input parameters:
            </label>
            <div className="form-row" id="create-question-input">
              {getTypeselectionFrom(
                this.handleTypeSelection.bind(this),
                "Select Input Type",
                this.state.currentInputType
                  ? LetCodeTypeMapper.mapType(this.state.currentInputType)
                  : "selected",
                ["int", "float", "string", "bool", "dict", "list"],
                "currentInputType"
              )}

              <div className="col col-md-2">
                <input
                  type="text"
                  className="form-control"
                  id="currentInputName"
                  placeholder="name"
                  value={this.state.currentInputName}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <div className="col col-md-5">
                <input
                  type="text"
                  className="form-control"
                  id="currentInputDescription"
                  placeholder="description of this input parameter"
                  value={this.state.currentInputDescription}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <div className="col col-md-1">
                <button
                  className="btn btn-outline-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      !this.state.currentInputType ||
                      this.state.inputs.filter(
                        (x) => x.inputName === this.state.currentInputName
                      ).length ||
                      this.state.currentInputName === ""
                    ) {
                      return;
                    }
                    const newInputs = [...this.state.inputs];
                    newInputs.push({
                      inputName: this.state.currentInputName,
                      inputDescription: this.state.currentInputDescription,
                      inputType: this.state.currentInputType,
                    });
                    this.setState({
                      inputs: newInputs,
                      currentInputName: "",
                      currentInputType: null,
                      currentInputDescription: "",
                    });
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div className="form-row justify-content-center mt-2 p-2 bg-light">
              {this.state.inputs.length === 0 ? (
                <h5 className="text-secondary">No input parameter</h5>
              ) : (
                <ul class="list-group pt-2 col-12">
                  {this.state.inputs.map((x) => (
                    <li class="list-group-item" key={x.inputName}>
                      {x.inputName}:{" "}
                      <text className="text-info px-2 bg-light mx-1">
                        {LetCodeTypeMapper.mapType(x.inputType)}
                      </text>
                      | Description:
                      <text className="text-secondary ml-2">
                        {x.inputDescription}{" "}
                      </text>
                      <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={(e) =>
                          this.setState({
                            inputs: this.state.inputs.filter(
                              (x) => x.inputName !== e.target.id
                            ),
                          })
                        }
                      >
                        <span aria-hidden="true" id={x.inputName}>
                          &times;
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <label htmlFor="create-question-return" className="mt-2">
              Return:
            </label>
            <div className="form-row" id="create-question-return">
              {getTypeselectionFrom(
                this.handleTypeSelection.bind(this),
                "Select Return Type",
                this.state.returnType
                  ? LetCodeTypeMapper.mapType(this.state.returnType)
                  : "selected",
                ["int", "float", "string", "bool", "dict", "list"],
                "returnType"
              )}
              <div className="col col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="returnDescription"
                  placeholder="description of the return value"
                  value={this.state.returnDescription}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
            </div>
          </div>
          <button
            className="btn btn-link mt-3 mb-5 float-right"
            onClick={(e) => {
              e.preventDefault();
              if (this.checkVaild())
                this.setState({ page: this.state.page + 1 });
            }}
          >
            Next &gt;&gt;
          </button>
        </form>
        {this.state.popUps.map((x) => x())}
      </div>
    ) : (
      <TestCasePage
        functionType={this.getFunctionType()}
        onBack={() => this.setState({ page: 0 })}
        onSubmit={this.postCurrentQuestion.bind(this)}
      />
    );
  }
}

export default CreateQuestion;
