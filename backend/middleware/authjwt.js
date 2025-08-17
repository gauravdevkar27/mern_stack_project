const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    // The standard format is "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).send({ message: 'Authentication Failed! No token provided.' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).send({ message: 'Token is not valid! Please Login again!' });
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
