import React, {Component} from 'react';
import {Form, FormGroup, FormControl, Alert} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import AppRegisterForm from "./AppRegisterForm";
import bcrypt from 'bcryptjs';

class AppLoginForm extends Component {

    state = {
        email: "",
        password: "",
        showRegister: false,
        alertShow: false,
        alertText: ""
    };


    login = (email=null, password=null) => {
        //bcrypt password
        let salt = "$2a$10$f7sHcIdjKvMTGkc.8dJUFe9n.Qoaa9fvO2WzLqpZEsCalLkGGYtri";
        let hash = (password !== null && email !== null)? bcrypt.hashSync(password, salt): bcrypt.hashSync(this.state.password, salt);
        let mailAddress = (password !== null && email !== null)? email: this.state.email;

        console.log(hash);
        //Login code
        fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
            },
            body: JSON.stringify({"email":mailAddress,"password":hash})
        })
            .then(resp => {
                if(resp.ok) {
                    return resp.json();
                }
                else if (resp.status === 404 || resp.status === 401 || resp.status === 400) {
                    let newState = {...this.state};
                    newState['alertText'] = "The email or password was incorrect";
                    this.setState(newState);
                    this.handleAlertShow();
                    console.log("error: ", resp.status, resp);
                }
            })
            .then( json => {
                if(json !== undefined) {
                    window.localStorage.setItem("authToken", json.authToken);
                    this.props.loginHandler();
                }
            })
            .catch( error => {
                let newState = {...this.state};
                newState['alertText'] = "Something went wrong when trying to contact the server";
                this.setState(newState);
                this.handleAlertShow();
                console.log("Error: ", error);
            });


    };

    handleAlertHide = () => this.setState({ alertShow: false });
    handleAlertShow = () => this.setState({ alertShow: true });

    formChange = (event) =>
    {
        let loginObject = {...this.state};
        loginObject[event.target.name] = event.target.value;
        this.setState(loginObject);
    }

    toggleFormType = () =>
    {
        if (this.state.showRegister) {
            this.setState({showRegister: false});
        }
        else {
            this.setState({showRegister: true});
        }

    }

    renderForm = () =>
    {
        if (this.state.showRegister === false) {
            return (
            <div className = "Login" style = {{'padding': '10vh 10vw'}}>
                <div className = "text-center" >
                    <img className = "mb-4" style = {{'margin': '0 auto'}} src = {require("../images/logo.png")} alt = "CoachUp Logo" width = "85vw" height = "85vh" />
                </div>
                <h2 className = "text-center h5 mb-3 font-weight-bold" style = {{'color':'#212529', 'margin': '0 auto'}}>Please sign in with your CoachUp Account</h2>
                <Form style = {{'margin': '0 auto', 'maxWidth': '320px'}}>
                    <FormGroup controlId = "email" >
                        <Form.Label>Email</Form.Label>
                        <FormControl type = "email" name = "email" onChange = {this.formChange}/>
                    </FormGroup>
                    <FormGroup controlId = "password" >
                    <Form.Label> Password </Form.Label>
                    <FormControl type = "password" name = "password" onChange = {this.formChange}/>
                    </FormGroup>
                    <Button onClick = {this.login} block>
                        Login
                    </Button>
                    <hr/>
                    <Button variant = "outline-primary" block onClick = {this.toggleFormType}>
                        Register
                    </Button>
                    <br />
                    <Alert show={this.state.alertShow} variant="primary" dismissible onClick={this.handleAlertHide}>
                        {this.state.alertText}
                    </Alert>
                </Form>
            </div>
        )
            ;
        }
        else {
            return (
                < AppRegisterForm toggleFormType = {this.toggleFormType} login={this.login} loginHandler={this.props.loginHandler}/>
            );
        }
    }

    render()
    {
        return (
            <div>{this.renderForm()}</div>
        );
    }
}

export default AppLoginForm;