import * as React from 'react';
import { Col, Container, Row } from 'reactstrap';
import Header from '../components/Header';
import './App.css';
import Survey from './Survey';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Container fluid={true}>
          <Row>
            <Col>
              <Header />
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="intro">Bienvenue sur le sondage de ce TechLabs. Il servira à connaitre votre avancée.</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <Survey />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
