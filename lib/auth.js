const jwt = require('jsonwebtoken');
const error = require('./errors.js');
const config = require('../config/default.js');
const { secret } = config;

module.exports = (req, res, next) => {
    if (!req.cookies.token) {
        return error(res, '401');
    }

    jwt.verify(req.cookies.token, secret, function(err, decoded) {
        if (err) {
            return error(res, '401');
        }
        req.decoded = decoded;
        next();
    });
}
