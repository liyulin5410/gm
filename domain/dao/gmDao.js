/**
 * Created by shine on 2015/8/21.
 */
var logger = require('pomelo-logger').getLogger("test", __filename);

exports.create = function (dbManager) {
    return new GMDao(dbManager);
};

var GMDao = function (dbManager) {
    this._dbManager = dbManager;
    this._webDbClient = dbManager.getWebDbClient();
};


GMDao.prototype.findGmAccount = function (name, pwd, callback) {
    this._webDbClient.collection('gmAccount', function (error, collection) {
        if (!!error) {
            callback(error, null);
            return;
        }
        collection.findOne({
            name: name,
            password: pwd
        }, function (error, document) {
            if (!!error) {
                callback(error, null);
                return;
            }

            callback(null, document);
        });
    });
};

GMDao.prototype.getGmAccounts = function (callback) {
    this._webDbClient.collection('gmAccount', function (error, collection) {
        if (!!error) {
            callback(null);
            return;
        }
        collection.find({}, {fields: {_id: 0}}).toArray(function (error, documents) {
            if (!!error) {
                callback(null);
                return;
            }
            callback(documents);
        });
    });
};

GMDao.prototype.addGmAccount = function (account, callback) {
    this._webDbClient.collection('gmAccount', function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.insert(account, function (error, document) {
            if (!!error) {
                callback(error);
                return;
            }

            callback(null);
        });
    });
};

GMDao.prototype.saveGmAccount = function (account, callback) {
    this._webDbClient.collection('gmAccount', function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.update({name: account.name}, {$set: account}, function (error, document) {
            if (!!error) {
                callback(error);
                return;
            }

            callback(null);
        });
    });
};

GMDao.prototype.removeGmAccount = function (name, callback) {
    this._webDbClient.collection('gmAccount', function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.remove({name: name}, function (error) {
            callback(error);
        });
    });
};


GMDao.prototype.getBoardData = function (gmAccount, startTime, endTime, callback) {
    var sdt = new Date(startTime);
    sdt.setHours(0, 0, 0, 0);

    var edt = new Date(endTime);
    edt.setHours(23, 59, 59, 999);

    logger.debug("getBoardData, start: %d, end: %d", sdt, edt);

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("board", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }

        collection.find({
            'dt': {$gte: sdt, $lte: edt}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }

            callback(null, documents)
        });
    });
};


GMDao.prototype.getRetentionData = function (gmAccount, startTime, endTime, callback) {
    var sdt = new Date(startTime);
    sdt.setHours(0, 0, 0, 0);

    var edt = new Date(endTime);
    edt.setHours(23, 59, 59, 999);

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("retention", function (error, collection) {
        if (!!error) {
            return;
        }

        collection.find({
            'dt': {$gte: sdt, $lte: edt}
        }).sort({dt: -1}).toArray(function (error, documents) {
            callback(error, documents || []);
        });
    });
};

GMDao.prototype.getPaidRetentionData = function (gmAccount, startTime, endTime, callback) {
    var sdt = new Date(startTime);
    sdt.setHours(0, 0, 0, 0);

    var edt = new Date(endTime);
    edt.setHours(23, 59, 59, 999);

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("paidRetention", function (error, collection) {
        if (!!error) {
            return;
        }

        collection.find({
            'dt': {$gte: sdt, $lte: edt}
        }).sort({dt: -1}).toArray(function (error, documents) {
            callback(error, documents || []);
        });
    });
};


GMDao.prototype.insertGMAnnounce = function (gmAccount, message, startTime, endTime, title, callback) {
    this._dbManager.getGmDbClient(gmAccount.serverId).collection('announce', function (error, collection) {
        if (!!error) {
            callback(error, null);
            return;
        }

        var createTime = new Date();
        createTime.setMilliseconds(0);

        collection.insert({
            message: message,
            startTime: startTime,
            endTime: endTime,
            title: title,
            createTime: createTime,
            lastSendTime: 0,
            available: 1
        }, function (error, document) {
            callback(error, document);
        });
    });
};


GMDao.prototype.getGMAnnounce = function (gmAccount, callback) {
    this._dbManager.getGmDbClient(gmAccount.serverId).collection('announce', function (error, collection) {
        if (!!error) {
            callback(error, null);
            return;
        }

        collection.find().sort({createTime: -1}).limit(50).toArray(function (error, documents) {
            callback(error, documents);
        });
    });
};


GMDao.prototype.saveGMAnnounce = function (gmAccount, announce) {
    this._dbManager.getGmDbClient(gmAccount.serverId).collection('announce', function (error, collection) {
        if (!!error) {
            return;
        }

        collection.update({
            createTime: announce.createTime
        }, {
            $set: {
                lastSendTime: announce.lastSendTime,
                available: announce.available
            }
        }, {
            safe: true
        }, function (error) {
        });
    });
};

GMDao.prototype.cancelGMAnnounce = function (gmAccount, createTime, available) {
    this._dbManager.getGmDbClient(gmAccount.serverId).collection('announce', function (error, collection) {
        if (!!error) {
            return;
        }

        collection.update({
            createTime: createTime
        }, {
            $set: {
                available: available
            }
        }, {
            safe: true
        }, function (error) {
        });
    });
};

/**
 * @description 获取所有邮件
 * @param {object} gmAccount
 * @param {function} callback
 */
GMDao.prototype.getMails = function (gmAccount, callback) {
    this._dbManager.getGmDbClient(gmAccount.serverId).collection('mail', function (error, collection) {
        if (!!error) {
            callback(error, null);
            return;
        }

        collection.find().project({_id: 0}).sort({createTime: -1}).limit(50).toArray(function (error, documents) {
            callback(error, documents);
        });
    });
};

GMDao.prototype.insertMail = function (gmAccount, mail, callback) {
    this._dbManager.getGmDbClient(gmAccount.serverId).collection('mail', function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }

        if (!mail.state) {
            mail.state = '未发送';
        }
        if (!mail.createTime) {
            mail.createTime = Date.now();
        }
        if (!mail.endTime) {
            mail.endTime = mail.sendTime + 7 * 24 * 60 * 60 * 1000;
        }

        collection.insertOne(mail, function (error, documents) {
            callback(error, documents);
        });
    });
};

GMDao.prototype.getItems = function (gmAccount, callback) {
    this._dbManager.getGmDbClient(gmAccount.serverId).collection('items').find().sort({id: 1}).toArray(function (err, docs) {
        callback(err, docs);
    });
};