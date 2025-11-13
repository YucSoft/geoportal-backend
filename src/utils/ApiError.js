class ApiError extends Error {
    constructor(statusCode, message = 'Algo salió mal') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;