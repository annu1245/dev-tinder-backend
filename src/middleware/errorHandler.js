const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Check if error is from ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err);
    }

    // Otherwise handle as generic error
    return res.status(500).json({
        success: false,
        status: 500,
        message: err.message || "Internal Server Error",
        data: null,
    });
};

module.exports = errorHandler;
