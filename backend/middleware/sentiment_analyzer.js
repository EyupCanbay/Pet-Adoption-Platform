const { spawn } = require('child_process');
const { error } = require('console');
const responseHandler = require('../utils/responseHandler')
const path = require('path');
const Enum = require('../config/enum');


const analyzeSentiment = (text) => {
  return new Promise((resolve, reject) => {
    const pyPath = process.env.PYTHON_URI
    const scriptPath = path.join(__dirname, '../../sensement_analys/predict_sentiment.py');

    const py = spawn(pyPath, [scriptPath, text]);

    let result = '';
    py.stdout.on('data', (data) => {
      result += data.toString();
    });

    py.stderr.on('data', (data) => {
      console.error('Python error:', data.toString());
    });

    py.on('close', (code) => {
      if (code === 0) {
        resolve(parseInt(result));
      } else {
        reject(new Error('Python process exited with code ' + code));
      }
    });
  });
};

const sentimentAnalyzerMiddleware = async (req, res, next) => {
  try {
    if (!req.body || !req.body.content) return next();

    const sentiment = await analyzeSentiment(req.body.content);

    if( sentiment == 1 ) {
      return responseHandler.error({
          res,
          statusCode: Enum.HTTP_CODES.BAD_REQUEST,
          message: "do not share iban",
      });
  }    
  if( sentiment == 0 ) {
    return responseHandler.error({
        res,
        statusCode: Enum.HTTP_CODES.BAD_REQUEST,
        message: "do not talk about money",
    });
}

    next();
  } catch (error) {
    return responseHandler.error({
      res,
      statusCode: Enum.HTTP_CODES.INT_SERVER_ERROR,
      message: "sensiment midleware error",
  });
  }
};

module.exports = { sentimentAnalyzerMiddleware };
