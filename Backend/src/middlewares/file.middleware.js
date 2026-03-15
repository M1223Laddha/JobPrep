const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(), // where we have to save the file
  limits: {
    fileSize: 3 * 1024 * 1024, // Maximum allowed PDF size => 3mb
  },
});

module.exports = upload;
