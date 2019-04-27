import React, {Component} from 'react';
import {Button, Col, Container, Jumbotron, Row, Alert} from "react-bootstrap";

class BuddyRequest extends Component {
    render() {
        if(true)
        {
            return (
                <Container style={{paddingTop: '15vh'}}>
                    <Row>
                        <Col>
                            <Jumbotron>
                                <h1>Lessons</h1>
                                <p>
                                    Create and manage lessons
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
        else
        {
            return (
                <Container style={{paddingTop: '15vh'}}>
                    <Row>
                        <Col>
                            <Alert variant="danger" show='true'>
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

export default BuddyRequest;