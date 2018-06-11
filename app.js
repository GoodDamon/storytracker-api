const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Settings
const config = require('./config/default.js');
const routes = require('./config/routes.js');
const auth = require('./lib/auth.js');
const dbInterface = require('./lib/dbInterface.js');
const errors = require('./lib/errors.js');

// Middleware
const logger = require('./lib/logger.js');
const sanitize = require('./lib/sanitize.js');

app.set('config', config);
app.set('routes', routes);
app.set('auth', auth);
app.set('dbInterface', dbInterface);
app.set('errors', errors);

app.use(logger);
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sanitize);
app.use(express.static('static'));

require('./lib/api.js')(app);

app.listen(3000);
