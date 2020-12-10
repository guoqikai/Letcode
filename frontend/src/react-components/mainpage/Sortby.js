import React, { Component } from 'react'
import { NavDropdown } from 'react-bootstrap'


class Sortby extends Component {
    render() {
        return (
            <div>
                <NavDropdown title="Sort by" id="basic-nav-dropdown" className="active">
                    <NavDropdown.Item onClick={this.props.handleClickSortByPopular}>Most Popular</NavDropdown.Item>
                    <NavDropdown.Item onClick={this.props.handleClickSortByRecentPost}>Recently post</NavDropdown.Item>
                </NavDropdown>
            </div>       
        )
    }
}
export default Sortby;