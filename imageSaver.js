const fs = require("fs");
const sharp = require("sharp");
const faceapi = require("face-api.js");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const tf = require("@tensorflow/tfjs-node");
const { cloudinary } = require("./cloudinary.js");


//Load face-api.js models
let url = "";
Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromDisk(process.cwd() + '/faceRecognitionModels'),
    faceapi.nets.faceLandmark68Net.loadFromDisk(process.cwd() + '/faceRecognitionModels'),
    faceapi.nets.tinyYolov2.loadFromDisk(process.cwd() + '/faceRecognitionModels'),
]).then(console.log("models loaded"));

module.exports.imageSaver = async (
  imageUpload,
  type,
  id,
  no_face,
  face_detected
) => {
  let url = "";

  //Save image in server temporarily by id using sharp
  let image = await sharp(imageUpload.buffer).toFormat("jpeg").toBuffer();

  Promise.all([
    fs.writeFileSync(
      process.cwd() + `/savedImages/${type}/${id}.jpeg`,
      image,
      "buffer",
      function (err) {
        console.log("File not created");
      }
    ),
  ]).then(detect_face);
  async function detect_face() {
    image=null;
    var img = await canvas.loadImage(
      process.cwd() + `/savedImages/${type}/${id}.jpeg`
    );
    var detections = await faceapi
      .detectAllFaces(img, new faceapi.TinyYolov2Options())
      .withFaceLandmarks()
      .withFaceDescriptors();

    img = null;
    descriptors = null;
    //No face is detected
    if (detections.length == 0) {
      console.log("undetected");
      detections=null;
      fs.unlinkSync(process.cwd() + `/savedImages/${type}/${id}.jpeg`);
      return no_face();
    } else {
      //Save on cloudinary
      cloudinary.uploader
        .upload("./savedImages/" + type + "/" + id + ".jpeg", {
          resource_type: "image",
        })
        .then((result) => {
          const temp = JSON.stringify(result, null, 2);
          const obj = JSON.parse(temp);
          //save its url
          url = obj.url;
          //Deleting the temporary image from server
          fs.unlinkSync(process.cwd() + `/savedImages/${type}/${id}.jpeg`);
          detections=null;
          return face_detected(url);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
};

