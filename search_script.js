const faceapi = require('face-api.js')
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
const fs = require("fs")
const sharp = require('sharp');
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })
const tf = require("@tensorflow/tfjs-node")
const Missing = require("./model/missing");
const Criminal = require("./model/criminal");
console.log(tf.version)

//Load face-api.js models
Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromDisk(process.cwd() + '/faceRecognitionModels'),
    faceapi.nets.faceLandmark68Net.loadFromDisk(process.cwd() + '/faceRecognitionModels'),
    faceapi.nets.tinyYolov2.loadFromDisk(process.cwd() + '/faceRecognitionModels'),
]).then(console.log("models loaded"))

module.exports.search = async (search1, imageUpload, ids, type) => {
    var verified = false
    start()
    async function start() {
        var LabeledFaceDescriptors = await add_descriptors()
        var faceMatcher = new faceapi.FaceMatcher(LabeledFaceDescriptors, 0.5)

        const tmpfile = Date.now();
        
        //Convert image to jpeg format
        var image = await sharp(imageUpload.buffer).toFormat('jpeg').toBuffer();
        Promise.all([
            fs.writeFileSync(process.cwd() + `/savedImages/tmp_files/${tmpfile}.jpeg`, image, "buffer", function (err) {
                console.log('File created');
            })
        ]).then(detect_face)

        async function detect_face() {
            delete image;
            //Save an image temporarily to detect face
            var img = await canvas.loadImage(process.cwd() + `/savedImages/tmp_files/${tmpfile}.jpeg`)

            var detections = await faceapi.detectAllFaces(img, new faceapi.TinyYolov2Options()).withFaceLandmarks().withFaceDescriptors()
            var results = detections.map(d => faceMatcher.findBestMatch(d.descriptor))
            
            if (results == []) {
                return;
            }
            for (var i = 0; i < results.length; i++) {
                if (results[i]._label != "unknown") {
                    verified = results[i]._label;
                }
            }
            //Delete the temporary image from server
            fs.unlinkSync(process.cwd() + `/savedImages/tmp_files/${tmpfile}.jpeg`);
            delete faceMatcher;
            delete detections;
            
            img = null;
            results = null;
            descriptors = null;
            LabeledFaceDescriptors = null;
            if(verified)
                return search1(verified);
            else
                return search1("person_not_found")
        }
    }

    //Push detections of all existing images in an array
    function add_descriptors() {
        const labels = ids;
        return Promise.all(
            labels.map(async label => {
                var descriptions = []
                let person;
                if(type=="missing"){
                  person=await Missing.findOne({_id:label});
                }else{
                  person=await Criminal.findOne({_id:label});
                }
                const url=person.url
                var img = await canvas.loadImage(
                  url
                );
                var img = await canvas.loadImage(url);
                
                var detections = await faceapi.detectSingleFace(img, new faceapi.TinyYolov2Options()).withFaceLandmarks().withFaceDescriptor()
                if(detections !== undefined)
                descriptions.push(detections.descriptor)
                var descriptors = new faceapi.LabeledFaceDescriptors(label, descriptions)
                img = null;
                detections = null;
                descriptions = null;
                return descriptors;
            })
        )
    }
}





