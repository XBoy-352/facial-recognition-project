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

function AddCriminal({ token }) {
  let navigate = useNavigate();
  //if user is not authenticated
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
    crime: "",
    wanted_Since: "",
    regional_Police: "",
  });

  const [msg, setMsg] = useState("");

  const handleName = (event) => {
    setValues({ ...values, name: event.target.value });
  };
  const handleCrime = (event) => {
    setValues({ ...values, crime: event.target.value });
  };

  const handleWanted_Since = (event) => {
    setValues({ ...values, wanted_Since: event.target.value });
  };
  const handleRegional_police = (event) => {
    setValues({ ...values, regional_Police: event.target.value });
  };

  const handleSubmit = (event) => {
    const data = new FormData();
    if (selectedImage === null) {
      setMsg("No image attached");
    } else {
      console.log(selectedImage);
      const imageName = selectedImage.name.split(".");
      const ext = imageName[1];
      //check image is in valid format
      if (
        !(
          ext === "jpeg" ||
          ext === "jpg" ||
          ext === "png" ||
          ext === "webp" ||
          ext === "gif" ||
          ext === "avif" ||
          ext === "jfif" ||
          ext === "tiff" ||
          ext === "svg"
        )
      ) {
        setMsg("Enter an image with a valid format");
        return;
      }
      data.append("file", selectedImage);
      const formFieldsData = {
        name: values.name,
        crime: values.crime,
        wanted_Since: values.wanted_Since,
        regional_Police: values.regional_Police,
      };
      console.log(formFieldsData);
      data.append("formFieldsData", JSON.stringify(formFieldsData));
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
      for (var key of data.entries()) {
        console.log(key[0] + ", " + key[1]);
      }

      //Post information
      axios
        .post("/api/new_criminal", data, config)
        .then(function (response) {
          console.log("ok");
          navigate("/");
        })
        .catch((err) => {
          setMsg("Face not found in image");
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
          <h2 style={headerStyle}>Add criminal person</h2>
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
          onChange={handleCrime}
          fullWidth
          value={values.crime}
          label="Crime"
          placeholder="Enter crime"
          inputProps={{ style: { color: "purple" } }}
        />
        <TextField
          onChange={handleWanted_Since}
          fullWidth
          value={values.wanted_Since}
          label="Wanted Since"
          placeholder="Enter since when the person is wanted"
          inputProps={{ style: { color: "purple" } }}
        />
        <TextField
          onChange={handleRegional_police}
          fullWidth
          value={values.regional_Police}
          label="Regional Police"
          placeholder="Enter regional Police"
          inputProps={{ style: { color: "purple" } }}
        />
        <br />
        <br />
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Choose an Image of wanted person</Form.Label>
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

export default AddCriminal;
