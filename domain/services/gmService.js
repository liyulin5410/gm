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
    var config = ServerConfig.server[gmAccount.serverId - 1];     //获取serverID
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

//全服查询玩家信息总览
GMService.prototype.getMessagepandectData = function (gmAccount, callback) {
    var config = ServerConfig.server[gmAccount.serverId - 1];
    var self = this;

    logger.debug("getMessagepandectData, gmAccount: %j config: %j",  gmAccount, config);

    Async.parallel([
            function (cb) {
                HttpClient.sendMsg(config.url, config.port, "GET", "/getNumOfOnlineUsers", {}, function (res) {
                    logger.debug("getNumOfOnlineUsers: %j, %d", res, res.onlineCount);
                    cb(null, res.onlineCount);
                });
            },
            function (cb) {
                self._gmDao.getMessagepandectData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find Messagepandect data fail, err=" + err);
                    }

                    logger.debug("getMessagepandectData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var messagepandectData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                data.order = data.order || {};

                var element = {
                    PlayerID:data.activity.PlayerID || 0,
                    Name:data.activity.Name || 0,
                    StartTime:data.activity.StartTime || 0,
                    EndTime:data.activity.EndTime || 0,
                    Area:data.activity.Area || 0
                };

                messagepandectData.push(element);
            }

            if (messagepandectData.length === 0) {
                var data = {
                    PlayerID:5,
                    Name:'text',
                    StartTime: 0,
                    EndTime: 0,
                    Area:'text'
                };
                messagepandectData.push(data);
            }

            logger.debug("messagepandectData: %j", messagepandectData)
            callback(err, messagepandectData);
        }
    );
};
//查询玩家信息
GMService.prototype.getMessageplayerData = function (gmAccount, callback) {
    var config = ServerConfig.server[gmAccount.serverId - 1];
    var self = this;

    logger.debug("getMessageplayerData, gmAccount: %j config: %j",  gmAccount, config);

    Async.parallel([
            function (cb) {
                HttpClient.sendMsg(config.url, config.port, "GET", "/getNumOfOnlineUsers", {}, function (res) {
                    logger.debug("getNumOfOnlineUsers: %j, %d", res, res.onlineCount);
                    cb(null, res.onlineCount);
                });
            },
            function (cb) {
                self._gmDao.getMessageplayerData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find Messageplayer data fail, err=" + err);
                    }

                    logger.debug("getMessageplayerData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var messageplayerData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                data.order = data.order || {};

                var element = {
                    PlayerGrade:data.activity.PlayerGrade || 0,
                    Fighting:data.activity.Fighting || 0,
                    Experience:data.activity.Experience || 0,
                    PVPranking:data.activity.PVPranking || 0,
                    PVAranking:data.activity.PVAranking || 0,
                    Star:data.activity.Star || 0,
                    Power:data.activity.Power || 0,
                    SkillNumber:data.activity.SkillNumber || 0,
                    Skill:data.activity.Skill || 0,
                    Gold:data.activity.Gold || 0,
                    Dimond:data.activity.Dimond || 0,
                    Honor:data.activity.Honor || 0
                };

                messageplayerData.push(element);
            }

            if (messageplayerData.length === 0) {
                var data = {
                    PlayerGrade:5,
                    Fighting:5000,
                    Experience:5000,
                    PVPranking:50,
                    PVAranking:30,
                    Star:60,
                    Power: 0,
                    SkillNumber:0,
                    Skill: 0,
                    Gold: 0,
                    Dimond: 0,
                    Honor: 0
                };
                messageplayerData.push(data);
            }

            logger.debug(" : %j", messageplayerData)
            callback(err, messageplayerData);
        }
    );
};
//帐号创建登陆登出日志
GMService.prototype.getLogPlayerData = function (gmAccount, callback) {
    var config = ServerConfig.server[gmAccount.serverId - 1];
    var self = this;

    logger.debug("getLogPlayerData, gmAccount: %j config: %j",  gmAccount, config);

    Async.parallel([
            function (cb) {
                HttpClient.sendMsg(config.url, config.port, "GET", "/getNumOfOnlineUsers", {}, function (res) {
                    logger.debug("getNumOfOnlineUsers: %j, %d", res, res.onlineCount);
                    cb(null, res.onlineCount);
                });
            },
            function (cb) {
                self._gmDao.getLogPlayerData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogPlayer data fail, err=" + err);
                    }

                    logger.debug("getLogPlayerData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logplayerData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                data.order = data.order || {};

                var element = {
                    PlayerID:data.activity.PlayerID || 0,
                    CreationTime:data.activity.CreationTime || 0,
                    StartTime:data.activity.StartTime || 0,
                    EndTime:data.activity.EndTime || 0,
                    PlayTime:data.activity.PlayTime || 0
                };
                logplayerData.push(element);
            }

            if (logplayerData.length === 0) {
                var data = {
                    PlayerID:5,
                    CreationTime:5000,
                    StartTime:5000,
                    EndTime:50,
                    PlayTime:30
                };
                logplayerData.push(data);
            }

            logger.debug(" : %j", logplayerData)
            callback(err, logplayerData);
        }
    );
};
//体力消耗日志
GMService.prototype.getLogpowerData = function (gmAccount, callback) {
    var config = ServerConfig.server[gmAccount.serverId - 1];
    var self = this;

    logger.debug("getLogpowerData, gmAccount: %j config: %j",  gmAccount, config);

    Async.parallel([
            function (cb) {
                HttpClient.sendMsg(config.url, config.port, "GET", "/getNumOfOnlineUsers", {}, function (res) {
                    logger.debug("getNumOfOnlineUsers: %j, %d", res, res.onlineCount);
                    cb(null, res.onlineCount);
                });
            },
            function (cb) {
                self._gmDao.getLogpowerData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find Logpower data fail, err=" + err);
                    }

                    logger.debug("getLogpowerData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logpowerData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                data.order = data.order || {};

                var element = {
                    PlayerID:data.activity.PlayerID || 0,
                    Date:data.activity.Date || 0,
                    LogPower:data.activity.LogPower || 0,
                    EverydayPower:data.activity.EverydayPower || 0
                };
                logpowerData.push(element);
            }

            if (logpowerData.length === 0) {
                var data = {
                    PlayerID:5,
                    Date:5000,
                    LogPower:5000,
                    EverydayPower:50
                };
                logpowerData.push(data);
            }

            logger.debug(" : %j", logpowerData)
            callback(err, logpowerData);
        }
    );
};
//关卡数据个人日志
GMService.prototype.getLogPVEData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogPVEData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogPVE data fail, err=" + err);
                    }
                    logger.debug("getLogPVEData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logPVEData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    PVEID:data.activity.PVEID || 0,
                    ResultRecord:data.activity.ResultRecord || 0,
                    StarRecord:data.activity.StarRecord || 0,
                    PVEPlayTime:data.activity.PVEPlayTime || 0,
                    Item1:data.activity.Item1 || 0,
                    Item2:data.activity.Item2 || 0,
                    Item3:data.activity.Item3 || 0
                };
                logPVEData.push(element);
            }

            if (logPVEData.length === 0) {
                var data = {
                    PVEID:5,
                    ResultRecord:5000,
                    StarRecord:10,
                    PVEPlayTime:50,
                    Item1:50,
                    Item2:50,
                    Item3:50
                };
                logPVEData.push(data);
            }

            logger.debug(" : %j", logPVEData)
            callback(err, logPVEData);
        }
    );
};
//关卡数据全服统计
GMService.prototype.getLogPVESData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogPVESData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogPVES data fail, err=" + err);
                    }
                    logger.debug("getLogPVESData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logPVESData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    PVEID:data.activity.PVEID || 0,
                    number:data.activity.number || 0,
                    VictoryNumber:data.activity.VictoryNumber || 0,
                    DefeatedNumber:data.activity.DefeatedNumber || 0,
                    VorDRate:data.activity.VorDRate || 0,
                    PlayTimeRate:data.activity.PlayTimeRate || 0,
                    Item1:data.activity.Item1 || 0,
                    Item2:data.activity.Item2 || 0,
                    Item3:data.activity.Item3 || 0
                };
                logPVESData.push(element);
            }

            if (logPVESData.length === 0) {
                var data = {
                    PVEID:5,
                    number:5000,
                    VictoryNumber:10,
                    DefeatedNumber:50,
                    VorDRate:50,
                    PlayTimeRate:50,
                    Item1:50,
                    Item2:50,
                    Item3:50
                };
                logPVESData.push(data);
            }

            logger.debug(" : %j", logPVESData)
            callback(err, logPVESData);
        }
    );
};
//竞技塔个人爬塔日志
GMService.prototype.getLogPVAData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogPVAData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogPVA data fail, err=" + err);
                    }
                    logger.debug("getLogPVAData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logPVAData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    List:data.activity.List || 0,
                    PVARanking:data.activity.PVARanking || 0,
                    PVAResult:data.activity.PVAResult || 0,
                    PVAPlayTime:data.activity.PVAPlayTime || 0,
                    PVATime:data.activity.PVATime || 0,
                    PVADate:data.activity.PVADate || 0,
                    PlayerGrade:data.activity.PlayerGrade || 0
                };
                logPVAData.push(element);
            }

            if (logPVAData.length === 0) {
                var data = {
                    List:5,
                    PVARanking:5000,
                    PVAResult:10,
                    PVAPlayTime:50,
                    PVATime:50,
                    PVADate:50,
                    PlayerGrade:50
                };
                logPVAData.push(data);
            }

            logger.debug(" : %j", logPVAData)
            callback(err, logPVAData);
        }
    );
};
//竞技塔爬塔日志
GMService.prototype.getLogPVASData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogPVASData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogPVAS data fail, err=" + err);
                    }
                    logger.debug("getLogPVASData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logPVASData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    PVASNumber:data.activity.PVASNumber || 0,
                    PVASPlayerNumber:data.activity.PVASPlayerNumber || 0,
                    PVASSum:data.activity.PVASSum || 0,
                    PVASAverageNumber:data.activity.PVASAverageNumber || 0,
                    PVASAverageTime:data.activity.PVASAverageTime || 0,
                    PVASDate:data.activity.PVASDate || 0
                };
                logPVASData.push(element);
            }

            if (logPVASData.length === 0) {
                var data = {
                    PVASNumber:5,
                    PVASPlayerNumber:5000,
                    PVASSum:10,
                    PVASAverageNumber:50,
                    PVASAverageTime:50,
                    PVASDate:50
                };
                logPVASData.push(data);
            }

            logger.debug(" : %j", logPVASData)
            callback(err, logPVASData);
        }
    );
};
//周赛场个人日志
GMService.prototype.getLogPVPData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogPVPData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogPVP data fail, err=" + err);
                    }
                    logger.debug("getLogPVPData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logPVPData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    List:data.activity.List || 0,
                    PVPRanking:data.activity.PVPRanking || 0,
                    PVPREsult:data.activity.PVPREsult || 0,
                    PVPPlayTime:data.activity.PVPPlayTime || 0,
                    PVPTime:data.activity.PVPTime || 0,
                    PVPDate:data.activity.PVPDate || 0
                };
                logPVPData.push(element);
            }

            if (logPVPData.length === 0) {
                var data = {
                    List:5,
                    PVPRanking:5000,
                    PVPREsult:10,
                    PVPPlayTime:50,
                    PVPTime:50,
                    PVPDate:50
                };
                logPVPData.push(data);
            }

            logger.debug(" : %j", logPVPData)
            callback(err, logPVPData);
        }
    );
};
//周赛场日志
GMService.prototype.getLogPVPSData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogPVPSData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogPVPS data fail, err=" + err);
                    }
                    logger.debug("getLogPVPSData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logPVPSData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    PVPSNumber:data.activity.PVPSNumber || 0,
                    PVPSPlayerNumber:data.activity.PVPSPlayerNumber || 0,
                    PVPSSum:data.activity.PVPSSum || 0,
                    PVPSAverageNumber:data.activity.PVPSAverageNumber || 0,
                    PVPSAverageTime:data.activity.PVPSAverageTime || 0,
                    PVPSDate:data.activity.PVPSDate || 0
                };
                logPVPSData.push(element);
            }

            if (logPVPSData.length === 0) {
                var data = {
                    PVPSNumber:5,
                    PVPSPlayerNumber:5000,
                    PVPSSum:10,
                    PVPSAverageNumber:50,
                    PVPSAverageTime:50,
                    PVPSDate:50
                };
                logPVPSData.push(data);
            }

            logger.debug(" : %j", logPVPSData)
            callback(err, logPVPSData);
        }
    );
};
//无尽boss个人日志
GMService.prototype.getLogPVBData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogPVBData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogPVB data fail, err=" + err);
                    }
                    logger.debug("getLogPVBData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logPVBData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    PVBID:data.activity.PVBID || 0,
                    PVBResult:data.activity.PVBResult || 0,
                    PVBPlayTime:data.activity.PVBPlayTime || 0,
                    PVBItem1:data.activity.PVBItem1 || 0,
                    PVBItem2:data.activity.PVBItem2 || 0,
                    PVBItem3:data.activity.PVBItem3 || 0
                };
                logPVBData.push(element);
            }

            if (logPVBData.length === 0) {
                var data = {
                    PVBID:5,
                    PVBResult:5000,
                    PVBPlayTime:10,
                    PVBItem1:50,
                    PVBItem2:50,
                    PVBItem3:50
                };
                logPVBData.push(data);
            }

            logger.debug(" : %j", logPVBData)
            callback(err, logPVBData);
        }
    );
};
//无尽boss全服日志
GMService.prototype.getLogPVBSData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogPVBSData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogPVBS data fail, err=" + err);
                    }
                    logger.debug("getLogPVBSData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logPVBSData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    PVBSID:data.activity.PVBSID || 0,
                    PVBSSum:data.activity.PVBSSum || 0,
                    PVBSNumber:data.activity.PVBSNumber || 0,
                    PVBSPlayTime:data.activity.PVBSPlayTime || 0,
                    PVBSItem1:data.activity.PVBSItem1 || 0,
                    PVBSItem2:data.activity.PVBSItem2 || 0,
                    PVBSItem3:data.activity.PVBSItem3 || 0
                };
                logPVBSData.push(element);
            }

            if (logPVBSData.length === 0) {
                var data = {
                    PVBSID:5,
                    PVBSSum:5000,
                    PVBSNumber:10,
                    PVBSPlayTime:10,
                    PVBSItem1:50,
                    PVBSItem2:50,
                    PVBSItem3:50
                };
                logPVBSData.push(data);
            }

            logger.debug(" : %j", logPVBSData)
            callback(err, logPVBSData);
        }
    );
};
//账号签到领取日志
GMService.prototype.getLogSignSData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogSignSData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogSignS data fail, err=" + err);
                    }
                    logger.debug("getLogSignSData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logSignSData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    SignDate:data.activity.SignDate || 0,
                    LoginNumber:data.activity.LoginNumber || 0,
                    SignNumber:data.activity.SignNumber || 0
                };
                logSignSData.push(element);
            }

            if (logSignSData.length === 0) {
                var data = {
                    SignDate:5,
                    LoginNumber:5000,
                    SignNumber:10
                };
                logSignSData.push(data);
            }

            logger.debug(" : %j", logSignSData)
            callback(err, logSignSData);
        }
    );
};
//邮件全服日志
GMService.prototype.getLogMailSData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogMailSData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogMailS data fail, err=" + err);
                    }
                    logger.debug("getLogMailSData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logMailSData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    MailSID:data.activity.MailSID || 0,
                    MailSNumber:data.activity.MailSNumber || 0
                };
                logMailSData.push(element);
            }

            if (logMailSData.length === 0) {
                var data = {
                    MailSID:5,
                    MailSNumber:5000
                };
                logMailSData.push(data);
            }

            logger.debug(" : %j", logMailSData)
            callback(err, logMailSData);
        }
    );
};
//邮件日志
GMService.prototype.getLogMailData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogMailData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogMail data fail, err=" + err);
                    }
                    logger.debug("getLogMailData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logMailData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    MailSID:data.activity.MailSID || 0,
                    MailItemName:data.activity.MailItemName || 0,
                    MailItemNumber:data.activity.MailItemNumber || 0,
                    MailTake:data.activity.MailTake || 0,
                    MailTime:data.activity.MailTime || 0
                };
                logMailData.push(element);
            }

            if (logMailData.length === 0) {
                var data = {
                    MailSID:5,
                    MailItemName:5,
                    MailItemNumber:5,
                    MailTake:5,
                    MailTime:5000
                };
                logMailData.push(data);
            }

            logger.debug(" : %j", logMailData)
            callback(err, logMailData);
        }
    );
};
//英雄成长日志训练日志
GMService.prototype.getLogHeroData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogHeroData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogHero data fail, err=" + err);
                    }
                    logger.debug("getLogHeroData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logHeroData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    List:data.activity.List || 0,
                    HeroProfession:data.activity.HeroProfession || 0,
                    HeroTrainlevel:data.activity.HeroTrainlevel || 0,
                    HeroTrainlevelA:data.activity.HeroTrainlevelA || 0,
                    TrainBook:data.activity.TrainBook || 0,
                    TrianGold:data.activity.TrianGold || 0,
                    TrianTime:data.activity.TrianTime || 0,
                    TrianDate:data.activity.TrianDate || 0
                };
                logHeroData.push(element);
            }
            if (logHeroData.length === 0) {
                var data = {
                    List:5,
                    HeroProfession:5,
                    HeroTrainlevel:5,
                    HeroTrainlevelA:5,
                    TrainBook:5,
                    TrianGold:5,
                    TrianTime:5,
                    TrianDate:5000
                };
                logHeroData.push(data);
            }
            logger.debug(" : %j", logHeroData)
            callback(err, logHeroData);
        }
    );
};
//英雄成长日志升星日志
GMService.prototype.getLogWeaponData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogWeaponData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogWeapon data fail, err=" + err);
                    }
                    logger.debug("getLogWeaponData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logWeaponData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    List:data.activity.List || 0,
                    HeroProfession:data.activity.HeroProfession || 0,
                    HeroStar:data.activity.HeroStar || 0,
                    HeroStarA:data.activity.HeroStarA || 0,
                    HeroGold:data.activity.HeroGold || 0,
                    HeroHonor:data.activity.HeroHonor || 0,
                    HeroTime:data.activity.HeroTime || 0,
                    HeroDate:data.activity.HeroDate || 0
                };
                logWeaponData.push(element);
            }
            if (logWeaponData.length === 0) {
                var data = {
                    List:5,
                    HeroProfession:5,
                    HeroStar:5,
                    HeroStarA:5,
                    HeroGold:5,
                    HeroHonor:5,
                    HeroTime:5,
                    HeroDate:5000
                };
                logWeaponData.push(data);
            }
            logger.debug(" : %j", logWeaponData)
            callback(err, logWeaponData);
        }
    );
};
//武器成长日志强化日志
GMService.prototype.getLogWeaponIntensifyData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogWeaponIntensifyData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogWeaponIntensify data fail, err=" + err);
                    }
                    logger.debug("getLogWeaponIntensifyData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logWeaponIntensifyData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    List:data.activity.List || 0,
                    WeaponProfession:data.activity.WeaponProfession || 0,
                    WeaponName:data.activity.WeaponName || 0,
                    WeaponIntensify:data.activity.WeaponIntensify || 0,
                    WeaponIntensifyA:data.activity.WeaponIntensifyA || 0,
                    Iron1:data.activity.Iron1 || 0,
                    Iron2:data.activity.Iron2 || 0,
                    Iron3:data.activity.Iron3 || 0,
                    Iron4:data.activity.Iron4 || 0,
                    Iron5:data.activity.Iron5 || 0,
                    Iron6:data.activity.Iron6 || 0,
                    IntensifyGold:data.activity.IntensifyGold || 0,
                    IntensifyTime:data.activity.IntensifyTime || 0,
                    IntensifyDate:data.activity.IntensifyDate || 0
                };
                logWeaponIntensifyData.push(element);
            }
            if (logWeaponIntensifyData.length === 0) {
                var data = {
                    List:5,
                    WeaponProfession:5,
                    WeaponName:5,
                    WeaponIntensify:5,
                    WeaponIntensifyA:5,
                    Iron1:5,
                    Iron2:5,
                    Iron3:5,
                    Iron4:5,
                    Iron5:5,
                    Iron6:5,
                    IntensifyGold:5,
                    IntensifyTime:5,
                    IntensifyDate:5000
                };
                logWeaponIntensifyData.push(data);
            }
            logger.debug(" : %j", logWeaponIntensifyData)
            callback(err, logWeaponIntensifyData);
        }
    );
};
//武器成长日志升星日志
GMService.prototype.getLogWeaponStarData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogWeaponStarData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogWeaponStar data fail, err=" + err);
                    }
                    logger.debug("getLogWeaponStarData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logWeaponStarData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    List:data.activity.List || 0,
                    WeaponStarProfession:data.activity.WeaponStarProfession || 0,
                    WeaponName:data.activity.WeaponName || 0,
                    WeaponStar:data.activity.WeaponStar || 0,
                    WeaponStarGold:data.activity.WeaponStarGold || 0,
                    WeaponStarHonor:data.activity.WeaponStarHonor || 0,
                    WeaponStarTime:data.activity.WeaponStarTime || 0,
                    WeaponStarDate:data.activity.WeaponStarDate || 0
                };
                logWeaponStarData.push(element);
            }
            if (logWeaponStarData.length === 0) {
                var data = {
                    List:5,
                    WeaponStarProfession:5,
                    WeaponName:5,
                    WeaponStar:5,
                    WeaponStarGold:5,
                    WeaponStarHonor:5,
                    WeaponStarTime:5,
                    WeaponStarDate:5000
                };
                logWeaponStarData.push(data);
            }
            logger.debug(" : %j", logWeaponStarData)
            callback(err, logWeaponStarData);
        }
    );
};
//武器成长日志进阶日志
GMService.prototype.getLogWeaponAdvanceData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogWeaponAdvanceData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogWeaponAdvance data fail, err=" + err);
                    }
                    logger.debug("getLogWeaponAdvanceData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logWeaponAdvanceData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    List:data.activity.List || 0,
                    WeaponOccupation:data.activity.WeaponOccupation || 0,
                    WeaponAdvanceName:data.activity.WeaponAdvanceName || 0,
                    WeaponAdvanceNameA:data.activity.WeaponAdvanceNameA || 0,
                    WeaponBook:data.activity.WeaponBook || 0,
                    WeaponGold:data.activity.WeaponGold || 0,
                    WeaponHonor:data.activity.WeaponHonor || 0
                };
                logWeaponAdvanceData.push(element);
            }
            if (logWeaponAdvanceData.length === 0) {
                var data = {
                    List:5,
                    WeaponOccupation:5,
                    WeaponAdvanceName:5,
                    WeaponAdvanceNameA:5,
                    WeaponBook:5,
                    WeaponGold:5,
                    WeaponHonor:5
                };
                logWeaponAdvanceData.push(data);
            }
            logger.debug(" : %j", logWeaponAdvanceData)
            callback(err, logWeaponAdvanceData);
        }
    );
};
//任务交付日志
GMService.prototype.getLogTaskData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogTaskData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogTask data fail, err=" + err);
                    }
                    logger.debug("getLogTaskData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logTaskData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    TaskID:data.activity.TaskID || 0,
                    TaskType:data.activity.TaskType || 0,
                    TaskName:data.activity.TaskName || 0,
                    TaskExplain:data.activity.TaskExplain || 0,
                    TaskCompletionTime:data.activity.TaskCompletionTime || 0,
                    TaskGetTime:data.activity.TaskGetTime || 0
                };
                logTaskData.push(element);
            }
            if (logTaskData.length === 0) {
                var data = {
                    TaskID:5,
                    TaskType:5,
                    TaskName:5,
                    TaskExplain:5,
                    TaskCompletionTime:5,
                    TaskGetTime:5
                };
                logTaskData.push(data);
            }
            logger.debug(" : %j", logTaskData)
            callback(err, logTaskData);
        }
    );
};
//能量卡购买个人日志
GMService.prototype.getLogEergyData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogEergyData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogEergy data fail, err=" + err);
                    }
                    logger.debug("getLogEergyData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logEergyData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    EergyName:data.activity.EergyName || 0,
                    EergyHave:data.activity.EergyHave || 0,
                    EergyTime:data.activity.EergyTime || 0,
                    EergyGold:data.activity.EergyGold || 0,
                    EergyDimond:data.activity.EergyDimond || 0,
                    EergyGrade:data.activity.EergyGrade || 0
                };
                logEergyData.push(element);
            }
            if (logEergyData.length === 0) {
                var data = {
                    EergyName:5,
                    EergyHave:5,
                    EergyTime:5,
                    EergyGold:5,
                    EergyDimond:5,
                    EergyGrade:5
                };
                logEergyData.push(data);
            }
            logger.debug(" : %j", logEergyData)
            callback(err, logEergyData);
        }
    );
};
//能量卡购买全服日志
GMService.prototype.getLogEergySData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogEergySData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogEergyS data fail, err=" + err);
                    }
                    logger.debug("getLogEergySData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logEergySData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    EergyName:data.activity.EergyName || 0,
                    EergySum:data.activity.EergySum || 0
                };
                logEergySData.push(element);
            }
            if (logEergySData.length === 0) {
                var data = {
                    EergyName:5,
                    EergySum:5
                };
                logEergySData.push(data);
            }
            logger.debug(" : %j", logEergySData)
            callback(err, logEergySData);
        }
    );
};
//道具使用日志
GMService.prototype.getLogItemData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogItemData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogItem data fail, err=" + err);
                    }
                    logger.debug("getLogItemData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logItemData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    ItemList:data.activity.ItemList || 0,
                    ItemID:data.activity.ItemID || 0,
                    ItemName:data.activity.ItemName || 0,
                    ItemNumber:data.activity.ItemNumber || 0,
                    ItemTime:data.activity.ItemTime || 0,
                    ItemDate:data.activity.ItemDate || 0
                };
                logItemData.push(element);
            }
            if (logItemData.length === 0) {
                var data = {
                    ItemList:5,
                    ItemID:5,
                    ItemName:5,
                    ItemNumber:5,
                    ItemTime:5,
                    ItemDate:5
                };
                logItemData.push(data);
            }
            logger.debug(" : %j", logItemData)
            callback(err, logItemData);
        }
    );
};
//道具消耗全服日志
GMService.prototype.getLogItemSData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogItemSData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogItemS data fail, err=" + err);
                    }
                    logger.debug("getLogItemSData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logItemSData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    ItemSList:data.activity.ItemSList || 0,
                    ItemSID:data.activity.ItemSID || 0,
                    ItemSName:data.activity.ItemSName || 0,
                    ItemSNum:data.activity.ItemSNum || 0,
                    ItemSDate:data.activity.ItemSDate || 0
                };
                logItemSData.push(element);
            }
            if (logItemSData.length === 0) {
                var data = {
                    ItemSList:5,
                    ItemSID:5,
                    ItemSName:5,
                    ItemSNum:5,
                    ItemSDate:5
                };
                logItemSData.push(data);
            }
            logger.debug(" : %j", logItemSData)
            callback(err, logItemSData);
        }
    );
};
//活动参与日志
GMService.prototype.getLogActivityData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogActivityData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogActivity data fail, err=" + err);
                    }
                    logger.debug("getLogActivityData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logActivityData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    ActivityName:data.activity.ActivityName || 0,
                    ActivityBrowseNum:data.activity.ActivityBrowseNum || 0,
                    ActivityJoinNum:data.activity.ActivityJoinNum || 0
                };
                logActivityData.push(element);
            }
            if (logActivityData.length === 0) {
                var data = {
                    ActivityName:5,
                    ActivityBrowseNum:5,
                    ActivityJoinNum:5
                };
                logActivityData.push(data);
            }
            logger.debug(" : %j", logActivityData)
            callback(err, logActivityData);
        }
    );
};
//礼包领取日志
GMService.prototype.getLogGiftData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogGiftData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogGift data fail, err=" + err);
                    }
                    logger.debug("getLogGiftData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logGiftData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    GiftList:data.activity.GiftList || 0,
                    GiftID:data.activity.GiftID || 0,
                    GiftName:data.activity.GiftName || 0,
                    GiftGet:data.activity.GiftGet || 0,
                    GiftTime:data.activity.GiftTime || 0,
                    GiftDate:data.activity.GiftDate || 0
                };
                logGiftData.push(element);
            }
            if (logGiftData.length === 0) {
                var data = {
                    GiftList:5,
                    GiftID:5,
                    GiftName:5,
                    GiftGet:5,
                    GiftTime:5,
                    GiftDate:5
                };
                logGiftData.push(data);
            }
            logger.debug(" : %j", logGiftData)
            callback(err, logGiftData);
        }
    );
};
//商店购买个人日志
GMService.prototype.getLogShopData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogShopData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogShop data fail, err=" + err);
                    }
                    logger.debug("getLogShopData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logShopData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    ShopList:data.activity.ShopList || 0,
                    ShopType:data.activity.ShopType || 0,
                    ShopNum:data.activity.ShopNum || 0,
                    ShopRMB:data.activity.ShopRMB || 0,
                    ShopDimond:data.activity.ShopDimond || 0,
                    ShopGold:data.activity.ShopGold || 0,
                    ShopBuyNum:data.activity.ShopBuyNum || 0,
                    ShopDate:data.activity.ShopDate || 0
                };
                logShopData.push(element);
            }
            if (logShopData.length === 0) {
                var data = {
                    ShopList:5,
                    ShopType:5,
                    ShopNum:5,
                    ShopRMB:5,
                    ShopDimond:5,
                    ShopGold:5,
                    ShopBuyNum:5,
                    ShopDate:5
                };
                logShopData.push(data);
            }
            logger.debug(" : %j", logShopData)
            callback(err, logShopData);
        }
    );
};
//商店购买日志总览
GMService.prototype.getLogShopSData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getLogShopSData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find LogShopS data fail, err=" + err);
                    }
                    logger.debug("getLogShopSData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var logShopSData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    ShopList:data.activity.ShopList || 0,
                    ShopType:data.activity.ShopType || 0,
                    ShopSNum:data.activity.ShopSNum || 0,
                    ShopSRMB:data.activity.ShopSRMB || 0,
                    ShopSDimond:data.activity.ShopSDimond || 0,
                    ShopSGold:data.activity.ShopSGold || 0,
                    ShopSBuyNum:data.activity.ShopSBuyNum || 0,
                    ShopSDate:data.activity.ShopSDate || 0
                };
                logShopSData.push(element);
            }
            if (logShopSData.length === 0) {
                var data = {
                    ShopList:5,
                    ShopType:5,
                    ShopSNum:5,
                    ShopSRMB:5,
                    ShopSDimond:5,
                    ShopSGold:5,
                    ShopSBuyNum:5,
                    ShopSDate:5
                };
                logShopSData.push(data);
            }
            logger.debug(" : %j", logShopSData)
            callback(err, logShopSData);
        }
    );
};
//用户钻石花费记录
GMService.prototype.getLogDimondCData = function (gmAccount,playerId,startTime,endTime, callback) {
    logger.debug("getLogDimondCData, data: %j", playerId);
    logger.debug("getLogDimondCData, data: %j", startTime);
    logger.debug("getLogDimondCData, data: %j", endTime);
    this._gmDao.getLogDimondCData(gmAccount,playerId,startTime,endTime,function (error, documents) {
        if (error || documents.length === 0) {
            callback(error, []);
            return;
        }
        var maxNum = documents.length;
        var logDimondC = documents.map(function (e, index) {
            return {
                DimondCList:maxNum-index||0,
                Player_id:e.Player_id||0,
                DimondCSYS:e.DimondCSYS||0,
                DimondCNum:e.DimondCNum||0,
                DimondCTime:TimeUtils.timeFormat(e.DimondCTime)||0
            };
        });

        callback(null, logDimondC);
    });
};
//用户钻石获得个人日志
GMService.prototype.getLogDimondAData = function (gmAccount,playerId,startTime,endTime, callback) {
    logger.debug("getLogDimondAData, data: %j", playerId);
    this._gmDao.getLogDimondAData(gmAccount,playerId,startTime,endTime,function (error, documents) {
        if (error || documents.length === 0) {
            callback(error, []);
            return;
        }

        var maxNum = documents.length;
        var logDimondA = documents.map(function (e, index) {
            return {
                DimondAList:maxNum-index||0,
                Player_id:e.Player_id||0,
                DimondASource:e.DimondASource||0,
                DimondANum:e.DimondANum||0,
                DimondATime:TimeUtils.timeFormat(e.DimondATime)||0
            };
        });

        callback(null, logDimondA);
    });
};
//用户充值个人日志
GMService.prototype.getLogRechargeData = function (gmAccount,playerId,startTime,endTime, callback) {
    logger.debug("getLogRechargeData, data: %j", playerId);
    this._gmDao.getLogRechargeData(gmAccount,playerId,startTime,endTime,function (error, documents) {
        if (error || documents.length === 0) {
            callback(error, []);
            return;
        }
        var maxNum = documents.length;
        var logRecharge = documents.map(function (e, index) {
            return {
                RechargeList:maxNum-index||0,
                Player_id:e.Player_id||0,
                RechargeMoney:e.RechargeMoney||0,
                RechargeDitch:e.RechargeDitch||0,
                RechargeTime:TimeUtils.timeFormat(e.RechargeTime)||0
            };
        });

        callback(null, logRecharge);
    });
};
//用户金币获得个人日志
GMService.prototype.getLogGoldAData = function (gmAccount,playerId,startTime,endTime, callback) {
    logger.debug("getLogGoldAData, data: %j", playerId);
    this._gmDao.getLogGoldAData(gmAccount,playerId,startTime,endTime,function (error, documents) {
        if (error || documents.length === 0) {
            callback(error, []);
            return;
        }

        var maxNum = documents.length;
        var logGoldA = documents.map(function (e, index) {
            return {
                GoldAList:maxNum-index||0,
                GoldASource:e.GoldASource||0,
                GoldAGold:e.GoldAGold||0,
                GoldATime:TimeUtils.timeFormat(e.GoldATime)||0
            };
        });

        callback(null, logGoldA);
    });
};

//用户金币消耗个人日志
GMService.prototype.getLogGoldCData = function (gmAccount,playerId,startTime,endTime, callback) {
    logger.debug("getLogGoldCData, data: %j", playerId);
    this._gmDao.getLogGoldCData(gmAccount,playerId,startTime,endTime,function (error, documents) {
        if (error || documents.length === 0) {
            callback(error, []);
            return;
        }

        var maxNum = documents.length;
        var LogGoldC = documents.map(function (e, index) {
            return {
                GoldCList:maxNum-index||0,
                GoldCSYS:e.GoldCSYS||0,
                GoldCGoldNum:e.GoldCGoldNum||0,
                GoldCTime:TimeUtils.timeFormat(e.GoldCTime)||0
            };
        });

        callback(null, LogGoldC);
    });
};
//公告管理
GMService.prototype.getManageAnnouncementData = function (gmAccount,startTime,endTime, callback) {
    logger.debug("getManageAnnouncementData, data: %j", startTime);
    logger.debug("getManageAnnouncementData, data: %j", endTime);
    this._gmDao.getManageAnnouncementData(gmAccount,startTime,endTime,function (error, documents) {
        if (error || documents.length === 0) {
            callback(error, []);
            return;
        }

        var maxNum = documents.length;
        var manageAnnouncement = documents.map(function (e, index) {
            //var announcementState  = "0";
            //if(e.AnnouncementState==1){
            //    announcementState = "激活";
            //}else{
            //    announcementState = "冻结";
            //}
            return {
                AnnouncementList:maxNum-index||0,
                AnnouncementName:e.AnnouncementName||0,
                AnnouncementService: gmAccount.serverId||0,
                AnnouncementCreateTime:TimeUtils.timeFormat(e.AnnouncementCreateTime)||0,
                AnnouncementStartTime:TimeUtils.timeFormat(e.AnnouncementStartTime)||0,
                AnnouncementEndTime:TimeUtils.timeFormat(e.AnnouncementEndTime)||0,
                AnnouncementTitle:e.AnnouncementTitle||0,
                AnnouncementMessage:e.AnnouncementMessage||0,
                AnnouncementState:e.AnnouncementState||0
            };
        });

        callback(null, manageAnnouncement);
    });
};
//取消公告
GMService.prototype.cancelManageAnnouncement = function (gmAccount, AnnouncementState, callback) {
    this._gmDao.cancelManageAnnouncement(gmAccount,AnnouncementState);
    callback(null);
};
//活动管理
GMService.prototype.getManageActivityData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getManageActivityData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find ManageActivity data fail, err=" + err);
                    }
                    logger.debug("getManageActivityData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var manageActivityData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    ManageActivityList:data.activity.ManageActivityList || 0,
                    ManageActivityService:data.activity.ManageActivityService || 0,
                    ManageActivityCreateTime:data.activity.ManageActivityCreateTime || 0,
                    ManageActivityStartTime:data.activity.ManageActivityStartTime || 0,
                    ManageActivityEndTime:data.activity.ManageActivityEndTime || 0,
                    ManageActivityName:data.activity.ManageActivityName || 0,
                    ManageActivityMessage:data.activity.ManageActivityMessage || 0,
                    ManageActivityStatus:data.activity.ManageActivityStatus || 0
                };
                manageActivityData.push(element);
            }
            if (manageActivityData.length === 0) {
                var data = {
                    ManageActivityList:5,
                    ManageActivityService:5,
                    ManageActivityCreateTime:5,
                    ManageActivityStartTime:5,
                    ManageActivityEndTime:5,
                    ManageActivityName:5,
                    ManageActivityMessage:5,
                    ManageActivityStatus:5
                };
                manageActivityData.push(data);
            }
            logger.debug(" : %j", manageActivityData)
            callback(err, manageActivityData);
        }
    );
};
//签到管理
GMService.prototype.getManageSignData = function (gmAccount, callback) {
    var self = this;
    Async.parallel([
            function (cb) {
                self._gmDao.getManageSignData(gmAccount, function (err, data) {
                    if (!data) {
                        logger.error("find ManageSign data fail, err=" + err);
                    }
                    logger.debug("getManageSignData, data: %j", data);
                    cb(err, data);
                });
            }
        ],
        function (err, results) {
            var doc = results[1];
            var manageSignData = [];

            for (var i in doc) {
                var data = doc[i];
                data.activity = data.activity || {};
                var element = {
                    ManageSignName:data.activity.ManageSignName || 0,
                    ManageSignMonth:data.activity.ManageSignMonth || 0,
                    ManageSignService:data.activity.ManageSignService || 0,
                    ManageSignDitch:data.activity.ManageSignDitch || 0,
                    ManageSignSatus:data.activity.ManageSignSatus || 0
                };
                manageSignData.push(element);
            }
            if (manageSignData.length === 0) {
                var data = {
                    ManageSignName:5,
                    ManageSignMonth:5,
                    ManageSignService:5,
                    ManageSignDitch:5,
                    ManageSignSatus:5
                };
                manageSignData.push(data);
            }
            logger.debug(" : %j", manageSignData)
            callback(err, manageSignData);
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

