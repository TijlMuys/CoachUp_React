import React, {Component} from 'react';
import {Col, Container, Jumbotron, Row, Alert, Card, Button} from "react-bootstrap";
import Spinner from "react-bootstrap/es/Spinner";
import LessonEntry from "../PageComponent/LessonEntry";

class Lessons extends Component {


    state = {
        myCoach: null,
        allSports: null
    };

    componentWillMount() {

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
            if(accountType === 'coach')
            {
                this.loadCoachProfileData(accountId);
                this.loadAllSports();
            }
        }
    }

    loadAllSports = () => {
        fetch("http://localhost:8080/Sports", {
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
                    console.log(json);
                    let newState = {...this.state};
                    newState['allSports'] = json;
                    this.setState(newState);
                    console.log(this.state);
                    this.forceUpdate();
                }
            })
            .catch( error => {
                console.log("Error: ", error);
            });
    }


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
                    this.forceUpdate();
                }
            })
            .catch( error => {
                console.log("Error: ", error);
            });
    }


    render() {
        let accountType = 'not found';
        if(localStorage.getItem('myAccount')){
            accountType = JSON.parse(localStorage.getItem('myAccount'))['accountType'];
        }
        if(accountType !== 'not found' && accountType === 'coach' && this.state.myCoach !== null && this.state.allSports !== null)
        {
            return (
                <Container style={{paddingTop: '15vh'}}>
                    <Row>
                        <Col>
                            <Jumbotron style={{paddingTop: '1rem'}}>
                                <h1 style={{paddingLeft: '1.5rem'}}>My Lessons</h1>
                                <p style={{paddingLeft: '1.5rem'}}>Edit and add your created lessons below.</p>
                                <Container >
                                    <Row style={{margin: '0 auto'}}>
                                    {this.state.myCoach['lessons'].map((lesson, index) => {
                                        console.log(lesson);
                                        console.log(this.state);
                                        return (<LessonEntry lesson={lesson} key={index} allSports={this.state.allSports} />);
                                    })}
                                    </Row>
                                    <hr />
                                    <h3 style={{paddingLeft: '0.5rem'}}>Create New Lesson</h3>

                                </Container>
                            </Jumbotron>
                        </Col>
                    </Row>
                </Container>
            );
        }
        else if(accountType !== 'not found' && accountType === 'coach' && (this.state.myCoach === null || this.state.allSports === null))
        {
            console.log("LOADING");
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
        else
        {
            return (
                <Container style={{paddingTop: '15vh'}}>
                    <Row>
                        <Col>
                            <Alert variant="danger" show={true}>
                                <Alert.Heading>You are not Authorized to view this page</Alert.Heading>
                                <p>
                                    Please log in as a coach in order to view this page.
                                </p>
                            </Alert>
                        </Col>
                    </Row>
                </Container>
            );
        }

    }
}

export default Lessons;