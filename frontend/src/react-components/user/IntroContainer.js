import React, { useState } from 'react';
import EditIntro from './EditIntro'
import { Collapse } from 'reactstrap';
import { Edit } from '@icon-park/react'

const IntroContainer = (props) => {
    var { intro, user } = props
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen)
    const changeIntro = (nintro) => {
        intro = nintro
        toggle()
    }
    return (
        <div>
            <p>{intro}</p>
            <button className="blue" onClick={toggle} style={{ marginBottom: '1rem' }}>
                <Edit theme="outline" size="24" fill="#ffffff" strokeWidth={3} />{' '}Edit Introduction</button>
            <Collapse isOpen={isOpen}>
                <EditIntro user={user} intro={intro} changeIntro={changeIntro} handleChange={props.handleChange}></EditIntro>
            </Collapse>
        </div>
    );
}

export default IntroContainer