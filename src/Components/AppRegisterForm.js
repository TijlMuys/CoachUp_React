import React, { Component } from 'react';
import {Form, Col, FormCheck} from 'react-bootstrap';
import {Button} from 'react-bootstrap';

class AppRegisterForm extends Component {

    constructor(...args) {
        super(...args);

        this.state = {
            validated: false,
            RegisterEmail: '',
            RegisterUsername: '',
            RegisterPassword: '',
            RegisterRepeatPassword: '',
            RegisterAccountType: 'regular',
            RegisterStreet: '',
            RegisterNumber: '',
            RegisterZip: '',
            RegisterCity: '',
            RegisterCheckbox: false
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleCheckboxChange = (e) => {
        this.setState({
            [e.target.name]: e.target.checked
        })
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            const form = {
                RegisterEmail: this.state.RegisterEmail,
                RegisterUsername: this.state.RegisterUsername,
                RegisterPassword: this.state.RegisterPassword,
                RegisterRepeatPassword: this.state.RegisterRepeatPassword,
                RegisterAccountType: this.state.RegisterAccountType,
                RegisterStreet: this.state.RegisterStreet,
                RegisterNumber: this.state.RegisterNumber,
                RegisterZip: this.state.RegisterZip,
                RegisterCity: this.state.RegisterCity,
                RegisterCheckbox: this.state.RegisterCheckbox
            }
            console.log({form});
        }
        this.setState({ validated: true });
    }


    login = () => {
        window.localStorage.setItem("authToken", "dummyToken");
        this.props.loginHandler();
    };

    formChange = (event) => {
        let loginObject = {...this.state};
        loginObject[event.target.name] = event.target.value;
        this.setState(loginObject);
    }

    render() {
        const { validated } = this.state;
        return (
            <div className="Register" style={{'padding': '5vh 10vw'}}>
                <div className="text-center"><img className="mb-4" style={{'margin': '0 auto'}} src={require("../images/logo.png")} alt="CoachUp Logo" width="85vw" height="85vh" /></div>
                <h1 className="text-center h4 mb-3 font-weight-normal" style={{'margin': '0 auto'}}>Register a new account</h1>
                <Form style={{'margin': '0 auto', 'maxWidth': '320px'}} noValidate
                      validated={validated}
                      onSubmit={e => this.handleSubmit(e)}>
                    <fieldset>
                        <legend className={"h5"}>Email and Username:</legend>
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
                            <Form.Control.Feedback type="invalid">Please provide a valid email address.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="RegisterUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                name='RegisterUsername'
                                type="text"
                                placeholder="Username"
                                aria-describedby="inputGroupPrepend"
                                requiredvalue={this.state.RegisterUsername}
                                onChange={e => this.handleChange(e)}/>
                            <Form.Control.Feedback type="valid">Good choice!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Please provide a username.</Form.Control.Feedback>
                        </Form.Group>
                    </fieldset>
                    <fieldset>
                        <legend className={"h5"}>Password:</legend>
                        <Form.Group controlId="RegisterPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                name='RegisterPassword'
                                type="password"
                                placeholder="Password"
                                required
                                value={this.state.RegisterPassword}
                                onChange={e => this.handleChange(e)}/>
                            <Form.Control.Feedback type="valid">Password is valid.</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">You need to provide a password.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="RegisterRepeatPassword">
                            <Form.Label>Repeat Password</Form.Label>
                            <Form.Control
                                name='RegisterRepeatPassword'
                                type="password"
                                placeholder="Repeat Password"
                                required
                                value={this.state.RegisterRepeatPassword}
                                onChange={e => this.handleChange(e)}/>
                            <Form.Control.Feedback type="valid">Repeated password is correct.</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">You need to repeat your password.</Form.Control.Feedback>
                        </Form.Group>
                    </fieldset>
                    <fieldset>
                        <legend className={"h5"}>Account Type:</legend>
                        <Form.Group controlId="RegisterAccountType">
                            <Form.Label>Account Type</Form.Label>
                            <Form.Control as="select" name='RegisterAccountType' required value={this.state.RegisterAccountType} onChange={e => this.handleChange(e)}>
                                <option value='regular' name='RegisterAccountType' onChange={e => this.handleChange(e)}>Regular Account</option>
                                <option value='coach' name='RegisterAccountType' onChange={e => this.handleChange(e)}>Coach Account</option>
                            </Form.Control>
                    </Form.Group>
                    </fieldset>
                    <fieldset>
                        <legend className={"h5"}>Address:</legend>
                        <Form.Row>
                            <Form.Group as={Col} className={'col-8'} controlId="RegisterStreet">
                                <Form.Label>Street Name</Form.Label>
                                <Form.Control name='RegisterStreet' type="text" placeholder="Street Name" required value={this.state.RegisterStreet} onChange={e => this.handleChange(e)}/>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a Street Name.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} className={'col-4'} controlId="RegisterNumber">
                                <Form.Label>Number</Form.Label>
                                <Form.Control name='RegisterNumber' type="text" placeholder="Number" required value={this.state.RegisterNumber} onChange={e => this.handleChange(e)}/>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a Street Number.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} className={'col-4'} controlId="RegisterZip">
                                <Form.Label>Zip Code</Form.Label>
                                <Form.Control name='RegisterZip' type="text" placeholder="Zip Code" required value={this.state.RegisterZip} onChange={e => this.handleChange(e)}/>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a Zip Code.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} className={'col-8'} controlId="RegisterCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control name='RegisterCity' type="text" placeholder="City" required value={this.state.RegisterCity} onChange={e => this.handleChange(e)}/>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a City.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                    </fieldset>

                    <Form.Group controlId="RegisterCheckbox">
                        <FormCheck feedback={"You need to agree to the terms and conditions in order to register."}>
                            <FormCheck.Input name='RegisterCheckbox' required checked={this.state.RegisterCheckbox} onChange={e => this.handleCheckboxChange(e)}/>
                            <FormCheck.Label>I agree with the terms and conditions of this platform</FormCheck.Label>
                        </FormCheck>
                    </Form.Group>

                    <Button variant="primary" block type="submit">
                        Register
                    </Button>
                    <hr/>
                    <Button variant="outline-primary" block onClick={this.props.toggleFormType}>
                        Back to Log On screen
                    </Button>
                </Form>
            </div>
        );
    }
}

export default AppRegisterForm;