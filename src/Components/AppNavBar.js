import React, { Component } from 'react';
import {Navbar} from 'react-bootstrap'
import {Nav} from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from "../Pages/Home";
import Profile from "../Pages/Profile";
import Schedule from "../Pages/Schedule";
import Coaches from "../Pages/Coaches";
import Buddies from "../Pages/Buddies";

class AppNavBar extends Component {

    Logout = () => {
        window.localStorage.removeItem("authToken");
        this.props.logoutHandler();
    }

    render() {
        return (
            <Router>
                <Navbar bg="primary" variant="dark" expand="md" fixed="top">
                    <Link to={'/'} className="navbar-brand">CoachUp</Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Link to={'/profile'} className="nav-link">Profile</Link>
                            <Link to={'/schedule'} className="nav-link">Schedule</Link>
                            <Link to={'/coaches'} className="nav-link">Coaches</Link>
                            <Link to={'/buddies'} className="nav-link">Buddies</Link>
                            {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>*/}
                        </Nav>
                        <Nav>
                            <Nav.Link onClick={this.Logout}>
                                <b>Log Out</b>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/profile' component={Profile} />
                    <Route path='/schedule' component={Schedule} />
                    <Route path='/coaches' component={Coaches} />
                    <Route path='/buddies' component={Buddies} />
                </Switch>
            </Router>
        );
    }
}
export default AppNavBar;

