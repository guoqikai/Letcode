import React, {useState} from 'react'
import { Card } from 'react-bootstrap'


function TypeCard(props){

    const type = {varname: 'var_name', type: 'List<int>', description: "this is first input para"}

    return (
    <div className="from-row justify-content-md-center">
        <div className="col-md-6">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Special title treatment</h5>
                    <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                </div>
            </div>
        </div>
    </div>
)
}

export default TypeCard;
