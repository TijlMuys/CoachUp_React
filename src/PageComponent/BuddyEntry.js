import React, {Component} from 'react';
import {Media, Card, Container, Row, Col} from "react-bootstrap";
import Spinner from "react-bootstrap/es/Spinner";

class CoachEntry extends Component {


    state = {
        currentSporter: null,
        myBuddyRequest: this.props.myBuddyRequest,
        showDetails: false
    };


    componentWillMount() {

        if(this.state.currentSporter === null)
        {
            this.loadCurrentCoach();
        }

    }

    toggleDetails = (showDetails) => {
        if(showDetails === true){
            this.setState({ showDetails: false });
        }
        else
        {
            this.setState({ showDetails: true });
        }
    };


    loadCurrentCoach = () => {
        fetch("http://localhost:8080/Sporters/"+ this.state.myBuddyRequest['req_sporter_key'], {
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
                    this.setState({currentSporter: json});
                    this.forceUpdate();
                }
            })
            .catch( error => {
                console.log("Error: ", error);
            });
    };

    render() {

        if(this.state.currentSporter !== null)
        {
            let currentDate = new Date(this.props.myBuddyRequest['meetingDateTime']);
            let formatOptions = {
                hourcycle: 'h23', month: 'long',  day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric'
            };
            let currentDateTimeString = new Intl.DateTimeFormat('en-BE', formatOptions).format(currentDate);
            return (
                <Media as="li" onClick={() => this.toggleDetails(this.state.showDetails)}>
                    <img

                        className="mr-3"
                        src={this.state.myBuddyRequest['sport']['imageUrl']}
                        alt="Generic placeholder"
                        style={{borderRadius: '15%', 'objectFit': 'cover', maxWidth:'64px', maxHeight:'64px', width:'64px', height:'64px'}}
                    />
                    <Media.Body>
                        <Card style={{padding: '0rem 0.5rem 0.5rem 0.5rem', backgroundColor: 'inherit'}}>
                            <Card.Title style={{margin: '0rem 0rem 0.8rem 0rem'}}>{this.state.myBuddyRequest['buddyEntryTitle']}</Card.Title>
                            <Card.Subtitle style={{paddingBottom: '0rem'}}>
                                <div style={{display: 'inline-block', float: 'right', paddingRight: "0.2rem"}}>
                                    <small className="text-info">Difficulty: {this.state.myBuddyRequest['difficulty']}/5
                                    </small>
                                </div>
                                <div className="text-info" style={{padding: "0rem 0rem 0.3rem 0rem"}}>
                                    {this.state.myBuddyRequest['sport']['sportName']}
                                </div>

                                <div style={{padding: "0rem 0rem 0.5rem 0rem"}}>
                                    {this.state.currentSporter['account']['userName']}
                                </div>
                            </Card.Subtitle>
                            <div hidden={!this.state.showDetails}>
                                <Card.Text style={{marginBottom: '0.5rem'}}>
                                    {this.state.myBuddyRequest['buddyEntryDescription']}
                                </Card.Text>
                                <Card.Text>
                                    <small className="text-info"><b>&#9719;&nbsp;</b></small><small className="text-info">{currentDateTimeString}</small><br/>
                                    <small className="text-dark"><b>&#x2709;&nbsp;</b></small><small className="text-dark">{this.state.currentSporter['account']['email']}</small><br/>
                                    <small className="text-dark"><b>&#x260e;&nbsp;</b></small><small className="text-dark">{(this.state.currentSporter['account']['phone'])? this.state.currentSporter['account']['phone'] : 'no phone'}</small><br/>
                                    <small className="text-dark"><b>&#x27a4;&nbsp;</b></small><small className="text-dark">{this.state.currentSporter['account']['street']} {this.state.currentSporter['account']['number']}, {this.state.currentSporter['account']['zipCode']} {this.state.currentSporter['account']['city']}</small><br/>
                                </Card.Text>
                            </div>
                        </Card>
                    </Media.Body>
                </Media>
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

export default CoachEntry;