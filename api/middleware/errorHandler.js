// middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Something went wrong';

    console.error(err);

    return res.status(statusCode).json({
        success: false,
        error: message
    });
}