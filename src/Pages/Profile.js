import React, { Component } from 'react';
import {Button, Col, Container, Jumbotron, Row, Card, Form, Alert, ButtonGroup} from "react-bootstrap";
import Spinner from "react-bootstrap/es/Spinner";
import bcrypt from "bcryptjs";


class Profile extends Component {

    state = {
        myUser: null,
        myAccount: null,
        myAccountType: "",
        myAccountId: "",
        showEdit: false,
        alertShow: false,
        alertProfileShow: false,
        alertText: "",
        alertProfileText: "",
        validated: false,
        validatedProfile: false,
        showProfileEdit: false,
        email: "",
        userName:"",
        newPassword: "",
        repeatNewPassword: "",
        phone: "",
        street: "",
        number: "",
        zipCode: "",
        city: "",
        profileImg: "",
        profileText: ""
    };

    loadCoachProfileData = (accountId) => {
        fetch("http://localhost:8080/Coaches/search/"+ accountId, {
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
                    this.setState({myUser: json});
                    this.setProfile();
                }
            })
            .catch( error => {
                console.log("Error: ", error);
            });
    };

    loadSporterProfileData = (accountId) => {
            fetch("http://localhost:8080/Sporters/search/"+ accountId, {
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
                        this.setState({myUser: json});
                        this.setProfile();
                    }
                })
                .catch( error => {
                    console.log("Error: ", error);
                });
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
            let hash = bcrypt.hashSync(this.state.newPassword, salt);
            //post
            fetch("http://localhost:8080/Accounts/update", {
                method: "POST",
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'authToken': window.localStorage.getItem("authToken")

                },
                body: JSON.stringify({"id":this.state.myAccountId,
                    "email":this.state.email,
                    "userName":this.state.userName,
                    "password":hash,
                    "phone":this.state.phone,
                    "street":this.state.street,
                    "number":this.state.number,
                    "zipCode":this.state.zipCode,
                    "city":this.state.city})
            })
                .then(resp => {
                    if(resp.ok) {
                        return resp.json();
                    }
                    else if (resp.status === 404 || resp.status === 401 || resp.status === 400) {
                        let newState = {...this.state};
                        newState['alertText'] = "Couldn't update the account, the provided email address might already be used by a different account";
                        this.setState(newState);
                        this.handleAlertShow();
                        console.log("error: ", resp.status, resp);
                    }
                })
                .then( json => {
                    if(json !== undefined) {
                        //LOGOUT
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

    handleProfileSubmit(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else
        {
            event.preventDefault();
            //determine user type
            if(this.state.myAccountType === "regular")
            {
                fetch("http://localhost:8080/Sporters/update", {
                    method: "POST",
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'authToken': window.localStorage.getItem("authToken")

                    },
                    body: JSON.stringify({"id":this.state.myUser['id'],
                        "profileImg":this.state.profileImg,
                        "profileText":this.state.profileText})
                })
                    .then(resp => {
                        if(resp.ok) {
                            return resp.json();
                        }
                        else if (resp.status === 404 || resp.status === 401 || resp.status === 400) {
                            let newState = {...this.state};
                            newState['alertText'] = "Couldn't update the profile, profile not found in database";
                            this.setState(newState);
                            this.handleAlertShow();
                            console.log("error: ", resp.status, resp);
                        }
                    })
                    .then( json => {
                        if(json !== undefined) {
                            //force update
                            this.forceUpdate();
                            window.location.reload();
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
            if(this.state.myAccountType === "coach")
            {
                fetch("http://localhost:8080/Coaches/update", {
                    method: "POST",
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'authToken': window.localStorage.getItem("authToken")

                    },
                    body: JSON.stringify({"id":this.state.myUser['id'],
                        "profileImg":this.state.profileImg,
                        "profileText":this.state.profileText})
                })
                    .then(resp => {
                        if(resp.ok) {
                            return resp.json();
                        }
                        else if (resp.status === 404 || resp.status === 401 || resp.status === 400) {
                            let newState = {...this.state};
                            newState['alertText'] = "Couldn't update the profile, profile not found in database";
                            this.setState(newState);
                            this.handleAlertShow();
                            console.log("error: ", resp.status, resp);
                        }
                    })
                    .then( json => {
                        if(json !== undefined) {
                            //force update
                            this.forceUpdate();
                            window.location.reload();
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

        }

        this.setState({ validatedProfile: true });
    }

    toggleProfileEdit = (showProfileEdit) => {
        if(showProfileEdit === true){
            this.setState({ showProfileEdit: false });
        }
        else
        {
            this.setState({ showProfileEdit: true });
        }
    };


    setAccount = () =>
    {
        this.setState({myAccount: JSON.parse(localStorage.getItem('myAccount'))});
        this.setState({myAccountId: JSON.parse(localStorage.getItem('myAccount'))['id']});
        this.setState({myAccountType: JSON.parse(localStorage.getItem('myAccount'))['accountType']});
        this.setState({email: JSON.parse(localStorage.getItem('myAccount'))['email']});
        this.setState({userName: JSON.parse(localStorage.getItem('myAccount'))['userName']});
        if(JSON.parse(localStorage.getItem('myAccount'))['phone'] !== null)
        {
            this.setState({phone: JSON.parse(localStorage.getItem('myAccount'))['phone']});
        }
        this.setState({street: JSON.parse(localStorage.getItem('myAccount'))['street']});
        this.setState({number: JSON.parse(localStorage.getItem('myAccount'))['number']});
        this.setState({zipCode: JSON.parse(localStorage.getItem('myAccount'))['zipCode']});
        this.setState({city: JSON.parse(localStorage.getItem('myAccount'))['city']});
    };

    setProfile = () =>
    {
        if(this.state.myUser['profileImg'] !== null)
        {
            this.setState({profileImg: this.state.myUser['profileImg']});
        }
        if(this.state.myUser['profileText'] !== null)
        {
            this.setState({profileText: this.state.myUser['profileText']});
        }
    };

    componentDidMount() {
        let accountId = 'not found';
        if(localStorage.getItem('myAccount')){
            accountId = JSON.parse(localStorage.getItem('myAccount'))['id'];
        }
        let accountType = 'not found';
        if(localStorage.getItem('myAccount')){
            accountType = JSON.parse(localStorage.getItem('myAccount'))['accountType'];
        }

        if(accountId !== 'not found' && accountType !== 'not found')
        {
            this.setAccount();
            if(accountType === 'regular')
            {
                this.loadSporterProfileData(accountId);
                if(this.state.myUser !== null)
                {
                    this.setProfile();
                }

            }
            else if(accountType === 'coach')
            {
                this.loadCoachProfileData(accountId);
                if(this.state.myUser !== null)
                {
                    this.setProfile();
                }
            }
        }

    }

    handleAlertHide = () => this.setState({ alertShow: false });
    handleAlertShow = () => this.setState({ alertShow: true });

    handleEditShow= () => this.setState({ showEdit:  true});
    handleEditHide= () => this.setState({ showEdit:  false});

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    ValidatePassword = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
        let repeatNewPassword = document.getElementById("repeatNewPassword").value;
        let newPassword = document.getElementById("newPassword").value;
        if(newPassword !== repeatNewPassword) {
            document.getElementById("repeatNewPassword").setCustomValidity("Passwords Don't Match");
        }
        else {
            document.getElementById("repeatNewPassword").setCustomValidity('');
        }
    };

    render() {
        if(this.state.myAccount !== null && this.state.myUser !== null)
        {
            return (
                <Container style={{paddingTop: '17vmin'}}>
                    <Row>
                        <Col>
                            <Jumbotron>
                                <Card style={{'padding': '0rem 1rem 1rem 1rem', backgroundColor:'inherit'}} hidden={(!(this.state.showEdit === false && this.state.showProfileEdit === false))} >
                                    <Card.Title style={{paddingLeft:'1rem', paddingRight:'1rem'}} ><h3>Profile of {JSON.parse(localStorage.getItem('myAccount'))['userName']}</h3></Card.Title>
                                    <Row>
                                        <Col style = {{'maxWidth':'30vh', paddingLeft:'2rem', paddingRight:'2rem'}}>
                                            <Card.Img  variant="top" style={{borderRadius: '10%', 'objectFit': 'cover', maxWidth:'15vh', maxHeight:'15vh', width:'15vh', height:'15vh'}} src={(this.state.profileImg)? this.state.profileImg : require("../images/logo.png")} />
                                        </Col>
                                    </Row>
                                    <Card.Body>
                                        <Form >
                                            <Form.Row>
                                                <Col>
                                                    <Form.Group controlId="profileText">
                                                        <Form.Label><h5>About {JSON.parse(localStorage.getItem('myAccount'))['userName']}</h5></Form.Label>
                                                        <Card.Text>
                                                            {(this.state.profileText)? this.state.profileText : 'You still ned to add a profile description.'}
                                                        </Card.Text>
                                                    </Form.Group>
                                                </Col>
                                            </Form.Row>
                                            <hr />
                                            <Form.Row>
                                                <Col >
                                                    <Form.Label><span className="h6">Username:</span> &nbsp; {(this.state.myUser)? this.state.myUser['account']['userName'] : 'userName'}</Form.Label>
                                                </Col>
                                            </Form.Row>
                                            <Form.Row>
                                                <Col>
                                                    <Form.Label><span className="h6">Email:</span> &nbsp; {(this.state.myUser)? this.state.myUser['account']['email'] : 'email'}</Form.Label>
                                                </Col>
                                            </Form.Row>
                                            <Form.Row>
                                                <Col>
                                                    <Form.Label><span className="h6">Telephone:</span> &nbsp; {(this.state.myUser)? ((this.state.myUser['account']['phone'] !== null)? this.state.myUser['account']['phone'] : 'no phone'): 'no phone'}</Form.Label>
                                                </Col>
                                            </Form.Row>
                                            <Form.Row>
                                                <Col>
                                                    <Form.Label><span className="h6">Address:</span> &nbsp;{(this.state.myUser)? this.state.myUser['account']['street'] : 'street'}&nbsp;{(this.state.myUser)? this.state.myUser['account']['number'] : 'number'},&nbsp;{(this.state.myUser)? this.state.myUser['account']['zipCode'] : 'zipcode'}&nbsp;{(this.state.myUser)? this.state.myUser['account']['city'] : 'city'}</Form.Label>
                                                </Col>
                                            </Form.Row>
                                            <br />

                                            <ButtonGroup  className="mt-sm-3">
                                                <Button variant="primary bottom" onClick={() => this.toggleProfileEdit(this.state.showProfileEdit)}>Edit Profile</Button>&nbsp;&nbsp;&nbsp;
                                                <Button variant="info bottom" onClick={this.handleEditShow}>Edit Account</Button>&nbsp;&nbsp;&nbsp;
                                            </ButtonGroup>
                                        </Form>
                                    </Card.Body>
                                </Card>
                                <Card style={{'padding': '0rem 1rem 1rem 1rem', backgroundColor:'inherit'}} hidden={!this.state.showProfileEdit}>
                                    <Card.Title style={{paddingLeft:'1rem', paddingRight:'1rem'}} ><h3>Edit Profile</h3></Card.Title>
                                    <Card.Body>
                                        <Form style={{'maxWidth': '320px'}} noValidate
                                              validated={this.state.validatedProfile}
                                              onSubmit={e => this.handleProfileSubmit(e)}>
                                            <fieldset>
                                                <legend className={"h6 font-weight-bold"}>Profile Details</legend>
                                                <Form.Group controlId="profileImg">
                                                    <Form.Label>Profile Image</Form.Label>
                                                    <Form.Control
                                                        name='profileImg'
                                                        type="url"
                                                        placeholder="Enter an image Url"
                                                        value={this.state.profileImg}
                                                        onChange={e => this.handleChange(e)}/>
                                                    <Form.Control.Feedback type="invalid">The Image Url is invalid</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group controlId="profileText">
                                                    <Form.Label>Profile Text</Form.Label>
                                                    <Form.Control as="textarea" rows="6"
                                                                  name='profileText'
                                                                  value={this.state.profileText}
                                                                  onChange={e => this.handleChange(e)}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Invalid input</Form.Control.Feedback>
                                                </Form.Group>
                                            </fieldset>
                                            <ButtonGroup  className="mt-sm-3">
                                                <Button variant="primary bottom" onClick={() => this.toggleProfileEdit(this.state.showProfileEdit)}>Cancel</Button>&nbsp;&nbsp;&nbsp;
                                                <Button variant="success bottom" type="submit">Submit</Button>&nbsp;&nbsp;&nbsp;
                                            </ButtonGroup>
                                            <br />
                                            <br />
                                            <Alert show={this.state.alertProfileShow} variant="primary" dismissible onClick={this.handleAlertHide}>
                                                {this.state.alertProfileText}
                                            </Alert>
                                        </Form>
                                    </Card.Body>
                                </Card>
                                <Card style={{'padding': '0rem 1rem 1rem 1rem', backgroundColor:'inherit'}} hidden={!this.state.showEdit}>
                                    <Card.Title style={{paddingLeft:'1rem', paddingRight:'1rem'}} ><h3>Edit Account Details</h3></Card.Title>
                                    <Card.Body>
                                        <Form style={{'maxWidth': '320px'}} noValidate
                                        validated={this.state.validated}
                                        onSubmit={e => this.handleSubmit(e)}>
                                        <fieldset>
                                            <legend className={"h6 font-weight-bold"}>Email and Username:</legend>
                                            <Form.Group controlId="email">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    name='email'
                                                    required
                                                    type="email"
                                                    placeholder="Enter email"
                                                    value={this.state.email}
                                                    onChange={e => this.handleChange(e)}/>
                                                <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">You need to provide an email address</Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group controlId="userName">
                                                <Form.Label>Username</Form.Label>
                                                <Form.Control
                                                    pattern=".{2,}" title="Username needs to be 2 or more characters"
                                                    name='userName'
                                                    type="text"
                                                    placeholder="Username"
                                                    required
                                                    value={this.state.userName}
                                                    onChange={e => this.handleChange(e)}/>
                                                <Form.Control.Feedback type="valid">Good choice!</Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">You need to provide a valid user name.</Form.Control.Feedback>
                                            </Form.Group>
                                        </fieldset>
                                        <fieldset>
                                            <legend className={"h6 font-weight-bold"}>Phone:</legend>
                                            <Form.Group controlId="phone">
                                                <Form.Control
                                                    pattern="(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)" title="Phone Number"
                                                    name='phone'
                                                    required
                                                    type="tel"
                                                    placeholder="04826300046"
                                                    value={this.state.phone}
                                                    onChange={e => this.handleChange(e)}/>
                                                <Form.Control.Feedback type="valid">Looks like a valid number!</Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">The phone number seems invalid.</Form.Control.Feedback>
                                            </Form.Group>
                                        </fieldset>
                                        <fieldset>
                                            <legend className={"h6 font-weight-bold"}>Password:</legend>
                                            <Form.Group controlId="newPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                    pattern=".{6,}" title="Password needs to be six or more characters"
                                                    name='newPassword'
                                                    type="password"
                                                    placeholder="Password"
                                                    required
                                                    value={this.state.newPassword}
                                                    onChange={e => this.ValidatePassword(e)}/>
                                                <Form.Control.Feedback type="valid">Password is valid.</Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">The password needs to be at least 6 characters long.</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group controlId="repeatNewPassword">
                                                <Form.Label>Repeat Password</Form.Label>
                                                <Form.Control
                                                    pattern=".{6,}" title="Password needs to be six or more characters"
                                                    name='repeatNewPassword'
                                                    type="password"
                                                    placeholder="Repeat Password"
                                                    required
                                                    value={this.state.repeatNewPassword}
                                                    onChange={e => this.ValidatePassword(e)}/>
                                                <Form.Control.Feedback type="valid">Repeated password is correct.</Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">The repeated password was not correct.</Form.Control.Feedback>
                                            </Form.Group>
                                        </fieldset>
                                        <fieldset>
                                            <legend className={"h6 font-weight-bold"}>Address:</legend>
                                            <Form.Row>
                                                <Form.Group as={Col} className={'col-8'} controlId="street">
                                                    <Form.Label>Street Name</Form.Label>
                                                    <Form.Control name='street' type="text" placeholder="Street Name" required value={this.state.street} onChange={e => this.handleChange(e)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        You need to provide a street.
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group as={Col} className={'col-4'} controlId="number">
                                                    <Form.Label>Number</Form.Label>
                                                    <Form.Control  name='number' type="text" placeholder="Number" required value={this.state.number} onChange={e => this.handleChange(e)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        You need to provide a number.
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Form.Row>

                                            <Form.Row>
                                                <Form.Group as={Col} className={'col-4'} controlId="zipCode">
                                                    <Form.Label>Zip Code</Form.Label>
                                                    <Form.Control  name='zipCode' type="text" placeholder="Zip Code" required value={this.state.zipCode} onChange={e => this.handleChange(e)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        You need to provide a zip code.
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} className={'col-8'} controlId="city">
                                                    <Form.Label>City</Form.Label>
                                                    <Form.Control  name='city' type="text" placeholder="City" required value={this.state.city} onChange={e => this.handleChange(e)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        You need to provide a city or town.
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Form.Row>
                                        </fieldset>
                                        <fieldset style={{paddingBottom: '0.5rem'}}>
                                            <Form.Row>
                                                <Col>
                                                    <small className="text-danger">Warning: You will be logged out when changing the account details...</small>
                                                </Col>
                                            </Form.Row>
                                        </fieldset>
                                        <ButtonGroup  className="mt-sm-3">
                                            <Button variant="info bottom" onClick={this.handleEditHide}>Cancel</Button>&nbsp;&nbsp;&nbsp;
                                            <Button variant="success bottom" type="submit">Submit</Button>&nbsp;&nbsp;&nbsp;
                                        </ButtonGroup>
                                        <br />
                                        <br />
                                        <Alert show={this.state.alertShow} variant="primary" dismissible onClick={this.handleAlertHide}>
                                            {this.state.alertText}
                                        </Alert>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Jumbotron>
                    </Col>
                </Row>
            </Container>
            );
        }
        else
        {
            return (
                <Container style={{paddingTop: '15vh'}}>
                    <Row>
                        <Col>
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                </Container>
            );
        }
    }
}

export default Profile;