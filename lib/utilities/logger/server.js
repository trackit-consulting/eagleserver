var log4js = require("log4js"),
    config = require('../../../lib/config/settings');

// path to configuration file
log4js.configure(config.log4js.file, {});

// load appender (appender can be console, datafiles...)
log4js.loadAppender(config.log4js.appender);
var logger = log4js.getLogger(config.log4js.route.server);

module.exports = logger;