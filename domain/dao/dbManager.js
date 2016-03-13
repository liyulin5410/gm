/**
 * Created by shine on 2015/8/20.
 */
var logger = require('pomelo-logger').getLogger("test", __filename);

var Async = require('async');
var ServerConfig = require("../../config/server");
var MongoClient = require('mongodb').MongoClient;

var WEB_DB_NAME = "webDbUrl";
var GAME_DB_NAME = "_gameDBUrl";
var GM_DB_NAME = "_gmDBUrl";

module.exports.create = function (app) {
    return new DbManager(app);
};

var DbManager = function (app) {
    this._app = app;
    this._dbClients = {};
};

DbManager.prototype.initDbClient = function (cb) {
    var servers = [
        {
            name: WEB_DB_NAME,
            url: ServerConfig.webDbUrl
        }
    ];

    ServerConfig.server.forEach(function (e) {
        servers.push({name: e.serverId + GAME_DB_NAME, url: e.gameDBUrl});
        servers.push({name: e.serverId + GM_DB_NAME, url: e.gmDBUrl});
    });

    var index = 0;
    var self = this;

    Async.whilst(function () {
        return index < servers.length;
    }, function (callback) {
        var config = servers[index++];

        MongoClient.connect(config.url, function (err, dbclient) {
            if (!!err) {
                // 特殊处理本地服，允许本地服不开启
                if (config.url.indexOf('127.0.0.1') > -1) {
                    callback();
                } else {
                    callback(err);
                }
                return;
            }

            self._dbClients[config.name] = dbclient;
            callback();
        });
    }, function (err) {
        if (!!err) {
            cb(err);
            return;
        }

        logger.debug("initDbClient, server len: %d", servers.length);
        cb();
    });
};

DbManager.prototype.getWebDbClient = function () {
    return this._dbClients[WEB_DB_NAME];
};

DbManager.prototype.getGameDbClient = function (serverId) {
    return this._dbClients[serverId + GAME_DB_NAME];
};

DbManager.prototype.getGmDbClient = function (serverId) {
    return this._dbClients[serverId + GM_DB_NAME];
};
