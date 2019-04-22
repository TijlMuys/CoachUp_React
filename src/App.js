// App.js

import React, { Component } from 'react';
import AppNavBar from "./Components/AppNavBar";
import AppLoginForm from "./Components/AppLoginForm";
class App extends Component {

    state = {
        loggedIn: false,
        myAccount: null
    };

    componentDidMount() {
        this.isLoggedIn();
    }

    isLoggedIn = () => {
        const authToken = window.localStorage.getItem("authToken");
        if(authToken !== null && authToken !== "")
        {
            this.setState({loggedIn: true})
            fetch("http://localhost:8080/loggedinaccount", {
                method: "GET",
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'authToken': window.localStorage.getItem("authToken")
                }
            })
                .then(resp => {
                    if (resp.ok)
                    {
                        return resp.json();
                    }
                    if (resp.status === 404 || resp.status === 401 || resp.status === 403 || resp.status === 400) {
                        console.log("error: ", resp.status, resp);
                    }
                })
                .then( json => {
                    if(json !== undefined) {
                        this.setState({myAccount: json});
                    }
                })
                .catch( error => {
                    console.log("Error: ", error);
                });
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
                <AppNavBar myAccount={this.state.myAccount} logoutHandler={this.loginChangeHandler}/>
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

