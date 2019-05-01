import React, { Component } from 'react';
import {Form, Col, FormCheck, Alert} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import bcrypt from "bcryptjs";

class AppRegisterForm extends Component {

    constructor(...args) {
        super(...args);

        this.state = {
            alertShow: false,
            alertText: "",
            validated: false,
            RegisterEmail: '',
            RegisterEmailValid: null,
            RegisterEmailError: 'Please provide a valid email address.',
            RegisterUsername: '',
            RegisterUsernameValid: null,
            RegisterUsernameError: 'Please provide a username of at least 2 characters.',
            RegisterPassword: '',
            RegisterPasswordValid: null,
            RegisterPasswordError: 'You need to provide a password of at least 6 characters.',
            RegisterRepeatPassword: '',
            RegisterRepeatPasswordValid: null,
            RegisterRepeatPasswordError: 'You need to repeat the password.',
            RegisterAccountType: 'regular',
            RegisterStreet: '',
            RegisterStreetValid: null,
            RegisterStreetError: 'Please provide a street name.',
            RegisterNumber: '',
            RegisterNumberValid: null,
            RegisterNumberError: 'Please provide a street number.',
            RegisterZip: '',
            RegisterZipValid: null,
            RegisterZipError: 'Please provide a zip code.',
            RegisterCity: '',
            RegisterCityValid: null,
            RegisterCityError: 'Please provide a city.',
            RegisterCheckbox: false,
            RegisterCheckboxValid: null,
            RegisterCheckboxError: 'You need to agree with the conditions.'
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    ValidatePassword = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
        let RegisterRepeatPassword = document.getElementById("RegisterRepeatPassword").value;
        let RegisterPassword = document.getElementById("RegisterPassword").value;
        if(RegisterPassword !== RegisterRepeatPassword) {
            document.getElementById("RegisterRepeatPassword").setCustomValidity("Passwords Don't Match");
            this.setState({RegisterRepeatPasswordError: "The passwords don't match."})
        }
        else {
            document.getElementById("RegisterRepeatPassword").setCustomValidity('');
        }
    };

    handleCheckboxChange = (e) => {
        this.setState({
            [e.target.name]: e.target.checked
        })
    };

    handleSubmit(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else
        {
            event.preventDefault();
            //hash password
            let salt = "$2a$10$f7sHcIdjKvMTGkc.8dJUFe9n.Qoaa9fvO2WzLqpZEsCalLkGGYtri";
            let hash = bcrypt.hashSync(this.state.RegisterPassword, salt);
            //register code
            fetch("http://localhost:8080/Accounts/create", {
                method: "POST",
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({"email":this.state.RegisterEmail,"userName":this.state.RegisterUsername,"password":hash,"accountType":this.state.RegisterAccountType,"street":this.state.RegisterStreet,"number":this.state.RegisterNumber,"zipCode":this.state.RegisterZip,"city":this.state.RegisterCity,"agreedConditions":this.state.RegisterCheckbox})
            })
                .then(resp => {
                    if(resp.ok) {
                        return resp.json();
                    }
                    else if (resp.status === 404 || resp.status === 401 || resp.status === 400) {
                        let newState = {...this.state};
                        newState['alertText'] = "Couldn't create a new account for this user, please try a different email address";
                        this.setState(newState);
                        this.handleAlertShow();
                        console.log("error: ", resp.status, resp);
                    }
                })
                .then( json => {
                    if(json !== undefined) {
                        this.props.login(this.state.RegisterEmail, this.state.RegisterPassword);
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
        }

        this.setState({ validated: true });
    }


    handleAlertHide = () => this.setState({ alertShow: false });
    handleAlertShow = () => this.setState({ alertShow: true });



    render() {
        const { validated } = this.state;
        return (
            <div className="Register" style={{'padding': '5vh 10vw'}}>
                <div className="text-center"><img className="mb-4" style={{'margin': '0 auto'}} src={require("../images/logo.png")} alt="CoachUp Logo" width="85vw" height="85vh" /></div>
                <h2 className = "text-center h5 mb-3 font-weight-bold" style = {{'color':'#212529', 'margin': '0 auto'}}>Register new CoachUp Account</h2>
                <Form style={{'margin': '0 auto', 'maxWidth': '320px'}} noValidate
                      validated={validated}
                      onSubmit={e => this.handleSubmit(e)}>
                    <fieldset>
                        <legend className={"h6 font-weight-bold"}>Email and Username:</legend>
                        <Form.Group controlId="RegisterEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                name='RegisterEmail'
                                required
                                type="email"
                                placeholder="Enter email"
                                value={this.state.RegisterEmail}
                                onChange={e => this.handleChange(e)}/>
                            <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">{this.state.RegisterEmailError}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="RegisterUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                pattern=".{2,}" title="Username needs to be 2 or more characters"
                                name='RegisterUsername'
                                type="text"
                                placeholder="Username"
                                required
                                value={this.state.RegisterUsername}
                                onChange={e => this.handleChange(e)}/>
                            <Form.Control.Feedback type="valid">Good choice!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">{this.state.RegisterUsernameError}</Form.Control.Feedback>
                        </Form.Group>
                    </fieldset>
                    <fieldset>
                        <legend className={"h6 font-weight-bold"}>Password:</legend>
                        <Form.Group controlId="RegisterPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                pattern=".{6,}" title="Password needs to be six or more characters"
                                name='RegisterPassword'
                                type="password"
                                placeholder="Password"
                                required
                                value={this.state.RegisterPassword}
                                onChange={e => this.ValidatePassword(e)}/>
                            <Form.Control.Feedback type="valid">Password is valid.</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">{this.state.RegisterPasswordError}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="RegisterRepeatPassword">
                            <Form.Label>Repeat Password</Form.Label>
                            <Form.Control
                                pattern=".{6,}" title="Password needs to be six or more characters"
                                name='RegisterRepeatPassword'
                                type="password"
                                placeholder="Repeat Password"
                                required
                                value={this.state.RegisterRepeatPassword}
                                onChange={e => this.ValidatePassword(e)}/>
                            <Form.Control.Feedback type="valid">Repeated password is correct.</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">{this.state.RegisterRepeatPasswordError}</Form.Control.Feedback>
                        </Form.Group>
                    </fieldset>
                    <fieldset>
                        <legend className={"h6 font-weight-bold"}>Account Type:</legend>
                        <Form.Group controlId="RegisterAccountType">
                            {/*<Form.Label>Account Type</Form.Label>*/}
                            <Form.Control as="select" name='RegisterAccountType' required value={this.state.RegisterAccountType} onChange={e => this.handleChange(e)}>
                                <option value='regular' name='RegisterAccountType' onChange={e => this.handleChange(e)}>Regular Account</option>
                                <option value='coach' name='RegisterAccountType' onChange={e => this.handleChange(e)}>Coach Account</option>
                            </Form.Control>
                    </Form.Group>
                    </fieldset>
                    <fieldset>
                        <legend className={"h6 font-weight-bold"}>Address:</legend>
                        <Form.Row>
                            <Form.Group as={Col} className={'col-8'} controlId="RegisterStreet">
                                <Form.Label>Street Name</Form.Label>
                                <Form.Control name='RegisterStreet' type="text" placeholder="Street Name" required value={this.state.RegisterStreet} onChange={e => this.handleChange(e)}/>
                                <Form.Control.Feedback type="invalid">
                                    {this.state.RegisterStreetError}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} className={'col-4'} controlId="RegisterNumber">
                                <Form.Label>Number</Form.Label>
                                <Form.Control  name='RegisterNumber' type="text" placeholder="Number" required value={this.state.RegisterNumber} onChange={e => this.handleChange(e)}/>
                                <Form.Control.Feedback type="invalid">
                                    {this.state.RegisterNumberError}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} className={'col-4'} controlId="RegisterZip">
                                <Form.Label>Zip Code</Form.Label>
                                <Form.Control  name='RegisterZip' type="text" placeholder="Zip Code" required value={this.state.RegisterZip} onChange={e => this.handleChange(e)}/>
                                <Form.Control.Feedback type="invalid">
                                    {this.state.RegisterZipError}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} className={'col-8'} controlId="RegisterCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control  name='RegisterCity' type="text" placeholder="City" required value={this.state.RegisterCity} onChange={e => this.handleChange(e)}/>
                                <Form.Control.Feedback type="invalid">
                                    {this.state.RegisterCityError}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                    </fieldset>

                    <Form.Group controlId="RegisterCheckbox">
                        <FormCheck name='RegisterCheckbox' feedback={this.state.RegisterCheckboxError} >
                            <FormCheck.Input feedback={this.state.RegisterCheckboxError}  name='RegisterCheckbox' required checked={this.state.RegisterCheckbox} onChange={e => this.handleCheckboxChange(e)}/>
                            <FormCheck.Label>I agree with the terms and conditions</FormCheck.Label>
                        </FormCheck>
                    </Form.Group>

                    <Button variant="primary" block type="submit">
                        Register
                    </Button>
                    <hr/>
                    <Button variant="outline-primary" block onClick={this.props.toggleFormType}>
                        Back to Log On screen
                    </Button>
                    <br />
                    <Alert show={this.state.alertShow} variant="primary" dismissible onClick={this.handleAlertHide}>
                        {this.state.alertText}
                    </Alert>
                </Form>
            </div>
        );
    }
}

export default AppRegisterForm;