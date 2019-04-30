import React, {Component} from 'react';
import {Col, Container, Jumbotron, Row, Alert, Button, Form} from "react-bootstrap";
import Spinner from "react-bootstrap/es/Spinner";
import LessonEntry from "../PageComponent/LessonEntry";

class Lessons extends Component {

    state = {
        alertShow: false,
        alertText: "",
        validated: false,
        myCoach: null,
        allSports: null,
        sport: "",
        lessonName: "",
        difficulty: 1,
        lessonDescription: "",
        street: "",
        number: "",
        zipCode: "",
        city: ""
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(event) {
        console.log("HandleNewLessonSubmit");
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else
        {
            console.log(this.state);
            event.preventDefault();
            fetch("http://localhost:8080/Lessons/create", {
                method: "POST",
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'authToken': window.localStorage.getItem("authToken")
                },
                body: JSON.stringify({
                    "coachId": this.state.myCoach['id'],
                    "lessonName": this.state.lessonName,
                    "lessonDescription": this.state.lessonDescription,
                    "difficulty": this.state.difficulty,
                    "sport": this.state.sport,
                    "street":this.state.street,
                    "number":this.state.number,
                    "zipCode":this.state.zipCode,
                    "city":this.state.city,
                    "coordinates": null
                })
            })
                .then(resp => {
                    if(resp.ok) {
                        return resp.json();
                    }
                    else if (resp.status === 404 || resp.status === 401 || resp.status === 400) {
                        let newState = {...this.state};
                        newState['alertText'] = "Couldn't update the lesson location, the location was not found in database";
                        this.setState(newState);
                        this.handleAlertShow();
                        console.log("error: ", resp.status, resp);
                    }
                })
                .then( json => {
                    if(json !== undefined) {
                        //this.forceUpdate();
                        console.log(json);
                        console.log("LOCATIONNEWSUCCESS!");
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

        this.setState({ validated: true });
    }

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
                    //set first sport for form
                    this.setState({
                        sport: this.state.allSports[0]['sportName']
                    })
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

    handleAlertHide = () => this.setState({ alertShow: false });
    handleAlertShow = () => this.setState({ alertShow: true });


    render() {
        let accountType = 'not found';
        if(localStorage.getItem('myAccount')){
            accountType = JSON.parse(localStorage.getItem('myAccount'))['accountType'];
        }
        if(accountType !== 'not found' && accountType === 'coach' && this.state.myCoach !== null && this.state.allSports !== null)
        {
            const { validated } = this.state;
            return (
                <Container style={{paddingTop: '15vh'}}>
                    <Row>
                        <Col>
                            <Jumbotron style={{padding: '1rem'}}>
                                <h1 >My Lessons</h1>
                                <p>Edit and add your created lessons below.</p>
                                <Container className="container-fluid content-row" style={{padding: '0rem 0rem'}}>
                                    <Row className="row-eq-height" style={{margin: '0 auto', padding: '0rem 0rem'}}>
                                    {this.state.myCoach['lessons'].map((lesson, index) => {
                                        console.log(lesson);
                                        console.log(this.state);
                                        let key = lesson['id'];
                                        return (<LessonEntry lesson={lesson} key={key} allSports={this.state.allSports} style={{padding: '0rem 0rem'}} />);
                                    })}
                                    </Row>
                                    <hr />
                                    <h3>Create New Lesson</h3>
                                    <Form style={{'maxWidth': '50vh'}} noValidate
                                          validated={validated}
                                          onSubmit={e => this.handleSubmit(e)}>
                                        <fieldset>
                                            <legend className={"h6 font-weight-bold"}>Lesson Details</legend>
                                            <Form.Group controlId="sport">
                                                <Form.Label>Sport</Form.Label>
                                                <Form.Control as="select" name='sport' required value={this.state.sport}
                                                              onChange={e => this.handleChange(e)}>
                                                    {this.state.allSports.map((currentSport, index) => {
                                                        return (<option key={index} value={currentSport['sportName']}
                                                                        name='sport' >{currentSport['sportName']}</option>);
                                                    })}
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId="lessonName">
                                                <Form.Label>Lesson Name</Form.Label>
                                                <Form.Control
                                                    name='lessonName'
                                                    type="text"
                                                    placeholder="Lesson Name"
                                                    required
                                                    value={this.state.lessonName}
                                                    onChange={e => this.handleChange(e)}/>
                                                <Form.Control.Feedback type="invalid">You need to provide a name for the lesson.</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group controlId="lessonDescription">
                                                <Form.Label>Lesson Description</Form.Label>
                                                <Form.Control as="textarea" rows="6"
                                                              name='lessonDescription'
                                                              required
                                                              value={this.state.lessonDescription}
                                                              onChange={e => this.handleChange(e)}
                                                />
                                                <Form.Control.Feedback type="invalid">A description is required.</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group controlId="difficulty">
                                            <Form.Label>Difficulty</Form.Label>
                                                <Form.Control
                                                    name='difficulty'
                                                    required
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    step="1"
                                                    value={this.state.difficulty}
                                                    onChange={e => this.handleChange(e)}
                                                />
                                                <Form.Control.Feedback type="invalid">You need to provide a difficulty</Form.Control.Feedback>
                                        </Form.Group>
                                        </fieldset>
                                        <fieldset>
                                            <legend className={"h6 font-weight-bold"}>Location</legend>
                                            <Form.Row>
                                                <Form.Group as={Col} className={'col'} controlId="RegisterStreet">
                                                    <Form.Label>Street Name</Form.Label>
                                                    <Form.Control name='street' type="text" placeholder="Street Name" required value={this.state.street} onChange={e => this.handleChange(e)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        You need to provide a street.
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group as={Col} className={'col'} controlId="RegisterNumber">
                                                    <Form.Label>Number</Form.Label>
                                                    <Form.Control  name='number' type="text" placeholder="Number" required value={this.state.number} onChange={e => this.handleChange(e)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        You need to provide a number.
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Form.Row>

                                            <Form.Row>
                                                <Form.Group as={Col} className={'col'} controlId="RegisterZip">
                                                    <Form.Label>Zip Code</Form.Label>
                                                    <Form.Control  name='zipCode' type="text" placeholder="Zip Code" required value={this.state.zipCode} onChange={e => this.handleChange(e)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        You need to provide a zip code.
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} className={'col'} controlId="city">
                                                    <Form.Label>City</Form.Label>
                                                    <Form.Control  name='city' type="text" placeholder="City" required value={this.state.city} onChange={e => this.handleChange(e)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        You need to provide a city.
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Form.Row>
                                        </fieldset>

                                        <Button variant="success" block type="submit">
                                            Create
                                        </Button>
                                        <Alert show={this.state.alertShow} variant="primary" dismissible onClick={this.handleAlertHide}>
                                            {this.state.alertText}
                                        </Alert>
                                    </Form>
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