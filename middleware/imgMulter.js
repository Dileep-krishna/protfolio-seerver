const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Imguploads");
  },
  filename: (req, file, cb) => {
    cb(null, `media-${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "video/mp4",
    "video/mkv",
    "video/webm",
    "video/quicktime"
  ];
//type match files accept
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only images (jpg, jpeg, png) and videos (mp4, mkv, webm, mov) are allowed"),
      false
    );
  }
};

const multerConfig = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 
  }
});

module.exports = multerConfig;