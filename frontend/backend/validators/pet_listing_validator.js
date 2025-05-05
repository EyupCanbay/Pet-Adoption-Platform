const Enum = require("../config/enum");
const responseHandler = require("../utils/responseHandler");

const validatePetListing = (req, res, next) => {
    const requiredPaths = {
        user_id: true,
        category_name: true,
        sub_category_name: true,
        petName: true,
        age: true,
        gender: true,
        description: true,
        images: true,
        status: true,
        additionalInfo: {
            color: true,
            eyeColor: true,
            furType: true,
            size: true,
            weight: true,
            vaccinated: false, // Default value exists in schema
            neutered: false, // Default value exists in schema
            trainability: true,
            playfulness: true,
            sociality: true
        }
    };

    const missingFields = [];

    const checkFields = (dataPart, requiredPart, parentPath = "") => {
        for (const key in requiredPart) {
            const currentPath = parentPath ? `${parentPath}.${key}` : key;

            if (typeof requiredPart[key] === "object") {
                checkFields(dataPart?.[key], requiredPart[key], currentPath);
            } else if (requiredPart[key] && (!dataPart || !(key in dataPart))) {
                missingFields.push(currentPath);
            }
        }
    };

    checkFields(req.body, requiredPaths);

    if (missingFields.length > 0) {
        return responseHandler.error({
            res,
            statusCode: Enum.HTTP_CODES.BAD_REQUEST,
            message: "Some required fields are missing",
            error: { missingFields }
        });
    }

    next(); 
};

module.exports = {
    validatePetListing
};