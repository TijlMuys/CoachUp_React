import React, { Component } from 'react';
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import {Card} from 'react-bootstrap';
import {Container} from 'react-bootstrap';
import {Row} from 'react-bootstrap';
import {Col} from 'react-bootstrap';

class AppLoginForm extends Component {
    render() {
        return (
            <Container style={{paddingTop: '1rem'}}>
                <Row>
                    <Col>
                        <Card style={{padding: '1rem'}}>
                            <Card.Title>Login</Card.Title>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" style={{maxWidth: '12rem'}} />
                                    {/*<Form.Text className="text-muted">
                                        We'll never share your email with anyone else.
                                    </Form.Text>*/}
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" style={{maxWidth: '12rem'}} />
                                </Form.Group>
                                {/*<Form.Group controlId="formBasicChecbox">
                                    <Form.Check type="checkbox" label="Check me out" />
                                </Form.Group>*/}
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default AppLoginForm;