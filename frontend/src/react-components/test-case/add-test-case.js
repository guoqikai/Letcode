import React from "react"
import { Modal } from "react-bootstrap"
import { StringToLetCodeCodeMapper, LetCodeTypeMapper} from "../../letcode-code-runner/letcode-mapper"



class AddtestCaseForm extends React.Component { 
    constructor(props) { 
        super(props)
        this.state = {
            upload: false,
            vars: this.getEmptyVars(),
            name: "",
            nameError: "",
            desc: "",
            descError: "",
            upload: false
        }
    }

    getEmptyVars() { 
        const vars = this.props.functionType.paramsType.map((x) => {
          return {
            name: x.name,
            type: x.type,
            userIn: "",
            error: "",
          };
        });
        vars.push({
           name: "return",
           type: this.props.functionType.returnType.type,
           userIn: "",
           error: "",
           isReturn: true,
         });
        return vars
    }

    updateVars(varsCp, target, field, update) { 
        let newT = { ...target };
        newT[field] = update;
        if (field !== "error")  
            newT.error = "";
        varsCp[this.state.vars.indexOf(target)] = newT
        return varsCp;
    }


    mapToGroup(varType, ind) { 
        return (
            <div className="form-group" key={ind}>
                <label htmlFor={varType.name}>{varType.name + ": " + LetCodeTypeMapper.mapType(varType.type)}</label>
                <input type="text" className={"form-control " + (varType.error !== "" ? "is-invalid" : "")} id={varType.name + (!varType.isReturn ? "-input" : "")} onChange={(e) => {
                    const varsCp = [...this.state.vars];
                    for (let ty of this.state.vars) {
                        if (ty.name + "-input" === e.target.id || (e.target.id === "return" && ty.name === "return")) {
                            this.setState({ vars: this.updateVars(varsCp, ty, "userIn", e.target.value) });
                            return;
                        }
                    }
                }} value={this.state.vars[ind].userIn}/>
                {varType.error !== "" ?
                    <div className="text-danger small">
                        {varType.error}
                    </div> : ""
                }
            </div>
        );
    }

    render() {
        const { functionType, onAdd, local } = this.props;
        
        return (
            <form>
                <div className="form-group">
                    <label htmlFor="add-testcase-name">Name:</label>
                    <input className={"form-control " + (this.state.nameError !== "" ? "is-invalid" : "")} id="add-testcase-name" required onChange={(e) => { this.setState({ name: e.target.value, nameError: "" }) }} value={ this.state.name} />
                    {this.state.nameError !== "" ?
                        <div className="text-danger small">
                            {this.state.descError}
                        </div> : null
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="add-testcase-desc">Description:</label>
                    <textarea rows="4" className={"form-control " + (this.state.descError !== "" ? "is-invalid" : "")} id="add-testcase-desc" required onChange={(e) => { this.setState({ desc: e.target.value, descError: "" }) }} value={ this.state.desc} />
                    {this.state.descError !== "" ?
                        <div className="text-danger small">
                            {this.state.descError}
                        </div> : null
                    }
                </div>
                <div className="form-row">
                    <h5>Inputs:</h5>
                </div>
                {this.state.vars.map((x, ind) => !x.isReturn ? this.mapToGroup(x, ind) : null)}
                <div className="form-row">
                    <h5>Output:</h5>
                </div>
                {this.state.vars.map((x, ind) => x.isReturn ? this.mapToGroup(x, ind) : null)}
                <div className="form-row float-right mr-1">
                    {local ?
                        <div className="form-check mr-4">
                            <input className="form-check-input" type="checkbox" id="testcase-to-server" onChange={
                                () => this.setState({ upload: !this.state.upload })
                            } />
                            <label className="form-check-label" htmlFor="testcase-to-server">
                                Upload this test case to server
                            </label>
                        </div> : null}
                    <button className="btn btn-primary" onClick={(e) => { 
                        e.preventDefault();
                        let result = {name:this.state.name, desc:this.state.desc, inputs:[], output:"", isLocal:!this.state.upload };
                        let allPass = true;
                        let varsCp = [...this.state.vars];
                        let nameError = ""
                        let descError = "";
                        const notEmpty = "this field cannot be empty!";
                        if (this.state.name === "") {
                            nameError = notEmpty;
                            allPass = false;
                        }  
                        if (this.state.desc === "") { 
                            descError = notEmpty;
                            allPass = false;
                        }
                            
                        for (let vt of this.state.vars) { 
                            if (vt.userIn === "") { 
                                this.updateVars(varsCp, vt, "error", notEmpty);
                                allPass = false;
                                continue;
                            }
                            try {
                                let formatted = (StringToLetCodeCodeMapper.mapCode(vt.userIn, vt.type));
                                if (vt.isReturn)
                                    result.output = formatted;
                                else
                                    result.inputs.push(formatted);
                            }
                            catch (err) { 
                                this.updateVars(varsCp, vt, "error", err.message);
                                allPass = false;
                            }
                        }
                        if (allPass) { 
                            this.setState({
                              name: "",
                              desc: "",
                              vars: this.getEmptyVars(),
                            });
                            onAdd(result);
                            return;
                        }
                        this.setState({ nameError: nameError, descError:descError})
                    }}>Add</button>
                </div>
            </form>
        );
    }
}


class AddTestCaseModal extends React.Component {

    render() {
        const { show, functionType, onAdd, onHide, local } = this.props;
        return (
            <Modal
                size={"lg"}
                show={show}
                onHide={onHide}
                centered
            >
                <Modal.Header closeButton>
                   <h5>New Test Case</h5>
                </Modal.Header>

                <Modal.Body>
                    <AddtestCaseForm functionType={functionType} onAdd={onAdd} local={local} />
                </Modal.Body>


            </Modal>
        )

    }
}

export { AddTestCaseModal, AddtestCaseForm };