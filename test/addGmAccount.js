var Crypto = require('crypto');
var MongoClient = require("mongodb").MongoClient;
var config = require('../config/server.js');

var gmDBUrl = config.webDbUrl;
var collectionName = 'gmAccount';

function addGmAccount(doc) {
    MongoClient.connect(gmDBUrl, function (error, db) {
        if (error) {
            console.error("addGmAccount error: " + error);
            return;
        }

        // 密码转换成md5格式
        doc.password = Crypto.createHash('md5').update(doc.password).digest('hex');

        db.collection('gmAccount').updateOne({name: doc.name}, {$set: doc}, {upsert: true}, function (error, result) {
            if (error) {
                console.error("addGmAccount error" + error);
                return;
            }

            console.log('insert gm account ' + doc.name + ' ok!');
            db.close();
        });
    });
}

addGmAccount({
    name: "suyu",
    password: "ABCabc123",
    isAdmin: 1
});
