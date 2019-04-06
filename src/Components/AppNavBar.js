import React, { Component } from 'react';
import {Navbar} from 'react-bootstrap'
import {NavDropdown} from 'react-bootstrap'
import {Nav} from 'react-bootstrap'

class AppNavBar extends Component {
    render() {
        return (
            <div>
                <Navbar bg="primary" variant="dark" expand="md">
                    <Navbar.Brand href="#home">CoachUp</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Navbar.Text className="justify-content-end">
                            Signed in as: <a href="#login">Tijl Otto</a>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

export default AppNavBar;