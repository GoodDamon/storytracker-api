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
            return res.status(500).json({ success: false, message: 'Internal server error.'});
        }

        res.cookie('token', result);
        res.cookie('username', data.username);
        res.cookie('first_name', data.first_name);
        res.cookie('last_name', data.last_name);
        res.cookie('email', data.email);
        return res.status(200).json({ success: true, message: 'Login successful.'});
    });
};

module.exports = (app) => {
    const routes = app.get('routes');
    const { mongoose, User, Story } = app.get('dbInterface');
    const { secret } = app.get('config');

    // Setup login and signup
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
                    });
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

    app.post(routes.API_SIGNUP_TEST, (req, res) => {
        const { username, email } = req.body;

        const promises = [];

        promises.push(User.findOne({ username })
            .then(user_username => {
                if(!user_username) {
                    return false;
                } else {
                    return true;
                }
            })
        );

        promises.push(User.findOne({ email })
            .then(user_email => {
                if(!user_email) {
                    return false;
                } else {
                    return true;
                }
            })
        );

        Promise.all(promises)
            .then(result => {
                const response = {
                    success: true,
                    username: false,
                    email: false
                };

                if (result[0]) {
                    response.success = false;
                    response.username = true;
                }

                if (result[1]) {
                    response.success = false;
                    response.email = true;
                }
                res.status(200).json(response);
            });
    });

    app.post(routes.API_SIGNUP, (req, res) => {
        const { username, email, first_name, last_name, password } = req.body;

        // First, we double-check that the account doesn't already exist
        const promises = [];

        promises.push(User.findOne({ username })
            .then(user_username => {
                if(!user_username) {
                    return false;
                } else {
                    return true;
                }
            })
        );

        promises.push(User.findOne({ email })
            .then(user_email => {
                if(!user_email) {
                    return false;
                } else {
                    return true;
                }
            })
        );

        Promise.all(promises)
            .then(result => {
                if (result[0] || result[1]) {
                    return res.status(200).json({ success: false, message: 'User already exists!' });
                }

                bcrypt.hash(password, null, null, (err, hash) => {
                    if (err) {
                        return res.status(400).json({ success: false, message: 'Internal server error' });
                    }
                    const user = new User({ username, first_name, last_name, email, hash });
                    return user.save()
                        .then(() => {
                            return logIn(user, secret, res);
                        });
                });
            });
    });

    // Set protected routes
    require('./routes/stories')(app);
    require('./routes/submissions')(app);
    require('./routes/readers')(app);

    // Redirects for Angular routing
    app.get('*', (req, res) => {
        res.sendFile('index.html', { root: `${__dirname}/../static/` });
    });
};
