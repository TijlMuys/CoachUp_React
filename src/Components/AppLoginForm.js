import React, {Component} from 'react';
import {Form, FormGroup, FormControl} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import AppRegisterForm from "./AppRegisterForm";


class AppLoginForm extends Component {

    state = {
        showRegister: false
    };

    login = () => {
        window.localStorage.setItem("authToken", "dummyToken");
        this.props.loginHandler();
    };

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
                < h1 className = "text-center h4 mb-3 font-weight-normal" style = {{'margin': '0 auto'}}>Please sign in</h1>
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
                </Form>
            </div>
        )
            ;
        }
        else {
            return (
                < AppRegisterForm toggleFormType = {this.toggleFormType}/>
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