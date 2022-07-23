import Webcam from "react-webcam";
import React, { useState, useRef } from "react";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setToken }) {
  let navigate = useNavigate();

  //Convert base64 image to blob
  const b64toBlob = (dataURI) => {
    console.log(dataURI);
    var byteString = atob(dataURI.split(",")[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/webp" });
  };

  //Form data hooks
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    img: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [msg, setMsg] = useState("");

  const [valid, setValid] = useState(false);
  const handleName = (event) => {
    setValues({ ...values, name: event.target.value });
  };
  const handleEmail = (event) => {
    setValues({ ...values, email: event.target.value });
  };

  const handlePassword = (event) => {
    setValues({ ...values, password: event.target.value });
  };

  const handleSubmit = (event) => {
    console.log("hello");
    const data = new FormData();
    data.append("file", values.img);
    if (values.img === null) {
      setSubmitted(true);
      setValid(true);
    } else {
      const formFieldsData = {
        user_name: values.name,
        email: values.email,
        password: values.password,
      };
      data.append("formFieldsData", JSON.stringify(formFieldsData));
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
     

      //Fetch information form login route
      axios
        .post("/api/login", data, config)
        .then(function (response) {
          console.log(response);
          localStorage.setItem("token", JSON.stringify(response.data));
          const token = localStorage.getItem("token");
          setToken(JSON.stringify(response.data));
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 400) {
            setMsg("All Inputs are Required!");
          } else{
            setSubmitted(true);
            setValid(true);
          }
          
        });
    }
  };

  const webRef = useRef(null);
  const mystyle = {
    color: "white",
  };

  //Handling state of image
  const handleImage = () => {
    const image = webRef.current.getScreenshot();
    setValues({ ...values, img: b64toBlob(image) });
  };
  const paperStyle = {
    padding: 5,
    width: 400,
    margin: "0 auto",
    backgroundColor: "pink",
    color: "darkmagenta",
  };
  const headerStyle = { margin: 0 };
  const avatarStyle = { backgroundColor: "purple" };
  
  return (
    <Grid style={{ paddingTop: "0.5em" }}>
      <Paper elevation={20} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4">
            Log In
          </Typography>
        </Grid>
        <div>{msg}</div>
        {submitted && valid ? (
          <div>Incorrect Credentials,Please Check Details</div>
        ) : null}
        <Grid item xs={12}>
          <TextField
            fullWidth
            value={values.name}
            name="name"
            label="Name"
            onChange={handleName}
            placeholder="Enter your name"
            type="text"
            id="name"
            autoComplete="Name"
            inputProps={{ style: { color: "purple" } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            onChange={handleEmail}
            value={values.email}
            id="email"
            label="Email Address"
            placeholder="Enter your email"
            name="email"
            autoComplete="email"
            inputProps={{ style: { color: "purple" } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            value={values.password}
            name="password"
            label="Password"
            onChange={handlePassword}
            type="password"
            id="password"
            autoComplete="new-password"
            inputProps={{ style: { color: "purple" } }}
          />
        </Grid>
        <br />
        <Webcam
          height={170}
          ref={webRef}
          style={{ display: "block", margin: "auto" }}
        />
        <Button
          variant="contained"
          width="190"
          size="sm"
          style={{ marginBottom: "0.2em", marginTop: "0.1em" }}
          color="secondary"
          onClick={() => {
            handleImage();
          }}
        >
          Capture Image
        </Button>
        <br />
        <Button
          color="primary"
          type="submit"
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 3, mb: 2 }}
        >
          Log In
        </Button>
      </Paper>
    </Grid>
  );
}

export default Login;
