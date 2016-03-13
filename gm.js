/**
 * Module dependencies.
 */
var app = require('./app');
var debug = require('debug')('gm-server:server');
var http = require('http');
var serverConfig = require("./config/server");
var logger = require('pomelo-logger').getLogger("test", __filename);

/**
 * Get port from environment and store in Express.
 */
var port = serverConfig.port;	//normalizePort(process.env.PORT || '3000');
app.set('port', port);

logger.debug("port: %d", port);

/*
 ---------------------------------------------
 */
var DbManager = require("./domain/dao/dbManager").create(app);
DbManager.initDbClient(function (err) {
    if (!!err) {
        logger.error("initDbClient failed! err: " + err);
        return;
    }

    app.set("dbManager", DbManager);

    var GmService = require("./domain/services/gmService").create(app);
    app.set("gmService", GmService);

    logger.info("----init gm server success---");
});

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
