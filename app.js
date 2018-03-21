const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const config = require('./config/default.js');
const routes = require('./config/routes.js');
const logger = require('./lib/logger.js');
const auth = require('./lib/auth.js');
const dbInterface = require('./lib/dbInterface.js');

app.set('config', config);
app.set('routes', routes);
app.set('auth', auth);
app.set('dbInterface', dbInterface);

app.use(logger);
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));

require('./lib/api.js')(app);

app.listen(3000, () => {
    console.log('StoryTracker API started on port 3000.');
});
