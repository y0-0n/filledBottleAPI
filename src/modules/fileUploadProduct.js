const multer = require("multer");
const moment = require("moment");

const storage = multer.diskStorage({
  //File 저장 경로
  destination: function (req, file, cb) {
		if(file.fieldname === 'file') {
			cb(null, 'public/product/');
		} else { // file.fieldname === 'file_detail'
			cb(null, 'public/productDetail/');
		}
  },
  //File 저장명
  filename: function (req, file, cb) {
    cb(null, moment().format('YYYYMMDDHHmmss') + "_" + file.originalname);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;