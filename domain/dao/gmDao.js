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

//全服查询玩家信息总览
GMDao.prototype.getMessagepandectData = function (gmAccount, callback) {


    this._dbManager.getGmDbClient(gmAccount.serverId).collection("messagepandect", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }

        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }

            callback(null, documents)
        });
    });
};

//查询玩家信息
GMDao.prototype.getMessageplayerData = function (gmAccount, callback) {


    this._dbManager.getGmDbClient(gmAccount.serverId).collection("messageplayer", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }

        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }

            callback(null, documents)
        });
    });
};
//查询玩家信息
GMDao.prototype.getLogPlayerData = function (gmAccount, callback) {


    this._dbManager.getGmDbClient(gmAccount.serverId).collection("logplayer", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }

        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }

            callback(null, documents)
        });
    });
};
//体力消耗日志
GMDao.prototype.getLogpowerData = function (gmAccount, callback) {


    this._dbManager.getGmDbClient(gmAccount.serverId).collection("logpower", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }

        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }

            callback(null, documents)
        });
    });
};
//关卡数据个人日志
GMDao.prototype.getLogPVEData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("logPVE", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//关卡数据全服统计
GMDao.prototype.getLogPVESData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("logPVES", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//竞技塔个人爬塔日志
GMDao.prototype.getLogPVAData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("logPVA", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//竞技塔爬塔日志
GMDao.prototype.getLogPVASData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("logPVAS", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//周赛场个人日志
GMDao.prototype.getLogPVPData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("logPVP", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//周赛场日志
GMDao.prototype.getLogPVPSData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("logPVPS", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//无尽boss个人日志
GMDao.prototype.getLogPVBData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("logPVB", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//无尽boss全服日志
GMDao.prototype.getLogPVBSData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("logPVBS", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//账号签到领取日志
GMDao.prototype.getLogSignSData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("logSignS", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//邮件全服日志
GMDao.prototype.getLogMailSData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogMailS", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//邮件日志
GMDao.prototype.getLogMailData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogMail", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//英雄成长日志训练日志
GMDao.prototype.getLogHeroData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogHero", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//英雄成长日志升星日志
GMDao.prototype.getLogWeaponData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogWeapon", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//武器成长日志强化日志
GMDao.prototype.getLogWeaponIntensifyData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogWeaponIntensify", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//武器成长日志升星日志
GMDao.prototype.getLogWeaponStarData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogWeaponStar", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//武器成长日志进阶日志
GMDao.prototype.getLogWeaponAdvanceData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogWeaponAdvance", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//任务交付日志
GMDao.prototype.getLogTaskData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogTask", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//能量卡购买个人日志
GMDao.prototype.getLogEergyData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogEergy", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//能量卡购买全服日志
GMDao.prototype.getLogEergySData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogEergyS", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//道具使用日志
GMDao.prototype.getLogItemData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogItem", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//道具消耗全服日志
GMDao.prototype.getLogItemSData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogItemS", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//活动参与日志
GMDao.prototype.getLogActivityData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogActivity", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//礼包领取日志
GMDao.prototype.getLogGiftData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogGift", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//商店购买个人日志
GMDao.prototype.getLogShopData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogShop", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//商店购买日志总览
GMDao.prototype.getLogShopSData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogShopS", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//用户钻石花费记录
GMDao.prototype.getLogDimondCData = function (gmAccount,playerId,startTime,endTime, callback) {
    var sdt = new Date(startTime);
    sdt.setHours(0, 0, 0, 0);

    var edt = new Date(endTime);
    edt.setHours(23, 59, 59, 999);
    logger.debug("getLogDimondAData, data: %j", sdt);
    logger.debug("getLogDimondAData, data: %j", edt);
    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogDimondC", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        if(playerId==""){
            collection.find({
                'DimondCTime': {$gte: sdt, $lte: edt}
            }).sort({DimondCTime: -1}).toArray(function (error, documents) {
                logger.debug("documents, data: %j", documents);
                callback(error, documents)
            });
        }else{
            collection.find({
                'Player_id': playerId,
                'DimondCTime': {$gte: sdt, $lte: edt}
            }).sort({DimondCTime: -1}).toArray(function (error, documents) {
                logger.debug("documents, data: %j", documents);
                callback(error, documents)
            });
        }
    });
};
//用户钻石花费记录
GMDao.prototype.getLogDimondAData = function (gmAccount,playerId,startTime,endTime, callback) {
    logger.debug("getLogDimondAData, data: %j", playerId);

    var sdt = new Date(startTime);
    sdt.setHours(0, 0, 0, 0);

    var edt = new Date(endTime);
    edt.setHours(23, 59, 59, 999);
    logger.debug("getLogDimondAData, data: %j", sdt);
    logger.debug("getLogDimondAData, data: %j", edt);
    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogDimondA", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        if(playerId==""){
            collection.find({
                'DimondATime': {$gte: sdt, $lte: edt}
            }).sort({DimondATime: -1}).toArray(function (error, documents) {
                logger.debug("documents, data: %j", documents);
                callback(error, documents)
            });
        }else{
            collection.find({
                'Player_id': playerId,
                'DimondATime': {$gte: sdt, $lte: edt}
            }).sort({DimondATime: -1}).toArray(function (error, documents) {
                logger.debug("documents, data: %j", documents);
                callback(error, documents)
            });
        }
    });
};
//用户充值个人日志
GMDao.prototype.getLogRechargeData = function (gmAccount,playerId,startTime,endTime, callback) {
    var sdt = new Date(startTime);
    sdt.setHours(0, 0, 0, 0);

    var edt = new Date(endTime);
    edt.setHours(23, 59, 59, 999);
    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogRecharge", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        if(playerId==""){
            collection.find({
                'RechargeTime': {$gte: sdt, $lte: edt}
            }).sort({RechargeTime: -1}).toArray(function (error, documents) {
                logger.debug("documents, data: %j", documents);
                callback(error, documents)
            });
        }else{
            collection.find({
                'Player_id': playerId,
                'RechargeTime': {$gte: sdt, $lte: edt}
            }).sort({RechargeTime: -1}).toArray(function (error, documents) {
                logger.debug("documents, data: %j", documents);
                callback(error, documents)
            });
        }
    });
};
//用户金币获得个人日志
GMDao.prototype.getLogGoldAData = function (gmAccount,playerId,startTime,endTime,callback) {
    logger.debug("getLogGoldAData, data: %j", playerId);
    var sdt = new Date(startTime);
    sdt.setHours(0, 0, 0, 0);

    var edt = new Date(endTime);
    edt.setHours(23, 59, 59, 999);
    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogGoldA", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        if(playerId==""){
            collection.find({
                'GoldATime': {$gte: sdt, $lte: edt}
            }).sort({GoldATime: -1}).toArray(function (error, documents) {
                logger.debug("documents, data: %j", documents);
                callback(error, documents)
            });
        }else{
            collection.find({
                'Player_id': playerId,
                'GoldATime': {$gte: sdt, $lte: edt}
            }).sort({GoldATime: -1}).toArray(function (error, documents) {
                logger.debug("documents, data: %j", documents);
                callback(error, documents)
            });
        }
    });
};
//用户金币消耗个人日志
GMDao.prototype.getLogGoldCData = function (gmAccount,playerId,startTime,endTime, callback) {
    var sdt = new Date(startTime);
    sdt.setHours(0, 0, 0, 0);

    var edt = new Date(endTime);
    edt.setHours(23, 59, 59, 999);
    this._dbManager.getGmDbClient(gmAccount.serverId).collection("LogGoldC", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        if(playerId==""){
            collection.find({
                'GoldCTime': {$gte: sdt, $lte: edt}
            }).sort({GoldCTime: -1}).toArray(function (error, documents) {
                logger.debug("documents, data: %j", documents);
                callback(error, documents)
            });
        }else{
            collection.find({
                'Player_id': playerId,
                'GoldCTime': {$gte: sdt, $lte: edt}
            }).sort({GoldCTime: -1}).toArray(function (error, documents) {
                logger.debug("documents, data: %j", documents);
                callback(error, documents)
            });
        }
    });
};
//公告管理
GMDao.prototype.getManageAnnouncementData = function (gmAccount,startTime,endTime, callback) {
    var sdt = new Date(startTime);
    sdt.setHours(0, 0, 0, 0);

    var edt = new Date(endTime);
    edt.setHours(23, 59, 59, 999);
    this._dbManager.getGmDbClient(gmAccount.serverId).collection("ManageAnnouncement", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'AnnouncementCreateTime': {$gte: sdt, $lte: edt}
        }).sort({AnnouncementCreateTime: -1}).toArray(function (error, documents) {
            logger.debug("documents, data: %j", documents);
            callback(error, documents)
        });
    });
};
//取消公告
GMDao.prototype.cancelManageAnnouncement = function (gmAccount,AnnouncementState) {
    this._dbManager.getGmDbClient(gmAccount.serverId).collection('ManageAnnouncement', function (error, collection) {
        if (!!error) {
            return;
        }
        collection.update( {
            $set: {
                AnnouncementState: AnnouncementState
            }
        }, {
            safe: true
        }, function (error) {
        });
    });
};


//活动管理
GMDao.prototype.getManageActivityData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("ManageActivity", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
        }).sort({dt: -1}).toArray(function (error, documents) {
            if (!!error) {
                callback(error);
                return;
            }
            callback(null, documents)
        });
    });
};
//签到管理
GMDao.prototype.getManageSignData = function (gmAccount, callback) {

    this._dbManager.getGmDbClient(gmAccount.serverId).collection("ManageSign", function (error, collection) {
        if (!!error) {
            callback(error);
            return;
        }
        collection.find({
            'dt': {}
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

        collection.find({}).sort({createTime: -1}).limit(50).toArray(function (error, documents) {
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