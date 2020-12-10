import React from 'react'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import { NavLink } from 'react-bootstrap'
import { getCurrentUser } from '../../api-calls/user-api-calls'
import FetchWrapper from "../fetchWrapper"

const Header = (props) => {
    return ( 
      <nav className="navbar navbar-expand-md navbar-light bg-light py-1">
        
        <div className="navbar navbar-expand-md navbar-light bg-light">
            <NavLink className="navbar-brand mx-auto" as={Link} to="/">LetCode</NavLink>
        </div>
        <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
          <ul className="navbar-nav ml-auto">
            {props.data ? <SignedInLinks user={props.data}></SignedInLinks> : <SignedOutLinks></SignedOutLinks>}
            </ul>
        </div>
    </nav>
    )
}

function wrappedHeader() {
  return <FetchWrapper fetchData={getCurrentUser}><Header /></FetchWrapper>;
}



export default wrappedHeader;