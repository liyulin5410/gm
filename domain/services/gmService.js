/**
 * Created by shine on 2015/8/20.
 */
var logger = require('pomelo-logger').getLogger("test", __filename);

var Async = require('async');
var Crypto = require('crypto');
var ServerConfig = require("../../config/server");
var GmPlat = require("../../config/gmPlat.json");
var HttpClient = require("../utils/httpClient");
var TimeUtils = require('../utils/timeUtils');

module.exports.create = function (app) {
    return new GMService(app);
};

var GMService = function (app) {
    this._app = app;
    this._dbManager = app.get("dbManager");
    this._gmAccounts = {};

    this._gmDao = require("../dao/gmDao").create(this._dbManager);
    this._playerDao = require("../dao/playerDao").create(this._dbManager);

    this.readGmAccounts();
};

GMService.prototype.getAllGmAccounts = function (callback) {
    return this._gmAccounts;
};

GMService.prototype.readGmAccounts = function () {
    var self = this;

    this._gmDao.getGmAccounts(function (docs) {
        if (!docs || docs.length == 0) {
            return;
        }

        docs.forEach(function (e) {
            self._gmAccounts[e.name] = e;
        });

        logger.debug("gm accounts length: %d", docs.length);
    });
};

GMService.prototype.getGmAccount = function (name) {
    var gmAccount = this._gmAccounts[name];

    if (gmAccount && !gmAccount.serverId) {
        this.setGmQuery(gmAccount);
    }

    return gmAccount;
};

GMService.prototype.setGmQuery = function (gmAccount, serverId, appId, operator) {
    if (!gmAccount) {
        logger.error("setGmQuery, invalid name");
        return;
    }

    gmAccount.serverId = serverId || 1;
    gmAccount.appId = appId || "1001";
    gmAccount.operator = operator || "diandian";
};

GMService.prototype.findGmAccount = function (name, password, callback) {
    var pwd = Crypto.createHash('md5').update(password).digest('hex');
    var self = this;

    this._gmDao.findGmAccount(name, pwd, function (error, gmAccount) {
        if (error || !gmAccount) {
            callback(false);
            return;
        }

        var plat = "";
        if (gmAccount.isAdmin) {
            plat = "/account";
        } else {
            plat = "/account";
        }

        if (!self._gmAccounts[name]) {
            self._gmAccounts[name] = gmAccount;
        }

        callback(true, plat);
    });
};

GMService.prototype.insertGmAccount = function (name, gmAccount) {
    this._gmAccounts[name] = gmAccount;
};


GMService.prototype.addGmAccount = function (account, callback) {
    if (this._gmAccounts[account.name]) {
        callback(null);
        return;
    }

    account.password = Crypto.createHash('md5').update(account.password).digest('hex');

    this._gmAccounts[account.name] = account;

    var self = this;
    this._gmDao.addGmAccount(account, function (error) {
        callback(self._gmAccounts);
    });
};

GMService.prototype.modifyGmAccount = function (account, callback) {
    if (!this._gmAccounts[account.name]) {
        callback(this._gmAccounts);
        return;
    }

    if (account.password !== "") {
        account.password = Crypto.createHash('md5').update(account.password).digest('hex');
    } else {
        account.password = this._gmAccounts[account.name].password;
    }

    if (this._gmAccounts[account.name].isAdmin) {
        this._gmAccounts[account.name].password = account.password;
        this._gmAccounts[account.name].remark = account.remark;
    } else {
        this._gmAccounts[account.name] = account;
    }

    var self = this;
    this._gmDao.saveGmAccount(account, function (error) {
        callback(self._gmAccounts);
    });
};

GMService.prototype.deleteGmAccount = function (name, callback) {
    if (!this._gmAccounts[name]) {
        callback(this._gmAccounts);
        return;
    }

    delete this._gmAccounts[name];

    var self = this;
    this._gmDao.removeGmAccount(name, function (error) {
        callback(self._gmAccounts);
    });
};

GMService.prototype.checkAuthorization = function (gmAccount, url, callback) {
    if (gmAccount.isAdmin == 1) {
        callback(true);
        return;
    }

    var plat = "";
    for (var i in GmPlat) {
        var platUrls = GmPlat[i];
        for (var j in platUrls) {
            if (platUrls[j] === url) {
                plat = i;
                break;
            }
        }

        if (plat !== "") {
            break;
        }
    }

    callback(gmAccount[plat] == 1);
};

GMService.prototype.decimalToPercentage = function (numerator, denominator) {
    if (denominator === "" || numerator === "" || denominator === 0 || numerator === 0) {
        return "";
    }

    var percentage = Math.round(numerator / denominator * 1000) / 10 + "%";
    return "(" + percentage + ")";
};

/*
 ---------------------------------------------------------------------
 */
GMService.prototype.getBoardData = function (gmAccount, startTime, endTime, callback) {
    var config = ServerConfig.server[gmAccount.serverId - 1];
    var self = this;

    logger.debug("getBoardData, startTime: %s, endTime: %s, gmAccount: %j config: %j", startTime, endTime, gmAccount, config);

    Async.parallel([
            function (cb) {
                HttpClient.sendMsg(config.url, config.port, "GET", "/getNumOfOnlineUsers", {}, function (res) {
                    logger.debug("getNumOfOnlineUsers: %j, %d", res, res.onlineCount);
                    cb(null, res.onlineCount);
                });
            },
            function (cb) {
                self._gmDao.getBoardData(gmAccount, startTime, endTime, function (err, data) {
                    if (!data) {
                        logger.error("find board data fail, start: " + startTime + " end: " + endTime + ", err=" + err);
                    }

                    logger.debug("getBoardData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var boardData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                data.order = data.order || {};

                var element = {
                    serverId: 1,
                    startServerTime: config.startServer,
                    dateTime: TimeUtils.dateFormat(data.dt),
                    numOfOnlineUsers: results[0],

                    numOfTotalLogin: data.activity.numOfTotalLogin || 0,
                    numOfMonthLogin: data.activity.numOfMonthLogin || 0,
                    numOfDayLogin: data.activity.numOfDayLogin || 0,

                    numOfTotalRegister: data.activity.numOfTotalRegister || 0,
                    numOfMonthRegister: data.activity.numOfMonthRegister || 0,
                    numOfDayRegister: data.activity.numOfDayRegister,

                    numOfTotalAmount: data.order.numOfTotalAmount || 0,
                    numOfMonthAmount: data.order.numOfMonthAmount || 0,
                    numOfDayAmount: data.order.numOfDayAmount || 0,

                    numOfTotalPaidUsers: data.order.numOfTotalPaidUsers || 0,
                    numOfMonthPaidUsers: data.order.numOfMonthPaidUsers || 0,
                    numOfDayPaidUsers: data.order.numOfDayPaidUsers || 0,
                    numOfDayArpu: (data.order.numOfDayPaidUsers === 0) ? 0 : Math.round(data.order.numOfDayAmount / data.order.numOfDayPaidUsers * 100) / 100,
                    numOfDayPaidRatio: (data.activity.numOfDayLogin === 0) ? "0%" : (Math.round(data.order.numOfDayPaidUsers / data.activity.numOfDayLogin * 10000) / 100 + "%"),

                    numOfDayFirstPaidUsers: data.order.numOfDayFirstPaidUsers,
                    numOfDayFirstPaidAmount: data.order.numOfDayFirstPaidAmount,
                    numOfDayFirstPaidArpu: (data.order.numOfDayFirstPaidUsers === 0) ? 0 : Math.round(data.order.numOfDayFirstPaidAmount / data.order.numOfDayFirstPaidUsers * 100) / 100,
                    numOfDayFirstPaidRatio: (data.activity.numOfDayRegister == 0) ? "0%" : (Math.round(data.order.numOfDayFirstPaidUsers / data.activity.numOfDayRegister * 10000) / 100 + "%")
                };

                boardData.push(element);
            }

            if (boardData.length === 0) {
                var data = {
                    serverId: config.serverId,
                    startServerTime: config.startServer,
                    numOfOnlineUsers: results[0]
                };
                boardData.push(data);
            }

            logger.debug("boardData: %j", boardData)
            callback(err, boardData);
        }
    );
};

GMService.prototype.getRetentionData = function (gmAccount, startTime, endTime, callback) {
    var self = this;

    this._gmDao.getRetentionData(gmAccount, startTime, endTime, function (err, data) {
        if (err) {
            logger.error("find retention data fail, start: " + startTime + " end: " + endTime + ", err=" + err);
            callback(err, null);
            return;
        }

        var retentionData = [];
        for (var i in data) {
            var dataTime = data[i].dt.getFullYear() + '-' + (data[i].dt.getMonth() + 1) + '-' + data[i].dt.getDate();
            var numOfRegisteredUsers = data[i].numOfRegisteredUsers || "";
            var numOfRetentedUsers1later = data[i].numOfRetentedUsers1later || "";
            var numOfRetentedUsers2later = data[i].numOfRetentedUsers2later || "";
            var numOfRetentedUsers3later = data[i].numOfRetentedUsers3later || "";
            var numOfRetentedUsers4later = data[i].numOfRetentedUsers4later || "";
            var numOfRetentedUsers5later = data[i].numOfRetentedUsers5later || "";
            var numOfRetentedUsers6later = data[i].numOfRetentedUsers6later || "";
            var numOfRetentedUsers7later = data[i].numOfRetentedUsers7later || "";
            var numOfRetentedUsers14later = data[i].numOfRetentedUsers14later || "";
            var numOfRetentedUsers30later = data[i].numOfRetentedUsers30later || "";
            var numOfRetentedUsers10later = data[i].numOfRetentedUsers10later || "";
            var numOfRetentedUsers18later = data[i].numOfRetentedUsers18later || "";
            var numOfRetentedUsers21later = data[i].numOfRetentedUsers21later || "";
            var logData = {
                serverId: 1,
                dateTime: dataTime,
                numOfRegisteredUsers: numOfRegisteredUsers,
                numOfRetentedUsers1later: numOfRetentedUsers1later + self.decimalToPercentage(numOfRetentedUsers1later, numOfRegisteredUsers),
                numOfRetentedUsers2later: numOfRetentedUsers2later + self.decimalToPercentage(numOfRetentedUsers2later, numOfRegisteredUsers),
                numOfRetentedUsers3later: numOfRetentedUsers3later + self.decimalToPercentage(numOfRetentedUsers3later, numOfRegisteredUsers),
                numOfRetentedUsers4later: numOfRetentedUsers4later + self.decimalToPercentage(numOfRetentedUsers4later, numOfRegisteredUsers),
                numOfRetentedUsers5later: numOfRetentedUsers5later + self.decimalToPercentage(numOfRetentedUsers5later, numOfRegisteredUsers),
                numOfRetentedUsers6later: numOfRetentedUsers6later + self.decimalToPercentage(numOfRetentedUsers6later, numOfRegisteredUsers),
                numOfRetentedUsers7later: numOfRetentedUsers7later + self.decimalToPercentage(numOfRetentedUsers7later, numOfRegisteredUsers),
                numOfRetentedUsers10later: numOfRetentedUsers10later + self.decimalToPercentage(numOfRetentedUsers10later, numOfRegisteredUsers),
                numOfRetentedUsers14later: numOfRetentedUsers14later + self.decimalToPercentage(numOfRetentedUsers14later, numOfRegisteredUsers),
                numOfRetentedUsers18later: numOfRetentedUsers18later + self.decimalToPercentage(numOfRetentedUsers18later, numOfRegisteredUsers),
                numOfRetentedUsers21later: numOfRetentedUsers21later + self.decimalToPercentage(numOfRetentedUsers21later, numOfRegisteredUsers),
                numOfRetentedUsers30later: numOfRetentedUsers30later + self.decimalToPercentage(numOfRetentedUsers30later, numOfRegisteredUsers)
            };
            retentionData.push(logData);
        }
        callback(err, retentionData);
    });
};

GMService.prototype.getPaidRetentionData = function (gmAccount, startTime, endTime, callback) {
    var self = this;

    this._gmDao.getPaidRetentionData(gmAccount, startTime, endTime, function (err, data) {
        if (err) {
            logger.error("find paid retention data fail, start: " + startTime + " end: " + endTime);
            callback(err, null);
            return;
        }

        var retentionData = [];
        for (var i in data) {
            var dataTime = data[i].dt.getFullYear() + '-' + (data[i].dt.getMonth() + 1) + '-' + data[i].dt.getDate();
            var numOfPaidUsers = data[i].numOfPaidUsers || "";
            var numOfRetentedUsers1later = data[i].numOfRetentedUsers1later || "";
            var numOfRetentedUsers2later = data[i].numOfRetentedUsers2later || "";
            var numOfRetentedUsers3later = data[i].numOfRetentedUsers3later || "";
            var numOfRetentedUsers4later = data[i].numOfRetentedUsers4later || "";
            var numOfRetentedUsers5later = data[i].numOfRetentedUsers5later || "";
            var numOfRetentedUsers6later = data[i].numOfRetentedUsers6later || "";
            var numOfRetentedUsers7later = data[i].numOfRetentedUsers7later || "";
            var numOfRetentedUsers14later = data[i].numOfRetentedUsers14later || "";
            var numOfRetentedUsers30later = data[i].numOfRetentedUsers30later || "";
            var numOfRetentedUsers10later = data[i].numOfRetentedUsers10later || "";
            var numOfRetentedUsers18later = data[i].numOfRetentedUsers18later || "";
            var numOfRetentedUsers21later = data[i].numOfRetentedUsers21later || "";
            var logData = {
                serverId: 1,
                dateTime: dataTime,
                numOfPaidUsers: numOfPaidUsers,
                numOfRetentedUsers1later: numOfRetentedUsers1later + self.decimalToPercentage(numOfRetentedUsers1later, numOfPaidUsers),
                numOfRetentedUsers2later: numOfRetentedUsers2later + self.decimalToPercentage(numOfRetentedUsers2later, numOfPaidUsers),
                numOfRetentedUsers3later: numOfRetentedUsers3later + self.decimalToPercentage(numOfRetentedUsers3later, numOfPaidUsers),
                numOfRetentedUsers4later: numOfRetentedUsers4later + self.decimalToPercentage(numOfRetentedUsers4later, numOfPaidUsers),
                numOfRetentedUsers5later: numOfRetentedUsers5later + self.decimalToPercentage(numOfRetentedUsers5later, numOfPaidUsers),
                numOfRetentedUsers6later: numOfRetentedUsers6later + self.decimalToPercentage(numOfRetentedUsers6later, numOfPaidUsers),
                numOfRetentedUsers7later: numOfRetentedUsers7later + self.decimalToPercentage(numOfRetentedUsers7later, numOfPaidUsers),
                numOfRetentedUsers10later: numOfRetentedUsers10later + self.decimalToPercentage(numOfRetentedUsers10later, numOfPaidUsers),
                numOfRetentedUsers14later: numOfRetentedUsers14later + self.decimalToPercentage(numOfRetentedUsers14later, numOfPaidUsers),
                numOfRetentedUsers18later: numOfRetentedUsers18later + self.decimalToPercentage(numOfRetentedUsers18later, numOfPaidUsers),
                numOfRetentedUsers21later: numOfRetentedUsers21later + self.decimalToPercentage(numOfRetentedUsers21later, numOfPaidUsers),
                numOfRetentedUsers30later: numOfRetentedUsers30later + self.decimalToPercentage(numOfRetentedUsers30later, numOfPaidUsers)
            };
            retentionData.push(logData);
        }
        callback(err, retentionData);
    });
};


//announce
GMService.prototype.getGMAnnounce = function (gmAccount, callback) {
    this._gmDao.getGMAnnounce(gmAccount, function (error, documents) {
        if (error || documents.length === 0) {
            callback(error, []);
            return;
        }

        var maxNum = documents.length;
        var announces = documents.map(function (e, index) {
            return {
                announceId: maxNum - index,
                serverId: gmAccount.serverId,
                createTime: TimeUtils.timeFormat(e.createTime),
                startTime: TimeUtils.timeFormat(e.startTime),
                endTime: TimeUtils.timeFormat(e.endTime),
                title: e.title,
                message: e.message,
                available: e.available
            };
        });

        callback(null, announces);
    });
};

GMService.prototype.insertGMAnnounce = function (gmAccount, message, startTime, endTime, interval, callback) {
    var self = this;
    this._gmDao.insertGMAnnounce(gmAccount, message, startTime, endTime, interval, function (error, document) {
        self.getGMAnnounce(gmAccount, callback);
    });
};

GMService.prototype.cancelGMAnnounce = function (gmAccount, createTime, available, callback) {
    this._gmDao.cancelGMAnnounce(gmAccount, createTime, available);
    callback(null);
};

GMService.prototype.getClosing = function (gmAccount, callback) {
    callback(false);
};

GMService.prototype.setClosing = function (gmAccount, isClosing, callback) {
    callback(null);
};

//announce
GMService.prototype.getMails = function (gmAccount, callback) {
    this._gmDao.getMails(gmAccount, function (error, documents) {
        if (error || documents.length === 0) {
            callback(error, []);
            return;
        }

        var maxNum = documents.length;
        var mails = documents.map(function (e, index) {
            return {
                index: maxNum - index,
                serverId: gmAccount.serverId,
                createTime: TimeUtils.timeFormat(e.createTime),
                sendTime: TimeUtils.timeFormat(e.sendTime),
                endTime: TimeUtils.timeFormat(e.endTime),
                message: e.message,
                title: e.title,
                item: e.items,
                state: e.state
            };
        });

        callback(null, mails);
    });
};

GMService.prototype.insertMail = function (gmAccount, mail, callback) {
    var self = this;
    this._gmDao.insertMail(gmAccount, mail, function (error, document) {
        if (error) {
            callback(error);
            return;
        }

        self.getMails(gmAccount, callback);
    });
};

GMService.prototype.getAccounts = function (gmAccount, msg, callback) {
    var funcGetCondition = function (value1, value2) {
        if (value1 > 0 && value2 > 0) {
            return {$gte: value1, $lte: value2};
        } else if (value1 === 0 && value2 > 0) {
            return {$lte: value2};
        } else if (value1 > 0 && value2 === 0) {
            return {$gte: value1};
        }
    };

    var options = {
        "最后充值时间": "lastRechargeTime",
        "首次充值时间": "firstRechargeTime",
        "最后登录时间": "lastLoginTime",
        "创建时间": "registerTime"
    };

    var timeString = options[msg.timeOption];

    var sortCondition = {};
    sortCondition[timeString] = -1; //记录排序

    var condition = {};

    if (msg.flag == 1 || msg.flag == 2) {
        condition[timeString] = {$gte: msg.sdt, $lte: msg.edt}; //时间范围

    } else if (msg.flag == 0 || msg.flag == 2) {
        switch (msg.option) {
            case "玩家昵称=":
                condition.nickname = msg.optionValue;
                break;
            case "玩家ID=":
            case "玩家对象ID=":
                condition.playerId = msg.optionValue;
                break;
            case "平台账号=":
                condition.username = msg.optionValue;
                break;
            case "钻石>=<=":
                condition.diamond = funcGetCondition(msg.optionValue, msg.optionValue1);
                break;
            case "金币>=<=":
                condition.gold = funcGetCondition(msg.optionValue, msg.optionValue1);
                break;
            case "充值>=<=":
                condition.totalRecharge = funcGetCondition(msg.optionValue, msg.optionValue1);
                break;
            case "封号":
                condition.isBanToLogin = true;
                break;
            default :
                break;
        }
    }

    this._playerDao.combinedQueryAccounts(gmAccount, condition, sortCondition, callback);
};

GMService.prototype.getAccountById = function (gmAccount, playerId, callback) {
    this._playerDao.getAccount(gmAccount, {playerId: playerId}, callback);
};

GMService.prototype.getItems = function (gmAccount, callback) {
    this._gmDao.getItems(gmAccount, callback);
};

