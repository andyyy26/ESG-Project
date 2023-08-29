const { uploadFile } = require('../../middlewares/utils/file-uploader-service');
const { 
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_FILE_SUCCESS,
  GOOGLE_DRIVE_URL
 } = require('../../middlewares/constant/const');

/**
 * Upload image to Google Drive
 * POST
 */
exports.uploadImage = async (req, res) => {
  const image = req.files.image;
  await uploadFile(image)
    .then(data => {
      console.log(data)
      res.status(200).json({
        success: true,
        message: UPLOAD_IMAGE_SUCCESS,
        data: { image_url: GOOGLE_DRIVE_URL + data }
      });
    })
};

/**
 * Upload files to Google Drive
 * POST
 */
 exports.uploadFile = async (req, res) => {
  const file = req.files.file;
  await uploadFile(file)
    .then(data => {
      console.log(data)
      res.status(200).json({
        success: true,
        message: UPLOAD_FILE_SUCCESS,
        data: { image_url: GOOGLE_DRIVE_URL + data },
      });
    })
};

