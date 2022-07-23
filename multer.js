const multer = require("multer");

//Storing the image from frontend in server
var store = () => multer.diskStorage({
    destination: function (req, file, cb) {
      if(file.fieldname == 'newMissing')
        cb(null, process.cwd() + `/savedImages`)
    },
    filename: function (req, file, cb) {
        if(file.fieldname == 'newMissing')
            cb(null, file.originalname + ".jpg")
    }
})

exports.upload1 = multer({}).single('file')

