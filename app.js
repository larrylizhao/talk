const express = require('express');
const morgan = require('morgan');
const path = require('path');
const uuid = require('uuid');
const merge = require('lodash/merge');
const helmet = require('helmet');
const plugins = require('./services/plugins');
const compression = require('compression');
const {HELMET_CONFIGURATION} = require('./config');
const {MOUNT_PATH} = require('./url');
const routes = require('./routes');
const debug = require('debug')('talk:app');

const app = express();

// Request Identity Middleware
app.use((req, res, next) => {
  req.id = uuid.v4();

  next();
});

//==============================================================================
// PLUGIN PRE APPLICATION MIDDLEWARE
//==============================================================================

// Inject server route plugins.
plugins.get('server', 'app').forEach(({plugin, app: callback}) => {
  debug(`added plugin '${plugin.name}'`);

  // Pass the app to the plugin to mount it's routes.
  callback(app);
});

//==============================================================================
// APPLICATION WIDE MIDDLEWARE
//==============================================================================

// Add the logging middleware only if we aren't testing.
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Trust the first proxy in front of us, this will enable us to trust the fact
// that SSL was terminated correctly.
app.set('trust proxy', 1);

// Enable a suite of security good practices through helmet. We disable
// frameguard to allow crossdomain injection of the embed.
app.use(helmet(merge(HELMET_CONFIGURATION, {
  frameguard: false,
})));

// Compress the responses if appropriate.
app.use(compression());

//==============================================================================
// VIEW CONFIGURATION
//==============================================================================

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//==============================================================================
// ROUTES
//==============================================================================

debug(`mounting routes on the ${MOUNT_PATH} path`);

// Actually apply the routes.
app.use(MOUNT_PATH, routes);

module.exports = app;
