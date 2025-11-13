import ApiError from '../utils/ApiError.js';

const errorMiddleware = (err, req, res, next) => {
    console.error('--- ERROR CAPTURADO ---');
    console.error(err.message);
    console.error(err.stack);
    console.error('-----------------------');

    let statusCode = 500;
    let message = 'Error interno del servidor.';

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    res.status(statusCode).json({
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorMiddleware;