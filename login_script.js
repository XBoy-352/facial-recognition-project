const faceapi = require("face-api.js");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
const fs = require("fs");
const sharp = require("sharp");
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
//require tensorflow
const tf = require("@tensorflow/tfjs-node");
const User = require("./model/user.js");

//Load face-api.js models
Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromDisk(process.cwd() + '/faceRecognitionModels'),
    faceapi.nets.faceLandmark68Net.loadFromDisk(process.cwd() + '/faceRecognitionModels'),
    faceapi.nets.tinyYolov2.loadFromDisk(process.cwd() + '/faceRecognitionModels'),
]).then(console.log("models loaded"));

module.exports.recognise_login = async (imageUpload, id, login,email) => {
  var verified = false;
  
  start();
  async function start() {
    var LabeledFaceDescriptors = await add_descriptors();

    var faceMatcher = new faceapi.FaceMatcher(LabeledFaceDescriptors, 0.5);

    //Saving the image by Date to detect face
    var tmpfile = Date.now();

    var image = await sharp(imageUpload.buffer).toFormat("jpeg").toBuffer();
    Promise.all([
      //Save temporarily
      fs.writeFileSync(
        process.cwd() + `/savedImages/tmp_files/${tmpfile}.jpeg`,
        image,
        "buffer",
        function (err) {
        }
      ),
    ]).then(detect_face);

    async function detect_face() {
      delete image;
      var img = await canvas.loadImage(
        process.cwd() + `/savedImages/tmp_files/${tmpfile}.jpeg`
      );

      var detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyYolov2Options())
        .withFaceLandmarks()
        .withFaceDescriptors();
      //Match the current image face with other faces 
      var results = detections.map((d) =>
        faceMatcher.findBestMatch(d.descriptor)
      );

      if (results == []) {
        return;
      }
      for (var i = 0; i < results.length; i++) {
        if (results[i]._label == id) {
          verified = true;
        }
      }
      //Delete temporary file
      fs.unlinkSync(process.cwd() + `/savedImages/tmp_files/${tmpfile}.jpeg`);
      delete faceMatcher;
      delete detections;

      img = null;
      results = null;
      descriptors = null;
      LabeledFaceDescriptors = null;
      return login(verified);
    }
  }

  function add_descriptors() {
    const temp = id.toString();
    const labels = [temp];
    return Promise.all(
      labels.map(async (label) => {
        var descriptions = [];
        const user = await User.findOne({ email });
        const url=user.url
        var img = await canvas.loadImage(
          url
        );
        var detections = await faceapi
          .detectSingleFace(img, new faceapi.TinyYolov2Options())
          .withFaceLandmarks()
          .withFaceDescriptor();
        //Push the descriptions in an array
        if (detections !== undefined) descriptions.push(detections.descriptor);
        var descriptors = new faceapi.LabeledFaceDescriptors(
          label,
          descriptions
        );
        img = null;
        detections = null;
        descriptions = null;
        return descriptors;
      })
    );
  }
};
