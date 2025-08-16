class ApiError extends Error {
  constructor(message = "Something went wrong", statusCode = 400, data = null) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.success = false;
    this.data = data;

    // maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: this.success,
      status: this.statusCode,
      message: this.message,
      data: this.data,
    }
  }
}

module.exports = ApiError;