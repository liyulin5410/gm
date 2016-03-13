/**
 * Created by shine on 2015/8/28.
 */
var logger = require('pomelo-logger').getLogger("test", __filename);
var http = require("http");
var querystring = require('querystring');

exports.sendMsg = function(url, port, method, path, data, callback){
	var data = querystring.stringify(data);

	var options = {
		hostname: url,
		port: port,
		agent: false,
		method: method,
		path: path,
		headers: {
			"Content-Type": 'application/x-www-form-urlencoded',
			"Content-Length": data.length
		}
	};

	logger.debug("http client sendMsg, hostName: %s, port: %s, path: %s, data: %d, ", options.hostname, options.port, path, data.length);

	var request = http.request(options, function(response) {
		response.setEncoding("utf8");
		response.on('data', function (data) {
			callback(JSON.parse(data));
		});
	});

	request.on('error', function(e) {
		logger.error('problem with request: ' + e.message);
	});

	request.write(data + "\n");
	request.end();
};
