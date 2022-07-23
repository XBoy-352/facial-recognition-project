require("dotenv").config();
require("./database").connect();
const app = require("./app.js");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const path = require("path");
app.use(cookieParser());
app.use(express.json());
const login_script = require("./login_script");
const search_script = require("./search_script");
const imageSaver = require("./imageSaver.js");

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// Logic goes here
const upload = require("./multer.js");
const User = require("./model/user");
const Missing = require("./model/missing");
const Criminal = require("./model/criminal");

if(process.env.NODE_ENV==='production'){
  app.use(express.static('client/build'));
}
app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Register
app.post("/api/register", upload.upload1, async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const data = JSON.parse(req.body.formFieldsData);
    const { user_name, email, password } = data;
    const image = req.file;

    // Validate user input
    if (!(user_name && email && password)) {
      return res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    //Encrypt user password

    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      user_name: user_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      url: "",
    });

    const id = user._id;

    imageSaver.imageSaver(image, "users", id, no_person, person_found);

    // addImage.addImage(img,"users",id);
    async function no_person() {
      await User.deleteOne({ _id: id });
      res.status(401).send("person not found");
    }
   
    async function person_found(uri) {
      try {
        const res = await User.findByIdAndUpdate(id, { url: uri });
      } catch (error) {
        console.log(error);
      }
       // Create token
      const token_key = "abcdefgh";
      const token = jwt.sign({ user_id: user._id, email }, token_key, {
        expiresIn: "2h",
      });
      // save user token
      user.token = token;
      res.status(200).send(user);
    }
  } catch (err) {
    console.log(err);
    res.status(404).send("err");
  }

 

  // Our register logic ends here
});

// ...

// Login
app.post("/api/login", upload.upload1, async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const data = JSON.parse(req.body.formFieldsData);
    const { user_name, email, password } = data;
    const image = req.file;
    
    console.log(image);
    // Validate user input
    const user = await User.findOne({ email });
    if (!(user_name && email && password) ){
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
   
    if (user === null) return res.status(404).send("user doesnot exist");
    
    console.log("user " + user);
    
    const id = user._id;

    console.log(id);

    async function login(ver) {
      console.log("verified3" + ver);
      if (ver && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token_key = "abcdefgh";
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        // save user token
        user.token = token;

        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }

        // user
        return res.status(200).json(user);
      } else res.status(400).send("Invalid Credentials");
    }
    login_script.recognise_login(image, id, login,email);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

//our missing page logic
app.post("/api/missing", upload.upload1, async (req, res) => {
  const img = req.file;
  //Fetch all id's from Missing collection
  const data = await Missing.collection.distinct("_id");
  const ids = [];
  data.map(async (id) => {
    ids.push(id.toString());
  });
  try {
    async function search(verified) {
      if (verified == "person_not_found")
        res.status(401).send("person not found");
      else {
        console.log("success");
        const person = await Missing.findOne({ _id: verified });
        res.status(200).send(person);
      }
    }
    //Function for matching faces
    search_script.search(search, img, ids, "missing");
  } catch {
    res.status(404).send("person not found");
  }
});
app.post("/api/new_missing", upload.upload1, async (req, res) => {

  try {
    // Get user input
    const data = JSON.parse(req.body.formFieldsData);
    const { name, missing_since, address, contact } = data;
    const image = req.file;

    // Create user in our database
    const missing = await Missing.create({
      name: name,
      missingSince: missing_since,
      address: address,
      contact: contact,
      url:"",
    });
    const id = missing._id;
    //Saving image of the user
    imageSaver.imageSaver(image, "missing", id, no_person, person_found);
    async function no_person() {
      await Missing.deleteOne({ _id: id });
      res.status(401).send("person not found");
    }
    async function person_found(uri) {
      console.log("hi"+uri);
      try {
        const res = await Missing.findByIdAndUpdate(id, { url: uri });
      } catch (error) {
        console.log(error);
      }
      res.status(200).send("ok");
    }
  } catch (err) {
    console.log(err);
    res.send("err");
  }
});

app.post("/api/criminal", upload.upload1, async (req, res) => {
  const img = req.file;
 
  //Fetch all id's from Criminal collection
  const data = await Criminal.collection.distinct("_id");
  const ids = [];
  data.map(async (id) => {
    ids.push(id.toString());
  });
  try {
    async function search(verified) {
      console.log(verified);
      if (verified == "person_not_found")
        res.status(401).send("Person not found");
      else {
        const person = await Criminal.findOne({ _id: verified });
        res.status(200).send(person);
      }
    }
    //Function for matching faces
    search_script.search(search, img, ids, "criminal");
  } catch {
    res.status(404).send("person not found");
  }
});

app.post("/api/new_criminal", upload.upload1, async (req, res) => {
  try {
    // Get user input
    const data = JSON.parse(req.body.formFieldsData);
    const { name, crime, wanted_Since, regional_Police } = data;
    const image = req.file;

    // Create user in our database
    const criminal = await Criminal.create({
      name: name,
      crime: crime,
      wanted_Since: wanted_Since,
      regional_Police: regional_Police,
      url:"",
    });
    const id = criminal._id;
    async function func1() {
      await Criminal.deleteOne({ _id: id });
      res.status(401).send("person not found");
    }
    async function func2(uri) {
      try {
        const res = await Criminal.findByIdAndUpdate(id, { url: uri });
      } catch (error) {
        console.log(error);
      }
      res.status(200).send("ok");
    }
    //For saving the images in server
    var url = "";
    imageSaver.imageSaver(image, "criminal", id, func1, func2, url);

    // return new user
  } catch (err) {
    console.log(err);
    res.send("err");
  }
});


app.post("/api/profile", upload.upload1, async (req, res) => {
  try {
    // Get user input
    const data = JSON.parse(req.body.formFieldsData);
    const { email } = data;
    const image = req.file;
    
    const oldUser = await User.findOne({ email });
    const id=oldUser._id;
    imageSaver.imageSaver(image, "users", id, no_person, person_found);

    // addImage.addImage(img,"users",id);
    async function no_person() {
      await User.deleteOne({ _id: id });
      res.status(401).send("person not found");
    }
    async function person_found(uri) {
      console.log("hi" + uri);
      try {
        const res = await User.findByIdAndUpdate(id, { url: uri });
      } catch (error) {
        console.log(error);
      }
      res.status(200).send("done");
    }
  } catch (err) {
    console.log(err);
    res.send("err");
  } 
})



app.post("/welcome", auth, (req, res) => {
  console.log(req);
  res.status(200).send("Welcome 🙌 ");
});

const server = app.listen(PORT || 5000, () => {
  console.log(`App running on port ${PORT}`);
});


