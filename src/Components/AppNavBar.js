import React, { Component } from 'react';
import {Navbar, Nav} from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from "../Pages/Home";
import Profile from "../Pages/Profile";
import Schedule from "../Pages/Schedule";
import Coaches from "../Pages/Coaches";
import Buddies from "../Pages/Buddies";
import Lessons from "../Pages/Lessons";
import BuddyRequest from "../Pages/BuddyRequest";

class AppNavBar extends Component {

    Logout = () => {
        //Tell the backend that the user wants to log out
        fetch("http://localhost:8080/logout", {
            method: "POST",
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'authToken': window.localStorage.getItem("authToken")
            }
        })
            .then(resp => {
                if(!resp.ok) {
                    console.log("Something went wrong: ", resp.status, resp);
                }
            })
            .catch( error => {
                console.log("Error: ", error);
            });
        window.localStorage.removeItem("authToken");
        window.localStorage.removeItem("myAccount");
        window.location.href = "/"
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
                            {console.log(this.props)}
                            {(this.props.accountType === 'coach')?  <Link to={'/lessons'} className="nav-link">Lessons</Link> : null}
                            <Link to={'/coaches'} className="nav-link">Find Coaches</Link>
                            <Link to={'/buddies'} className="nav-link">Find Buddies</Link>
                            {(this.props.accountType === 'regular')?  <Link to={'/buddyrequest'} className="nav-link">Request Buddy</Link> : null}
                            {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>*/}
                        </Nav>
                        <Nav>
                            <Nav.Link className="justify-content-end"  onClick={this.Logout}>
                                <Navbar.Text>
                                    Log out: &nbsp;<b>{this.props.displayName}</b>
                                </Navbar.Text>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/profile' component={Profile} />
                    <Route path='/schedule' component={Schedule} />
                    <Route path='/lessons' component={Lessons} />
                    <Route path='/buddyrequest' component={BuddyRequest} />
                    <Route path='/coaches' component={Coaches} />
                    <Route path='/buddies' component={Buddies} />
                </Switch>
            </Router>
        );
    }
}
export default AppNavBar;

