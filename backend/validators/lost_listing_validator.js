const Enum = require("../config/enum");
const responseHandler = require("../utils/responseHandler");

const validateLostPetListing = (req, res, next) => {
    const requiredPaths = {
        user_id: true,
        category_name: true,
        sub_category_name: true,
        petName: true,
        age: true,
        gender: true,
        description: true,
       // images: true,
        additionalInfo: {
            color: true,
            eyeColor: true,
            furType: true,
            size: true,
            weight: true,
        },
    };

    const missingFields = [];

    const checkFields = (dataPart, requiredPart, parentPath = "") => {
        for (const key in requiredPart) {
            const currentPath = parentPath ? `${parentPath}.${key}` : key;

            if (typeof requiredPart[key] === "object") {
                checkFields(dataPart?.[key], requiredPart[key], currentPath);
            } else if (!dataPart || !(key in dataPart)) {
                missingFields.push(currentPath);
            }
        }
    };

    checkFields(req.body, requiredPaths);

    if (missingFields.length > 0) {
        return responseHandler.error({res, statusCode: Enum.HTTP_CODES.BAD_REQUEST, message: "Some field must be required"})
    }

    next(); 
};


module.exports = {
    validateLostPetListing
} 