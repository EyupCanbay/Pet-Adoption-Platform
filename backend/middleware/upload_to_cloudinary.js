const cloudinary = require('../config/cloudinary'); 
const fs = require('fs').promises; 

const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const localFilePath = req.file.path;

    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: 'ilanlar', 
      resource_type: 'image',
    });

    req.cloudinary = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    
    // after successfully upload delete the image
    await fs.unlink(localFilePath);
    
    next();

  } catch (error) {
    console.error('Cloudinary error:', error);
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('did not delete temp folder', unlinkError);
      }
    }
    return res.status(500).json({ message: 'cloudiray error occured uploading the photo ' });
  }
};

module.exports = uploadToCloudinary;