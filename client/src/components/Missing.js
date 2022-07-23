import React from "react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link, useNavigate } from "react-router-dom";
import Badge from "react-bootstrap/Badge";

const Missing = ({ token }) => {
  let navigate = useNavigate();
  //If user is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const mystyle = {
    margin: "auto",
    width: "40%",
  };
  // Convert base 64 to blob
  const b64toBlob = (dataURI) => {
    var byteString = atob(dataURI.split(",")[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpeg" });
  };
  const [values, setValues] = useState({
    img: null,
  });

  //Form data hooks
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [returned, setReturned] = useState(false);
  const [msg, setMsg] = useState("");
  const [valid, setValid] = useState(false);

  //Send data to missing route
  const handleSubmit = (event) => {
    console.log("hello");
    const data = new FormData();
    data.append("file", values.img);
    const formFieldsData = {
      user_name: values.name,
      email: values.email,
      password: values.password,
    };
    data.append("formFieldsData", JSON.stringify(formFieldsData));
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    for (var key of data.entries()) {
      console.log(key[0] + ", " + key[1]);
    }
    //Check for no image captured
    if (values.img === null) {
      setMsg("No matching record found in the database");
      setReturned(true);
    } else {
      axios
        .post("/api/missing", data, config)
        .then(function (response) {
          console.log("ok");
          const d = response.data;
          setName(d.name);
          setTime(d.missingSince);
          setContact(d.contact);
          setAddress(d.address);
          setReturned(true);
          setValid(true);
        })
        .catch((err) => {
          setMsg("No matching record found in the database");
          setReturned(true);
          console.log("error");
        });
    }
  };

  //Set value of image
  const showImage = () => {
    const image = b64toBlob(webRef.current.getScreenshot());
    setValues({ ...values, img: image });
  };
  const webRef = useRef(null);

  return (
    <Container>
      <h1>
        <Badge bg="danger" style={{ backgroundColor: "pink !important" }}>
          Find Missing Person
        </Badge>
      </h1>
      <br />

      <Row>
        <Col md={6}>
          <Card
            style={{
              backgroundColor: "lightpink",
              color: "purple",
              fontWeight: "bold",
            }}
            className="mb-3"
          >
            <Card.Body>
              <Card.Title>
                For addition of details of a new missing person click below
              </Card.Title>
              <Card.Text>
                <br />
                <br />
                <br />
                <Link to="/AddMissing">
                  <Button variant="danger" size="lg" style={{ color: "white" }}>
                    Add Missing Person
                  </Button>
                </Link>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card
            style={{ backgroundColor: "lightpink", color: "purple" }}
            className="mb-3"
          >
            <Card.Body>
              <Card.Title>Take photo by WebCam</Card.Title>
              <Card.Text>
                <Webcam
                  height={220}
                  ref={webRef}
                  style={{
                    display: "block",
                    margin: "auto",
                    marginBottom: "0.5em",
                  }}
                />
                <Button
                  onClick={() => {
                    showImage();
                  }}
                  variant="danger"
                  style={{ color: "white" }}
                >
                  Capture image from Webcam
                </Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Button
          type="submit"
          style={mystyle}
          variant="danger"
          onClick={handleSubmit}
        >
          {!returned ? <>Fetch Data </> : <>Scroll Down</>}
        </Button>
      </Row>
      <br />
      {/* Display details of missing */}
      <Row>
        {!returned || !valid ? (
          <>
            <div>{msg}</div>
          </>
        ) : (
          <>
            <Card
              className="mb-3"
              style={{ backgroundColor: "lightpink", color: "brown" }}
            >
              <Card.Body>
                <Card.Title variant="contained">
                  Missing Person Details
                </Card.Title>
              </Card.Body>
              <Table striped bordered hover style={{ color: "maroon" }}>
                <tbody>
                  <tr>
                    <td>Name:</td>
                    <td>{name}</td>
                  </tr>
                  <tr>
                    <td>Missing Since:</td>
                    <td>{time}</td>
                  </tr>
                  <tr>
                    <td>Address:</td>
                    <td>{address}</td>
                  </tr>
                  <tr>
                    <td>Contact:</td>
                    <td>{contact}</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
            <br />
            <br />
            <br />
            <br />
            <br />
          </>
        )}
      </Row>
      <br />
      <br />
    </Container>
  );
};

export default Missing;
