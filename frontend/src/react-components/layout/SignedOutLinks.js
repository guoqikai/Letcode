import React, { Component } from 'react'
import {NavLink} from 'react-bootstrap'
import { Link } from 'react-router-dom'

const SignedOutLinks = (props) => {
    return (
        <ul className="navbar-nav ml-auto">
        <li className="nav-item">
                <NavLink as={Link} to="/signin_up">Sign in/Sign up</NavLink>
        </li>
        </ul>
    )
}
export default SignedOutLinks