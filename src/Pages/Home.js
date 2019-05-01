import React, {Component} from 'react';
import {Col, Container, Row, Carousel} from "react-bootstrap";

class Home extends Component {

    render() {
        let windowHeight = window.innerHeight-20;
        let windowWidth = window.innerWidth;
        let imageUrl1 = "https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w="+windowWidth+"&h="+windowHeight+"&q=80";
        let imageUrl2 = "https://images.unsplash.com/photo-1529669851596-ba9a5549af95?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&&w="+windowWidth+"&h="+windowHeight+"&q=80";
        let imageUrl3 = "https://images.unsplash.com/photo-1534185468818-f3eba1d779c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&&w="+windowWidth+"&h="+windowHeight+"&q=80";
        let accountType = JSON.parse(localStorage.getItem('myAccount'))['accountType'];
        return (
            <Container style={{paddingTop: '20vmin'}}>
                <Row>
                    <Col>
                        <Carousel>
                            <Carousel.Item>
                                <Carousel.Caption className="align-top align-text-top" style={{top:'0', bottom:'auto'}}>
                                    <h3>CoachUp Home</h3>
                                </Carousel.Caption>
                                <img
                                    className="d-block w-100"
                                    src={imageUrl1}
                                    alt="First slide"
                                />
                                <Carousel.Caption style={{backgroundColor:"rgba(55, 58, 60, 0.4)", borderRadius:"1%"}}>
                                    <h3>Find Coaching</h3>
                                    <p>Find a Coach that fits your goals by looking through our catalog of lesson programs to improve your skills.</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <Carousel.Caption className="align-top align-text-top" style={{top:'0', bottom:'auto'}}>
                                    <h3 className="text-dark">CoachUp Home</h3>
                                </Carousel.Caption>
                                <img
                                    className="d-block w-100"
                                    src={imageUrl2}
                                    alt="Third slide"
                                />
                                <Carousel.Caption style={{backgroundColor:"rgba(83, 83, 83, 0.4)", borderRadius:"1%"}}>
                                    <h3 className="text-dark">Find Buddies</h3>
                                    <p className="text-dark">Need a partner to practice with? You can find a practice buddy by answering to other people's buddy requests.</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <Carousel.Caption className="align-top align-text-top" style={{top:'0', bottom:'auto'}}>
                                    <h3>CoachUp Home</h3>
                                </Carousel.Caption>
                                <img
                                    className="d-block w-100"
                                    src={imageUrl3}
                                    alt="Third slide"
                                />
                                <Carousel.Caption style={{backgroundColor:"rgba(55, 58, 60, 0.4)", borderRadius:"1%"}}>
                                    {(accountType === 'regular')?  <div><h3>Request Buddy</h3><p>Can't find the right buddy in the list of requests? Make your own request for other people to find!</p></div> : null}
                                    {(accountType === 'coach')?  <div><h3>Lessons</h3><p>Manage the lessons you want to advertise on the CoachUp platform with our Lesson manager.</p></div> : null}
                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>
                    </Col>
                </Row>
            </Container>

        );
    }
}

export default Home;