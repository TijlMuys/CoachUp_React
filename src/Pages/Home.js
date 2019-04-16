import React, {Component} from 'react';
import {Button, Col, Container, Jumbotron, Row} from "react-bootstrap";

class Home extends Component {
    render() {
        return (
            <Container style={{paddingTop: '5rem'}}>
                <Row>
                    <Col>
                        <Jumbotron>
                            <h1>Home</h1>
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

export default Home;