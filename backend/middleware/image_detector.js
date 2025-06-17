const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const imageValidator = (req, res, next) => {
  if (!req.file) {
    return next(); // keep going if not found image
  }

  const imagePath = req.file.path;
  const pythonScriptPath = path.join(__dirname, '..', 'image_detector', 'detect.py'); 

  const pythonProcess = spawn('python', [pythonScriptPath, imagePath]); 

  let resultData = '';
  let errorData = '';

  pythonProcess.stdout.on('data', (data) => {
    resultData += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorData += data.toString();
    console.error(`python error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    // for deleting temp image folder
    const cleanup = () => {
      fs.unlink(imagePath, (err) => {
        if (err) console.error(`do not delete image: ${imagePath}`, err);
      });
    };

    if (errorData) {
      cleanup();
      return res.status(500).json({ message: 'an error occurred during image verification' });
    }

    const result = parseInt(resultData.trim(), 10);

    if (result === 1) {

      next(); 
    } else {
      // result -1 or 0: do not allow.

      cleanup(); 
      if (result === -1) {
        return res.status(400).json({ message: 'detecting invalid frame' });
      } else {
        return res.status(400).json({ message: 'do not found animal in frame' });
      }
    }
  });
};

module.exports = imageValidator;