import React, {Component} from 'react';
import {Col, ButtonGroup, Alert, Card, Button, Form} from "react-bootstrap";
import Spinner from "react-bootstrap/es/Spinner";

class LessonEntry extends Component {

    constructor(...args) {
        super(...args);
        console.log(this.props);
    }

    state = {
        showEdit: false,
        alertShow: false,
        alertText: "",
        allSports: this.props.allSports,
        lessonCoach: null,
        validated: false,
        sport: this.props.lesson['sport']['sportName'],
        lessonName: this.props.lesson['lessonName'],
        difficulty: this.props.lesson['difficulty'],
        lessonDescription: this.props.lesson['lessonDescription'],
        street: this.props.lesson['lessonLocation']['street'],
        number: this.props.lesson['lessonLocation']['number'],
        zipCode: this.props.lesson['lessonLocation']['zipCode'],
        city: this.props.lesson['lessonLocation']['city']
    };


    loadCoachData = () => {
        fetch("http://localhost:8080/Coaches/"+this.props.lesson['coach_key'], {
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
                    newState['lessonCoach'] = json;
                    this.setState(newState);
                    console.log(this.state);
                    this.forceUpdate();
                }
            })
            .catch( error => {
                console.log("Error: ", error);
            });
    }

    handleDelete = () => {
        fetch("http://localhost:8080/Lessons/"+this.props.lesson['id'], {
            method: "DELETE",
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
                    console.log("DELETED LESSON");
                    this.forceUpdate();
                    window.location.reload();
                }
                if (resp.status === 404 || resp.status === 401 || resp.status === 403 || resp.status === 400) {
                    console.log("error: ", resp.status, resp);
                }
            })
            .catch( error => {
                console.log("Error: ", error);
            });
    }


    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentWillMount() {
        this.loadCoachData();
    }

    handleAlertHide = () => this.setState({ alertShow: false });
    handleAlertShow = () => this.setState({ alertShow: true });

    handleEditShow= () => this.setState({ showEdit:  true});
    handleEditHide= () => this.setState({ showEdit:  false});

    handleSubmit(event) {
        console.log("HandleLessonSubmit");
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else
        {
            event.preventDefault();
            //Update lessonLocation
            fetch("http://localhost:8080/Lessons/update", {
                method: "POST",
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'authToken': window.localStorage.getItem("authToken")
                },
                body: JSON.stringify({
                    "id": this.props.lesson['id'],
                    "lessonName": this.state.lessonName,
                    "lessonDescription": this.state.lessonDescription,
                    "difficulty": this.state.difficulty,
                    "sport": this.state.sport,
                    "locationId": this.props.lesson['lessonLocation']['id'],
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
                        console.log("LOCATIONUPDTESUCCESS!");
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


    render() {
        const { validated } = this.state;
            if(this.state.lessonCoach !== null) {
                return (
                    <div id={this.props.lesson['id']} className="col-md-6 col-lg-4 col-xl-3" style={{marginBottom:"0.5rem"}}>
                        <Card className="card h-100" style={{margin: '0.5rem 0.5rem', 'maxWidth': '40vh'}} hidden={this.state.showEdit}>
                            <Card.Header style={{backgroundColor: "#fff", paddingTop: "1rem"}}>
                                <Card.Subtitle>{this.props.lesson['sport']['sportName']}</Card.Subtitle>
                            </Card.Header>
                            <Card.Img className="card-img-top img-fluid" variant="top" src={this.props.lesson['sport']['imageUrl']} style={{
                                opacity: '0.8',
                                'maxWidth': '40vh',
                                'padding': '1rem 1rem 0rem 1rem',
                                'borderRadius': '7%'
                            }}/>
                            <Card.Body style={{padding: '0.3rem 1rem 0.3rem 1rem'}}>
                                <Card.Title>{this.props.lesson['lessonName']}</Card.Title>
                                <Card.Subtitle style={{paddingBottom: '0.3rem', 'maxWidth': '40vh'}}>{this.state.lessonCoach['account']['userName']}
                                    <div style={{display: 'inline-block', float: 'right', paddingRight: "0.2rem", 'maxWidth': '40vh'}}>
                                        <small style={{color: '#029ACF'}}>Difficulty: {this.props.lesson['difficulty']}/5
                                        </small>
                                    </div>
                                </Card.Subtitle>
                                <Card.Text style={{'maxWidth': '40vh'}}>
                                    {this.props.lesson['lessonDescription']}
                                </Card.Text>
                                <Card.Text>
                                    <small
                                        className="text-muted">Location: {this.props.lesson['lessonLocation']['street']}&nbsp;{this.props.lesson['lessonLocation']['number']},&nbsp;{this.props.lesson['lessonLocation']['zipCode']}&nbsp;{this.props.lesson['lessonLocation']['city']}</small>
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <ButtonGroup size="sm" className="mt-sm-3">
                                <Button variant="info bottom" onClick={this.handleEditShow}>Edit</Button>&nbsp;&nbsp;&nbsp;
                                <Button variant="primary bottom" onClick={this.handleDelete}>Delete</Button>
                                </ButtonGroup>
                            </Card.Footer>
                        </Card>
                        <Form className="h-100"
                            noValidate
                            validated={validated}
                            onSubmit={e => this.handleSubmit(e)} hidden={!this.state.showEdit}>
                            <Card className="card h-100" style={{margin: '0.5rem 0.5rem'}}>
                                <Card.Header style={{backgroundColor: "#fff", paddingTop: "1rem"}}>
                                    <Card.Subtitle>
                                        <span className="h6 text-dark"><b>Sport:&nbsp;</b></span>
                                        <Form.Control as="select" name='sport' required value={this.state.sport}
                                                      onChange={e => this.handleChange(e)}>
                                            {this.state.allSports.map((currentSport, index) => {
                                                return (<option key={index} value={currentSport['sportName']}
                                                                name='sport'>{currentSport['sportName']}</option>);
                                            })}

                                        </Form.Control>
                                    </Card.Subtitle>
                                </Card.Header>
                                <Card.Img variant="top" src={this.props.lesson['sport']['imageUrl']} style={{
                                    opacity: '0.8',
                                    'maxWidth': '40vh',
                                    'padding': '1rem 1rem 0rem 1rem',
                                    'borderRadius': '7%'
                                }}/>
                                <Card.Body style={{padding: '0.5rem 1rem 1rem 1rem'}}>
                                    <Card.Title>
                                        <span className="h6 text-dark"><b>Lesson Name</b></span>
                                        <Form.Control
                                            name='lessonName'
                                            required
                                            type="text"
                                            value={this.state.lessonName}
                                            onChange={e => this.handleChange(e)}
                                        />
                                        <Form.Control.Feedback type="invalid">A lesson name is required.</Form.Control.Feedback>
                                    </Card.Title>
                                    <Card.Subtitle>
                                        <span className="h6 text-dark"><b>Difficulty</b></span>
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
                                    </Card.Subtitle>
                                    <div>
                                        <span className="h6 text-dark"><b>Lesson Description</b></span>
                                        <Form.Control as="textarea" rows="6"
                                            name='lessonDescription'
                                            required
                                            value={this.state.lessonDescription}
                                            onChange={e => this.handleChange(e)}
                                        />
                                        <Form.Control.Feedback type="invalid">A description is required.</Form.Control.Feedback>
                                    </div>
                                        <Form.Row>
                                            <Form.Group as={Col} className={'col'} controlId="street">
                                                <span className="h6 text-dark"><b>Street</b></span>
                                                <Form.Control name='street' type="text" required value={this.state.street} onChange={e => this.handleChange(e)}/>
                                                <Form.Control.Feedback type="invalid">
                                                    You need to provide a street name.
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group as={Col} className={'col'} controlId="number">
                                                <span className="h6 text-dark"><b>Number</b></span>
                                                <Form.Control name='number' type="text" required value={this.state.number} onChange={e => this.handleChange(e)}/>
                                                <Form.Control.Feedback type="invalid">
                                                    You need to provide a number.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} className={'col'} controlId="zipCode">
                                                <span className="h6 text-dark"><b>Zip Code</b></span>
                                                <Form.Control name='zipCode' type="text" required value={this.state.zipCode} onChange={e => this.handleChange(e)}/>
                                                <Form.Control.Feedback type="invalid">
                                                    You need to provide a zip code.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} className={'col'} controlId="city">
                                                <span className="h6 text-dark"><b>City</b></span>
                                                <Form.Control  name='city' type="text"  required value={this.state.city} onChange={e => this.handleChange(e)}/>
                                                <Form.Control.Feedback type="invalid">
                                                    You need to provide a city.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                </Card.Body>
                                <Card.Footer>
                                    <ButtonGroup size="sm" className="mt-sm-3">
                                    <Button variant="info bottom" onClick={this.handleEditHide}>Go Back</Button>&nbsp;&nbsp;&nbsp;
                                    <Button variant="success bottom" type="submit">Save</Button>&nbsp;&nbsp;&nbsp;
                                    <Button variant="primary bottom" onClick={this.handleDelete}>Delete</Button>
                                    </ButtonGroup>
                                    <br /><br />
                                    <Alert show={this.state.alertShow} variant="primary" dismissible onClick={this.handleAlertHide}>

                                        {this.state.alertText}
                                    </Alert>
                                </Card.Footer>
                            </Card>
                        </Form>
                    </div>
                );
            }
            else
            {
                return (
                    <div>
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                        &nbsp;&nbsp;&nbsp;
                    </div>
                );
            }
        }
}


export default LessonEntry;