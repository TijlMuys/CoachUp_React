import React, { Component } from 'react';
import {Button, Col, Container, Jumbotron, Row, Card, Form} from "react-bootstrap";


class Profile extends Component {

    state = {
        myCoach: null

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
                    this.setState({myCoach: json});

                    console.log(this.state);
                }
            })
            .catch( error => {
                console.log("Error: ", error);
            });
    }

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
                        this.setState({mySporter: json});
                        console.log(this.state);
                    }
                })
                .catch( error => {
                    console.log("Error: ", error);
                });
    }

    renderCoachProfilePage = () => {
        return (
                <Container style={{'paddingTop': '5rem'}}>
                    <Row>
                        <Col>
                            <Card style={{'padding': '3rem 1rem 1rem 1rem'}}>
                                <div style = {{'textAlign': 'center', 'margin': '0 auto'}}>
                                    <Card.Title ><h3>Profile of {JSON.parse(localStorage.getItem('myAccount'))['userName']}</h3></Card.Title>
                                </div>
                                <Row>
                                    <Col style = {{'maxWidth':'50vh', 'margin': '0 auto'}}>
                                        <Card.Img variant="top" style={{'borderRadius':'10%'}} src={(this.state.myCoach)? this.state.myCoach['profileImg'] : '#'} />
                                    </Col>
                                </Row>
                                <Card.Body>
                                    <Form>
                                        <Form.Row>
                                            <Col>
                                                <Form.Group controlId="profileText">
                                                    <Form.Label><h5>About {JSON.parse(localStorage.getItem('myAccount'))['userName']}</h5></Form.Label>
                                                    <Card.Text>
                                                        {(this.state.myCoach)? this.state.myCoach['profileText'] : 'profileText'}
                                                    </Card.Text>
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                        <hr />
                                        <Form.Row>
                                            <Col >
                                                <Form.Label><span className="h6">Username:</span> &nbsp; {(this.state.myCoach)? this.state.myCoach['account']['userName'] : 'userName'}</Form.Label>
                                            </Col>
                                        </Form.Row>
                                        <hr />
                                        <Form.Row>
                                            <Col>
                                                    <Form.Label><span className="h6">Email:</span> &nbsp; {(this.state.myCoach)? this.state.myCoach['account']['email'] : 'email'}</Form.Label>
                                            </Col>
                                        </Form.Row>
                                        <hr />
                                        <Form.Row>
                                            <Col>
                                                <Form.Label><span className="h6">Telephone:</span> &nbsp; {(this.state.myCoach)? ((this.state.myCoach['account']['phone'] !== null)? this.state.myCoach['account']['phone'] : 'no phone'): 'no phone'}</Form.Label>
                                            </Col>
                                        </Form.Row>
                                        <hr />
                                        <h6>Address:</h6>
                                        <Form.Row>
                                            <Col>
                                                <Form.Label>{(this.state.myCoach)? this.state.myCoach['account']['street'] : 'street'}&nbsp;&nbsp;&nbsp;{(this.state.myCoach)? this.state.myCoach['account']['number'] : 'number'}</Form.Label>
                                            </Col>
                                        </Form.Row>
                                        <Form.Row>
                                            <Col>
                                                <Form.Label>{(this.state.myCoach)? this.state.myCoach['account']['zipCode'] : 'zipcode'}&nbsp;&nbsp;&nbsp;{(this.state.myCoach)? this.state.myCoach['account']['city'] : 'city'}</Form.Label>
                                            </Col>
                                        </Form.Row>
                                        <hr />
                                        <Button variant="primary" type="submit">
                                            Submit
                                        </Button>
                                    </Form>
                                    <div className="footer">
                                        <div className="stats"><i></i></div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>

        );
    }

    renderSporterProfilePage = () => {
        return (
            <Container style={{'paddingTop': '5rem'}}>
                <Row>
                    <Col>
                        <Card style={{'padding': '3rem 1rem 1rem 1rem'}}>
                            <div style = {{'textAlign': 'center', 'margin': '0 auto'}}>
                                <Card.Title ><h3>Profile of {JSON.parse(localStorage.getItem('myAccount'))['userName']}</h3></Card.Title>
                            </div>
                            <Row>
                                <Col style = {{'maxWidth':'50vh', 'margin': '0 auto'}}>
                                    <Card.Img variant="top" style={{'borderRadius':'10%'}} src={(this.state.mySporter)? this.state.mySporter['profileImg'] : '#'} />
                                </Col>
                            </Row>
                            <Card.Body>
                                <Form>
                                    <Form.Row>
                                        <Col>
                                            <Form.Group controlId="profileText">
                                                <Form.Label><h5>About {JSON.parse(localStorage.getItem('myAccount'))['userName']}</h5></Form.Label>
                                                <Card.Text>
                                                    {(this.state.mySporter)? this.state.mySporter['profileText'] : 'profileText'}
                                                </Card.Text>
                                            </Form.Group>
                                        </Col>
                                    </Form.Row>
                                    <hr />
                                    <Form.Row>
                                        <Col >
                                            <Form.Label><span className="h6">Username:</span> &nbsp; {(this.state.mySporter)? this.state.mySporter['account']['userName'] : 'userName'}</Form.Label>
                                        </Col>
                                    </Form.Row>
                                    <hr />
                                    <Form.Row>
                                        <Col>
                                            <Form.Label><span className="h6">Email:</span> &nbsp; {(this.state.mySporter)? this.state.mySporter['account']['email'] : 'email'}</Form.Label>
                                        </Col>
                                    </Form.Row>
                                    <hr />
                                    <Form.Row>
                                        <Col>
                                            <Form.Label><span className="h6">Telephone:</span> &nbsp; {(this.state.mySporter)? ((this.state.mySporter['account']['phone'] !== null)? this.state.myCoach['account']['phone'] : 'no phone number'): 'no phone number'}</Form.Label>
                                        </Col>
                                    </Form.Row>
                                    <hr />
                                    <h6>Address:</h6>
                                    <Form.Row>
                                        <Col>
                                            <Form.Label>{(this.state.mySporter)? this.state.mySporter['account']['street'] : 'street'}&nbsp;&nbsp;&nbsp;{(this.state.mySporter)? this.state.mySporter['account']['number'] : 'number'}</Form.Label>
                                        </Col>
                                    </Form.Row>
                                    <Form.Row>
                                        <Col>
                                            <Form.Label>{(this.state.mySporter)? this.state.mySporter['account']['zipCode'] : 'zipcode'}&nbsp;&nbsp;&nbsp;{(this.state.mySporter)? this.state.mySporter['account']['city'] : 'city'}</Form.Label>
                                        </Col>
                                    </Form.Row>
                                    <hr />
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </Form>
                                <div className="footer">
                                    <div className="stats"><i></i></div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    componentDidMount() {
        console.log('componentDidMount');
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
            if(accountType === 'regular')
            {
                this.loadSporterProfileData(accountId);
            }
            else if(accountType === 'coach')
            {
                this.loadCoachProfileData(accountId);
            }
        }
    }

    render() {
        if(localStorage.getItem('myAccount'))
        {
            if(JSON.parse(localStorage.getItem('myAccount'))['accountType'] === 'regular')
            {
                return (
                    <div className="SporterProfile">
                        {this.renderSporterProfilePage()}
                    </div>
                );
            }
            else if(JSON.parse(localStorage.getItem('myAccount'))['accountType'] === 'coach')
            {
                return (
                <div className="CoachProfile">
                    {this.renderCoachProfilePage()}
                </div>
                );
            }
        }
        else
        {
            return (
                <Container style={{paddingTop: '5rem'}}>
                    <Row>
                        <Col>
                            <Jumbotron>
                                <h1>Could not load profile</h1>
                                <p>
                                    This is a simple hero unit, a simple jumbotron-style component for calling
                                    extra attention to featured content or information.
                                </p>
                                <p>
                                    <Button variant="primary">Learn more</Button>
                                </p>
                            </Jumbotron>
                        </Col>
                    </Row>
                </Container>
            );
        }
    }
}

export default Profile;