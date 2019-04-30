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
        buddyRequestSporter: null,
        validated: false,
        sport: this.props.buddyRequest['sport']['sportName'],
        buddyEntryTitle: this.props.buddyRequest['buddyEntryTitle'],
        difficulty: this.props.buddyRequest['difficulty'],
        buddyEntryDescription: this.props.buddyRequest['buddyEntryDescription'],
        meetingDateTime: JSON.stringify(new Date(this.props.buddyRequest['meetingDateTime'])).slice(1, 17),
        meetingDateTimeString: "",
        street: this.props.buddyRequest['buddyLocation']['street'],
        number: this.props.buddyRequest['buddyLocation']['number'],
        zipCode: this.props.buddyRequest['buddyLocation']['zipCode'],
        city: this.props.buddyRequest['buddyLocation']['city']
    };


    loadSporterData = () => {
        fetch("http://localhost:8080/Sporters/"+this.props.buddyRequest['req_sporter_key'], {
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
                    newState['buddyRequestSporter'] = json;
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
        fetch("http://localhost:8080/BuddyEntries/"+this.props.buddyRequest['id'], {
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
                    console.log("DELETED BUDDY REQUEST");
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

    handleDateChange = (e) => {
        console.log("DATECHANGE");
        console.log(e.target.value);
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentWillMount() {
        this.loadSporterData();
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
            //Update buddyLocation
            fetch("http://localhost:8080/BuddyEntries/update", {
                method: "POST",
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'authToken': window.localStorage.getItem("authToken")
                },
                body: JSON.stringify({
                    "id": this.props.buddyRequest['id'],
                    "buddyEntryTitle": this.state.buddyEntryTitle,
                    "buddyEntryDescription": this.state.buddyEntryDescription,
                    "difficulty": this.state.difficulty,
                    "meetingDateTime": this.state.meetingDateTime,
                    "sport": this.state.sport,
                    "locationId": this.props.buddyRequest['buddyLocation']['id'],
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
                        newState['alertText'] = "Couldn't update the buddyRequest location, the location was not found in database";
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
            if(this.state.buddyRequestSporter !== null) {
                let currentDate = new Date(this.props.buddyRequest['meetingDateTime']);
                let formatOptions = {
                    hourcycle: 'h23', month: 'long',  day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric'
                };
                let currentDateTimeString = new Intl.DateTimeFormat('en-BE', formatOptions).format(currentDate);
                console.log("RECIEVED DATE");
                console.log(this.state.meetingDateTime);
                console.log(currentDateTimeString);
                return (
                    <div id={this.props.buddyRequest['id']} className="col-md-6 col-lg-4 col-xl-3" style={{marginBottom:"0.5rem"}}>
                        <Card className="card h-100" style={{margin: '0.5rem 0.5rem', 'maxWidth': '40vh'}} hidden={this.state.showEdit}>
                            <Card.Header style={{backgroundColor: "#fff", paddingTop: "1rem"}}>
                                <Card.Subtitle>{this.props.buddyRequest['sport']['sportName']}</Card.Subtitle>
                            </Card.Header>
                            <Card.Img className="card-img-top img-fluid" variant="top" src={this.props.buddyRequest['sport']['imageUrl']} style={{
                                opacity: '0.8',
                                'maxWidth': '40vh',
                                'padding': '1rem 1rem 0rem 1rem',
                                'borderRadius': '7%'
                            }}/>
                            <Card.Body style={{padding: '0.3rem 1rem 0.3rem 1rem'}}>
                                <Card.Title>{this.props.buddyRequest['buddyEntryTitle']}</Card.Title>
                                <Card.Subtitle style={{paddingBottom: '0.3rem', 'maxWidth': '40vh'}}>{this.state.buddyRequestSporter['account']['userName']}
                                    <div style={{display: 'inline-block', float: 'right', paddingRight: "0.2rem", 'maxWidth': '40vh'}}>
                                        <small style={{color: '#029ACF'}}>Difficulty: {this.props.buddyRequest['difficulty']}/5
                                        </small>
                                    </div>
                                </Card.Subtitle>
                                <Card.Text style={{'maxWidth': '40vh'}}>
                                    {this.props.buddyRequest['buddyEntryDescription']}
                                </Card.Text>
                                <Card.Text>
                                    <small className="text-info">&#9719;&nbsp;{currentDateTimeString}</small>
                                    <br/>
                                    <small className="text-muted">&#x27a4;&nbsp;{this.props.buddyRequest['buddyLocation']['street']}&nbsp;{this.props.buddyRequest['buddyLocation']['number']},&nbsp;{this.props.buddyRequest['buddyLocation']['zipCode']}&nbsp;{this.props.buddyRequest['buddyLocation']['city']}</small>
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
                                <Card.Img variant="top" src={this.props.buddyRequest['sport']['imageUrl']} style={{
                                    opacity: '0.8',
                                    'maxWidth': '40vh',
                                    'padding': '1rem 1rem 0rem 1rem',
                                    'borderRadius': '7%'
                                }}/>
                                <Card.Body style={{padding: '0.5rem 1rem 1rem 1rem'}}>
                                    <Card.Title>
                                        <span className="h6 text-dark"><b>Lesson Name</b></span>
                                        <Form.Control
                                            name='buddyEntryTitle'
                                            required
                                            type="text"
                                            value={this.state.buddyEntryTitle}
                                            onChange={e => this.handleChange(e)}
                                        />
                                        <Form.Control.Feedback type="invalid">A buddyRequest name is required.</Form.Control.Feedback>
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
                                            name='buddyEntryDescription'
                                            required
                                            value={this.state.buddyEntryDescription}
                                            onChange={e => this.handleChange(e)}
                                        />
                                        <Form.Control.Feedback type="invalid">A description is required.</Form.Control.Feedback>
                                    </div>
                                    <Form.Group controlId="meetingDateTime">
                                        <span className="h6 text-dark"><b>Meeting Time</b></span>
                                        <Form.Control
                                            name='meetingDateTime'
                                            type="datetime-local"
                                            required
                                            value={this.state.meetingDateTime}
                                            onChange={e => this.handleDateChange(e)}
                                            onBlur={e => this.handleDateChange(e)}/>
                                        <Form.Control.Feedback type="invalid">You need to provide a time to meet.</Form.Control.Feedback>
                                    </Form.Group>
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