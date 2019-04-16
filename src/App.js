// App.js

import React, { Component } from 'react';
import AppNavBar from "./Components/AppNavBar";
import AppLoginForm from "./Components/AppLoginForm";
class App extends Component {

    state = {
        loggedIn: false
    };

    componentDidMount() {
        this.isLoggedIn();
    }

    isLoggedIn = () => {
        const authToken = window.localStorage.getItem("authToken");
        if(authToken !== null && authToken !== "")
        {
            this.setState({loggedIn: true})
        }
        else
        {
            this.setState({loggedIn: false})
        }
    }


    loginChangeHandler = () => {
        this.isLoggedIn()
    };


    showBody = () => {
        if(this.state.loggedIn) {
            return (
                <AppNavBar logoutHandler={this.loginChangeHandler}/>
            );
        }
        else {
            return (
                <AppLoginForm loginHandler={this.loginChangeHandler}/>
            );
        }
    }

    render() {
        return (
            <div className="CoachUpApp">
                {this.showBody()}
            </div>
        );
    }
}

export default App;

