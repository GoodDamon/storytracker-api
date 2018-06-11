module.exports = (req, res, next) => {
    const date = new Date();
    req.requestTime = date;
    console.log(`${date} - ${req.method}: ${req.originalUrl}`)
    next();
}