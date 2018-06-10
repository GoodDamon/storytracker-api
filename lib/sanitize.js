module.exports = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (/^\$/.test(req.body[key])) {
              delete req.body[key];
            }
        });
    }
    next();
}
