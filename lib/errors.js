const messages = {
    '400': 'Username and password required for this resource.',
    '401': 'You are not authorized to view this resource.',
    '403': 'Your credentials are invalid for this resource.',
    '404': 'Resource not found. Check your URL and try again.',
    '500': 'Internal Server Error.'
};
module.exports = (res, code, error) => {
    res.status(code).json({ success: false, message: messages[code], error });
}
