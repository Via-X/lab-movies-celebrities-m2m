const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

var storage01 = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'medialib01',       
  allowedFormats: ['jpg','png'],
  filename: function(req, file, cb){
    cb(null, file.originalname);            
  }

});

const uploadCloud = multer({storage: storage01});

module.exports = uploadCloud;