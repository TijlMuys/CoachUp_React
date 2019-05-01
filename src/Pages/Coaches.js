import React, {Component} from 'react';
import {Col, Container, Jumbotron, Row, Navbar, Form, Button} from "react-bootstrap";
import Spinner from "react-bootstrap/es/Spinner";
import CoachEntry from "../PageComponent/CoachEntry";

class Coaches extends Component {

    state = {
        allLessons: null,
        sport: "All Sports",
        allSports: null
    };


    componentWillMount() {

        if(this.state.allLessons === null)
        {
            this.loadAllLessonData();
        }
        if(this.state.allSports === null)
        {
            this.loadAllSports();
        }

    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };


    loadAllLessonData = () => {
        fetch("http://localhost:8080/Lessons", {
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
                    this.setState({allLessons: json});
                    this.forceUpdate();
                }
            })
            .catch( error => {
                console.log("Error: ", error);
            });
    };

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
                    let newState = {...this.state};
                    newState['allSports'] = json;
                    this.setState(newState);
                    //set first sport for form
                    this.setState({
                        sport: this.state.allSports[0]['sportName']
                    });
                    this.forceUpdate();
                }
            })
            .catch( error => {
                console.log("Error: ", error);
            });
    };

    handleSubmit(event) {
        event.preventDefault();
        if(this.state.sport !== "All Sports") {
            fetch("http://localhost:8080/Lessons/search/" + this.state.sport, {
                method: "GET",
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'authToken': window.localStorage.getItem("authToken")
                }
            })
                .then(resp => {
                    if (resp.ok) {
                        return resp.json();
                    }
                    if (resp.status === 404 || resp.status === 401 || resp.status === 403 || resp.status === 400) {
                        console.log("error: ", resp.status, resp);
                    }
                })
                .then(json => {
                    if (json !== undefined) {
                        this.setState({allLessons: json});
                        this.forceUpdate();
                    }
                })
                .catch(error => {
                    console.log("Error: ", error);
                });
        }
        else
        {
            this.loadAllLessonData();
        }
    }

    render() {
        if(this.state.allLessons !== null && this.state.allSports !== null)
        {
            return (
                <Container style={{paddingTop: '17vmin'}}>
                    <Row>
                        <Col>
                            <Jumbotron style={{paddingTop: '1rem'}}>
                                <Navbar style={{backgroundColor: 'inherit', borderStyle:'none', width: 'inherit', padding: '0', margin:'0 auto'}} className="float-right" >
                                    <Form inline style={{width:'inherit'}} onSubmit={e => this.handleSubmit(e)}>
                                        <Form.Control as="select" name='sport' required defaultValue={this.state.sport}
                                                      onChange={e => this.handleChange(e)} style={{maxWidth: '70%'}}>
                                            <option value="All Sports" key="sport">All Sports</option>
                                            {this.state.allSports.map((currentSport, index) => {
                                                return (<option key={index} value={currentSport['sportName']}
                                                                name='sport' >{currentSport['sportName']}</option>);
                                            })}
                                        </Form.Control>&nbsp;&nbsp;
                                        <Button variant = "outline-primary" type="submit" style={{Width: '10%'}}>Filter</Button>
                                    </Form>
                                </Navbar>
                                <br/><br/>
                                <h1>Find Coaching</h1>
                                <hr/>
                                <ul className="list-unstyled">
                                    {this.state.allLessons.map((lesson) => {
                                        let key = lesson['id'];
                                        return (
                                            <div key={key} style={{margin: '0', padding: '0'}}>
                                            <CoachEntry style={{padding: '0rem 0rem'}} myBuddyRequest={lesson} />
                                            <hr />
                                            </div>
                                        );
                                    })}
                                </ul>
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

export default Coaches;