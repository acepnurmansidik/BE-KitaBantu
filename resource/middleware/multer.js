const multer = require("multer");
const path = require("path");
const responseAPI = require("../utils/response");
const { methodConstant } = require("../utils/constanta");
const ENV = require("../utils/config");

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ENV.fileImgPath); // Sesuaikan dengan path direktori tujuan Anda
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        `${Math.random().toString(36).split(".")[1]}${Math.floor(
          Math.random() * 9999999999,
        )}${file.originalname.replace(/\s+/g, "-")}`,
    );
  },
});

const filterImages = (req, file, cb) => {
  if (["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    //reject file
    cb({ message: "Unsupported file format, only jpeg, jpg, png" }, false);
  }
};

const uploadFileConfig = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: filterImages,
});

const uploadMiddlewareFile = (req, res, next) => {
  try {
    uploadFileConfig.array("multFiles", 3)(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        switch (err.code) {
          case "LIMIT_FILE_SIZE":
            responseAPI.MethodResponse({
              res,
              method: methodConstant.BAD_REQUEST,
              message: "File size exceeds the 10MB limit.",
              data: null,
            });
            break;

          case "LIMIT_UNEXPECTED_FILE":
            responseAPI.MethodResponse({
              res,
              method: methodConstant.BAD_REQUEST,
              message: "The maximum file upload limit is only 3",
              data: null,
            });

          default:
            responseAPI.MethodResponse({
              res,
              method: methodConstant.BAD_REQUEST,
              message: "A Multer error occurred during the file upload.",
              data: null,
            });
            break;
        }
      } else if (err) {
        // Error lainnya
        responseAPI.MethodResponse({
          res,
          method: methodConstant.INTERNAL_SERVER_ERROR,
          message: "An error occurred during the file upload.",
          data: null,
        });
      }

      // Jika tidak ada error, lanjutkan ke handler berikutnya
      next();
    });
  } catch (err) {
    next(err);
  }
};

module.exports = uploadMiddlewareFile;
