const messages = {
    '401': 'You are not authorized to view this resource.',
    '403': 'Sorry, no can do. Your credentials are invalid for this resource.',
    '404': 'We have no idea what you are asking for. Maybe check your URL and try again?'
};
module.exports = (res, error) => {
    res.status(error).json({success: false, message: messages[error]});
}
