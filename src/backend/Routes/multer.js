const multer = require("multer");
const multerDir= "images"
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};
 module.exports.store_image = multer.diskStorage({
    destination: (req, file, cb) => {
      // checking the mime type
      const isvalid= MIME_TYPE_MAP[file.mimetype];
      let error=new Error("Invalid mime TYPE");
      if(isvalid){
      error=null;
      }
      cb(error, multerDir);
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      const ext=MIME_TYPE_MAP[file.mimetype];
      cb(null, fileName+'-'+Date.now()+"."+ext);
    }
  }
);

