import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { useNavigate } from "react-router-dom";

const Criminal = ({ token }) => {
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
  //Convert b64 image to blob
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

  //Hooks for form data
  const [name, setName] = useState("");
  const [crime, setCrime] = useState("");
  const [time, setTime] = useState("");
  const [police, setPolice] = useState("");
  const [returned, setReturned] = useState(false);
  const [msg, setMsg] = useState("");
  const [valid, setValid] = useState(false);

  const handleSubmit2 = (event) => {
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
    console.log(data);
    //If no image was captured
    if (values.img === null) {
      setMsg("No matching record found in the database");
      setReturned(true);
    } else {
      //Post information
      axios
        .post("/api/criminal", data, config)
        .then(function (response) {
          console.log("ok");
          const response_data = response.data;
          //Setting data of hooks
          setName(response_data.name);
          setTime(response_data.wanted_Since);
          setCrime(response_data.crime);
          setPolice(response_data.regional_Police);
          setReturned(true);
          setValid(true);
        })
        .catch((err) => {
          setMsg("No matching record found in the database");
          setReturned(true);
        });
    }
  };

  const showImage = () => {
    const image = b64toBlob(webRef.current.getScreenshot());
    setValues({ ...values, img: image });
  };

  //For image from webcam
  const webRef = useRef(null);

  return (
    <Container>
      <h1>
        <Badge bg="danger">Find Criminal Person</Badge>
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
                For addition of details of a new criminal person click below
              </Card.Title>

              <Card.Text>
                <br />
                <br />
                <br />
                <br />

                <Link to="/AddCriminal">
                  <Button variant="danger" size="lg" style={{ color: "white" }}>
                    Add Criminal Person
                  </Button>
                </Link>
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
            style={{
              backgroundColor: "lightpink",
              color: "purple",
              fontWeight: "bold",
            }}
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
          onClick={handleSubmit2}
        >
          {!returned ? <>Fetch Data </> : <>Scroll Down</>}
        </Button>
      </Row>
      <br />
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
                  Criminal Person Details
                </Card.Title>
              </Card.Body>
              <Table striped bordered hover style={{ color: "maroon" }}>
                <tbody>
                  <tr>
                    <td>Name:</td>
                    <td>{name}</td>
                  </tr>
                  <tr>
                    <td>Crime:</td>
                    <td>{crime}</td>
                  </tr>
                  <tr>
                    <td>Wanted Since:</td>
                    <td>{time}</td>
                  </tr>
                  <tr>
                    <td>Regional Police:</td>
                    <td>{police}</td>
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

export default Criminal;
