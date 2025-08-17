const errorHandler = (err, req, res, next) => {
    // Log the error for the developer
    console.error(err.stack);

    // Use the status code from the error if it exists, otherwise default to 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;