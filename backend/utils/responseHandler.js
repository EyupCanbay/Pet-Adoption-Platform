class responseHandler {
    static success({ res, statusCode = 200, message = "Success", data = null }) {
        const response = {
            status: "Success",
            success: true,
            message: message,
            data: data
        }

        res.status(statusCode).json(response)
    }

    static error({ res, statusCode = 500, message = "Error", error = null }) {
        const response = {
            status: "Error",
            success: false,
            message: message,
            error: error
        }

        return res.status(statusCode).json(response)
    }

}



module.exports = responseHandler