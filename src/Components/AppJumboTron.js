import React, { Component } from 'react';
import {Container} from 'react-bootstrap'
import {Row} from 'react-bootstrap';
import {Col} from 'react-bootstrap';
import {Jumbotron} from 'react-bootstrap';
import {Button} from 'react-bootstrap';

class AppJumboTron extends Component {
    render() {
        return (
            <Container style={{paddingTop: '1rem'}}>
                <Row>
                    <Col>
                        <Jumbotron>
                            <h1>Hello, world!</h1>
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

export default AppJumboTron;