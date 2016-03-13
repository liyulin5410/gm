var MongoClient = require("mongodb").MongoClient;
var async = require('async');

var config = require('../config/server.js');
var Items = require('./items.json');

var collectionName = 'items';

/**
 * 获取gm数据库的地址
 * @param serverId
 * @returns {string}
 */
function getMongoUrl(serverId) {
    for (var i = 0; i < config.server.length; i++) {
        var server = config.server[i];
        if (server.serverId == serverId) {
            return server.gmDBUrl;
        }
    }
}

function addItems(serverId) {
    // 默认是5服，也就是本地调试服
    if (serverId == undefined) {
        serverId = 5;
    }

    var mongoUrl = getMongoUrl(serverId);
    if (!mongoUrl) {
        console.log('can not find serverId: ' + serverId);
        return;
    }

    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) {
            console.log('addItems: ' + error);
            return;
        }

        db.collection(collectionName).ensureIndex({id: 1}, {unique: true});

        async.each(Items, function (item, callback) {
            db.collection(collectionName).updateOne({id: item.id}, {$set: item}, {upsert: true}, function (err, result) {
                callback();
            });
        }, function (err) {
            if (err) {
                console.log('addItems: ' + error);
            } else {
                console.log('addItems to server ' + serverId + ' ok.');
            }
            db.close();
        });
    })
}

addItems(1);
addItems(3);
addItems(5);
