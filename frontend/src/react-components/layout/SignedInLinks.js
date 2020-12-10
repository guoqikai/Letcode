import { NavLink, NavDropdown } from 'react-bootstrap'
// import { getUser } from '../../api_code/GetFromBackend'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { logOutUser } from "../../api-calls/user-api-calls"


class SignedInLinks extends Component {
    render() {
        const { user } = this.props;
        return (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <NavLink as={Link} to="/newquestion">New Question</NavLink>
                </li>
                <NavDropdown title={'Hi! ' + user.username} id="basic-nav-dropdown" className="active">
                    <NavDropdown.Item as={Link} to="/myprofile">My profile</NavDropdown.Item>
                    {/* <NavDropdown.Item onClick={()=>handleLogout(this.props.user.username)}>Log out</NavDropdown.Item> */}
                    <NavDropdown.Item onClick={() => {
                        logOutUser()
                        window.location.reload();
                    }}>Log out</NavDropdown.Item>
                </NavDropdown>
            </ul>
        )
    }
}


export default  SignedInLinks