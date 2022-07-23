import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Typography from "@material-ui/core/Typography";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import person from "./images/missing_person.jpg";
import crime from "./images/criminal.png";
import Badge from "react-bootstrap/Badge";
import { useNavigate } from "react-router-dom";

function Menu({ token }) {
  let navigate = useNavigate();

  //If user is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);
  
  return (
    <Container>
      <h1>
        <Badge bg="danger">Facial Investigator</Badge>
      </h1>
      <br />
      <br />
      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Image src={person} height={210} />
            <Card.Body>
              <Card.Title style={{ color: "firebrick" }}>
                Find Details about a Missing Person
              </Card.Title>
              <Card.Text style={{ color: "maroon" }}>
                <Typography>
                  Take a picture of the person.If any record about the missing
                  person is available,All the details will be fetched.
                </Typography>
              </Card.Text>
              <Link to="/Missing">
                <Button variant="danger" size="small">
                  Proceed
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Image src={crime} height={210} />
            <Card.Body>
              <Card.Title style={{ color: "firebrick" }}>
                Find Details about a Criminal
              </Card.Title>
              <Card.Text style={{ color: "maroon" }}>
                <Typography>
                  Take a picture of the suspected person.If any record about the
                  person is available,The details will be displayed on the
                  screen.
                </Typography>
              </Card.Text>
              <Link to="/Criminal">
                <Button variant="danger" size="small">
                  Proceed
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default Menu;
