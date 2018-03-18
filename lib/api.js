const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const logIn = (user, secret, res) => {
    const data = {
        _id: user._id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
    };
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
        data
    }, secret, (err, result) => {
        if (err) {
            return err;
        }

        res.cookie('token', result);
        res.cookie('data', data);
        return res.status(200).json({ success: true, message: 'Login successful.'});
    });
};

module.exports = (app) => {
    const routes = app.get('routes');
    const { mongoose, User, Story } = app.get('dbInterface');
    const { secret } = app.get('config');

    // Setup logins
    app.post(routes.API_LOGIN, (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required.' });
        }

        User.findOne({ username })
            .then(user => {
                if (password === user.hash) {
                    // This is the first time logging in
                    bcrypt.hash(password, null, null, (err, hash) => {
                        if (err) {
                            return res.status(400).json({ success: false, message: 'Internal server error' });
                        }
                        user.hash = hash;
                        return user.save()
                            .then(() => {
                                return logIn(user, secret, res);
                            });
                    })
                } else {
                    bcrypt.compare(password, user.hash, (err, result) => {
                        if (err) {
                            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
                        }
                        if (result) {
                            return logIn(user, secret, res);
                        }
                        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
                    });
                }
            })
            .catch(err => {
                return res.status(401).json({ success: false, message: 'Invalid username or password.' });
            });
    });

    // Set protected routes
    require('./routes/stories')(app);
    require('./routes/submissions')(app);
    require('./routes/readers')(app);
};
