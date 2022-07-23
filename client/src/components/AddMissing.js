import { useEffect } from "react";
import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";

function AddMissing({ token }) {
  let navigate = useNavigate();
  //If user is not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  //Hook for image to be sent to server
  const [selectedImage, setSelectedImage] = useState(null);

  //Form data
  const [values, setValues] = useState({
    name: "",
    missing_since: "",
    contact: "",
    address: "",
  });

  const [msg, setMsg] = useState("");
  const handleName = (event) => {
    setValues({ ...values, name: event.target.value });
  };
  const handleTime = (event) => {
    setValues({ ...values, missing_since: event.target.value });
  };

  const handleContact = (event) => {
    setValues({ ...values, contact: event.target.value });
  };
  const handleAddress = (event) => {
    setValues({ ...values, address: event.target.value });
  };

  const handleSubmit = (event) => {
    const data = new FormData();

    console.log("hi");
    if (selectedImage === null) {
      setMsg("No image attached");
    } else {
      const imageName = selectedImage.name.split(".");
      const ext = imageName[1];
      //check image is in valid format
      if (
        !(
          ext == "jpeg" ||
          ext == "jpg" ||
          ext == "png" ||
          ext == "webp" ||
          ext == "gif" ||
          ext == "avif" ||
          ext == "tiff" ||
          ext == "jfif" ||
          ext == "svg"
        )
      ) {
        setMsg("Enter an image with a valid format");
        return;
      }
      data.append("file", selectedImage);
      const formFieldsData = {
        name: values.name,
        missing_since: values.missing_since,
        contact: values.contact,
        address: values.address,
      };

      data.append("formFieldsData", JSON.stringify(formFieldsData));
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
      for (var key of data.entries()) {
        console.log(key[0] + ", " + key[1]);
      }

      //Post form data
      axios
        .post("/api/new_missing", data, config)
        .then(function (response) {
          console.log("ok");
          navigate("/");
        })
        .catch((err) => {
          setMsg("Face not found in image");
          console.log(err);
        });
    }
  };

  const paperStyle = {
    padding: 20,
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
            <AddCircleOutlineOutlinedIcon />
          </Avatar>
          <h2 style={headerStyle}>Add missing person</h2>
        </Grid>

        <div>{msg}</div>
        <TextField
          onChange={handleName}
          fullWidth
          value={values.name}
          label="Name"
          placeholder="Enter name"
          inputProps={{ style: { color: "purple" } }}
        />
        <TextField
          onChange={handleTime}
          fullWidth
          value={values.missing_since}
          label="Missing Since"
          placeholder="Enter since when the person is missing"
          inputProps={{ style: { color: "purple" } }}
        />
        <TextField
          onChange={handleContact}
          fullWidth
          value={values.contact}
          label="Contact"
          placeholder="Enter contact"
          inputProps={{ style: { color: "purple" } }}
        />
        <TextField
          onChange={handleAddress}
          fullWidth
          value={values.address}
          label="Address"
          placeholder="Enter address"
          inputProps={{ style: { color: "purple" } }}
        />
        <br />
        <br />
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Choose an Image of missing person</Form.Label>
          <Form.Control
            onChange={(event) => {
              console.log(event.target.files[0]);
              setSelectedImage(event.target.files[0]);
            }}
            type="file"
          />
        </Form.Group>
        <br />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Paper>
    </Grid>
  );
}
export default AddMissing;
