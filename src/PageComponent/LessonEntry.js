import React, {Component} from 'react';
import {Col, Container, Jumbotron, Row, Alert, Card, Button, Form} from "react-bootstrap";
import Spinner from "react-bootstrap/es/Spinner";

class LessonEntry extends Component {

    constructor(...args) {
        super(...args);
        console.log(this.props);
    }

    state = {
        allSports: this.props.allSports,
        lessonCoach: null,
        lessonName: this.props.lesson['lessonName'],
        sport: this.props.lesson['sport']['sportName']
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


    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentWillMount() {
        this.loadCoachData();
    }


    render() {
        console.log("LESSONCOACH");
        console.log(this.state.lessonCoach);
            if(this.state.lessonCoach !== null) {
                return (
                    <div id={this.props.lesson['id']}>
                        <Card style={{maxWidth: '40vh', margin: '0.5rem 0.5rem'}}>
                            <Card.Header style={{backgroundColor: "#fff", paddingTop: "1rem"}}>
                                <Card.Subtitle>{this.props.lesson['sport']['sportName']}</Card.Subtitle>
                            </Card.Header>
                            <Card.Img variant="top" src={this.props.lesson['sport']['imageUrl']} style={{
                                opacity: '0.8',
                                'maxWidth': '40vh',
                                'padding': '1rem 1rem 0rem 1rem',
                                'borderRadius': '7%'
                            }}/>
                            <Card.Body style={{padding: '0.5rem 1rem 1rem 1rem'}}>
                                <Card.Title>{this.props.lesson['lessonName']}</Card.Title>
                                <Card.Subtitle style={{paddingBottom: '0.3rem'}}>{this.state.lessonCoach['account']['userName']}
                                    <div style={{display: 'inline-block', float: 'right', paddingRight: "0.2rem"}}>
                                        <small style={{color: '#029ACF'}}>Difficulty: {this.props.lesson['difficulty']}/5
                                        </small>
                                    </div>
                                </Card.Subtitle>
                                <Card.Text>
                                    {this.props.lesson['lessonDescription']}
                                </Card.Text>
                                <Card.Text>
                                    <small
                                        className="text-muted">Location: {this.props.lesson['lessonLocation']['street']}&nbsp;{this.props.lesson['lessonLocation']['number']},&nbsp;{this.props.lesson['lessonLocation']['zipCode']}&nbsp;{this.props.lesson['lessonLocation']['city']}</small>
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <Button variant="info bottom">Edit</Button>&nbsp;&nbsp;&nbsp;
                                <Button variant="primary bottom">Delete</Button>
                            </Card.Footer>
                        </Card>
                        <Form>
                            <Card style={{maxWidth: '40vh', margin: '0.5rem 0.5rem'}}>
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
                                        <span className="h6 text-dark"><b>Lesson Name:&nbsp;</b></span>
                                        <Form.Control
                                            name='lessonName'
                                            required
                                            type="text"
                                            value={this.state.lessonName}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Card.Title>
                                    <Card.Subtitle
                                        style={{paddingBottom: '0.3rem'}}>{this.props.lesson['sport']['sportName']}
                                        <div style={{display: 'inline-block', float: 'right', paddingRight: "0.2rem"}}>
                                            <small
                                                style={{color: '#029ACF'}}>Difficulty: {this.props.lesson['difficulty']}/5
                                            </small>
                                        </div>
                                    </Card.Subtitle>
                                    <Card.Text>
                                        {this.props.lesson['lessonDescription']}
                                    </Card.Text>
                                    <Card.Text>
                                        <small className="text-muted">Location: {this.props.lesson['lessonLocation']['street']}&nbsp;{this.props.lesson['lessonLocation']['number']},&nbsp;{this.props.lesson['lessonLocation']['zipCode']}&nbsp;{this.props.lesson['lessonLocation']['city']}</small>
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <Button variant="info bottom">Edit</Button>&nbsp;&nbsp;&nbsp;
                                    <Button variant="primary bottom">Delete</Button>
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