import React from "react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";

const Profile = ({ token }) => {
  let navigate = useNavigate();
  //If user is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const [msg, setMsg] = useState("");

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

  //Hook for image
  const [values2, setValues2] = useState({
    img: null,
  });

  const webRef = useRef(null);

  const showImage = () => {
    const image = b64toBlob(webRef.current.getScreenshot());
    setValues2({ ...values2, img: image });
  };


  const handleSubmit2 = (event) => {
    const data = new FormData();
    data.append("file", values2.img);
    const formFieldsData = {
      email: user.email,
    };
    //Check for null image
    if (values2.img === null) {
      setMsg("No face detected");
    } else {
      data.append("formFieldsData", JSON.stringify(formFieldsData));
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };

      //Post new image 
      axios
        .post("/api/profile", data, config)
        .then(function (response) {
          console.log("ok");
          //Setting data of hooks
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
          setMsg("No face detected");
        });
    }
  };
  const user = JSON.parse(token);

  return (
    <Container>
      <br />
      <Row>
        <Card
          className="mb-3"
          style={{ backgroundColor: "lightpink", color: "brown" }}
        >
          <Card.Body>
            <h2>User Details</h2>
          </Card.Body>
          <div>{msg}</div>
          <Table striped bordered hover style={{ color: "maroon" }}>
            <tbody>
              <tr style={{ color: "red" }}>
                <td style={{ color: "maroon" }}>Name:</td>
                <td style={{ color: "maroon" }}>{user.user_name}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{user.email}</td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </Row>
      <Row>
        <Card
          className="mb-3"
          style={{
            backgroundColor: "lightpink",
            margin: "auto",
            marginTop: "-2em",
            color: "purple",
            fontWeight: "bold",
          }}
        >
          <Card.Body style={{ margin: "auto" }}>
            <Card.Text>
              <Webcam height={220} ref={webRef} style={{ display: "block" }} />
              <Button
                onClick={() => {
                  showImage();
                }}
                variant="danger"
                style={{ color: "white" }}
              >
                Capture Image
              </Button>
            </Card.Text>
          </Card.Body>
        </Card>
      </Row>
      <Button type="submit" onClick={handleSubmit2} variant="danger" size="lg">
        Edit Image{" "}
      </Button>
    </Container>
  );
};

export default Profile;
