const mongoose = require('mongoose')

function validateObjectId(id) {
    if(!id) throw new Error("Id is required ")
    try {
        objectId = new mongoose.Types.ObjectId(id)
        return objectId
    }catch (error) {
        throw error
    }
}


module.exports = {
    validateObjectId
}