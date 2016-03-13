/**
 * Created by shine on 2015/3/27.
 */
var logger = require('pomelo-logger').getLogger("test", __filename);

module.exports.setLogger = function(serverName){
	var basePath = process.cwd();
	var logConfig = basePath + "/config/log4js.json";

	var Logger = require('pomelo-logger');
	Logger.configure(logConfig, {base: basePath, serverName: serverName});

	logger.info("\n\n");
	logger.info("-----------------------------server start, name: %s---------------------------", serverName);
}
