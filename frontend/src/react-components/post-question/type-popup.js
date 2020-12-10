import React from 'react'
import { Modal } from 'react-bootstrap'
import { Type } from '../../letcode-code-runner/type'
import { LetCodeTypeMapper } from "../../letcode-code-runner/letcode-mapper"


class TypePopup extends React.Component {

    state = {
        keyType: null,
        valueType: null,
    }

    setKey(e) {
        this.setState({
            keyType: {
                "int": Type.INT,
                "float": Type.FLOAT,
                "bool": Type.BOOL,
                "string": Type.STRING
            }[e.target.value]
        });
    }

    setValue(e, pushModal) {
        if (e.target.value === "dict" || e.target.value === "list") {
            pushModal(e.target.value, value => {
                this.setState({ valueType: value });
            });
        }
        else { 
            this.setState({
                valueType: {
                    "int": Type.INT,
                    "float": Type.FLOAT,
                    "bool": Type.BOOL,
                    "string": Type.STRING
                }[e.target.value]
            });
        }
        
    }

    getBody(type, pushModal) {
        const keyTypeStr = this.state.keyType ? LetCodeTypeMapper.mapType(this.state.keyType) : "selected" 
        const valueTypeStr = this.state.valueType ? LetCodeTypeMapper.mapType(this.state.valueType) : "selected"
        if (type === "dict") {
            return (
                <div>
                    {getTypeselectionFrom(this.setKey.bind(this), "key type", keyTypeStr, ["int", "float", "string", "bool"])}
                    {getTypeselectionFrom(e => this.setValue(e, pushModal), "value type", valueTypeStr, ["int", "float", "string", "bool", "dict", "list"])}
                </div>
            )
        }
        return getTypeselectionFrom(e => this.setValue(e, pushModal), "element type", valueTypeStr, ["int", "float", "string", "bool", "dict", "list"] )
    }
   
    render() {

        const {
            type,
            onComplete,
            onCancel,
            pushModal
        } = this.props;


        return (
            <Modal
                show={true}
                size="md"
                onHide={onCancel}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {type === "dict" ? "Specify key and value type of dict" : "Specify value type of list"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.getBody(type, pushModal)}
                </Modal.Body>
                <Modal.Footer>
                    <button className="blue bg-secondary" onClick={onCancel}>
                        Close
                    </button>
                    <button className="blue btn btn-primary" onClick={() => { 
                        if (type === "list") {
                            onComplete(Type.LIST(this.state.valueType));
                        }
                        else if (type === "dict") { 
                            onComplete(Type.DICT(this.state.keyType, this.state.valueType));

                        }
                        onCancel();
                    }}>
                        Done
                    </button>
                </Modal.Footer>
            </Modal>)
    }
}

function getTypeselectionFrom(onSelected, defaultValue, selectedValue, options, id) {
    if (selectedValue !== "selected" && !options.includes(selectedValue)) { 
        options.push(selectedValue);
    }
    return (
        <div className="col col-md-4">
            <select className="custom-select" id={id} onChange={onSelected} value={selectedValue}>
                <option value="selected">{defaultValue}</option>
                {options.map((o, i) => <option key={i} value={o}>{o}</option> )}
            </select>
        </div>
    )
}


export { TypePopup, getTypeselectionFrom };
