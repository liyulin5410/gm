/**
 * Created by shine on 2015/8/17.
 */
var logger = require('pomelo-logger').getLogger("test", __filename);

exports.create = function (app) {
    app.use('/', require("./index"));

    app.use(function (req, res, next) {
        var username = req.session && req.session.user && req.session.user.username;
        if (username) {
            req.gmAccount = req.app.get("gmService").getGmAccount(username);
        }

        next();
    });

    app.use(Authenticated);

    app.use("/account", require("./account"));	//数据总览
    app.use("/arpu", require("./arpu"));	//日关键数据
    app.use("/retention", require("./retention"));	//日留存率
    app.use("/paidRetention", require("./paidRetention"));	//充值日留存率

    app.use("/announce", require("./announce"));	//系统公告
    app.use("/mail", require("./mail"));	//邮件

    app.use("/player", require("./player"));		//玩家管理
    app.use("/robot", require("./robot"));			//系统设置
    app.use("/diamond", require("./diamond"));		//日钻石充值/消耗
    app.use("/gamingMoney", require("./gamingMoney"));	//日金币产出/消耗

    app.use("/cdkey", require("./cdkey"));	//CDKEY
    app.use("/cdkey/Order", require("./cdkeyOrder"));	//CDKEY充值
    app.use("/action", require("./action"));	//系统操作
    app.use("/feedback", require("./feedback"));	//意见反馈
    app.use("/accountAnnounce", require("./accountAnnounce"));	//查看广播
    app.use("/activity", require("./activity"));	//限时活动
    app.use("/authorization", require("./authorization"));	//用户权限管理
    app.use("/messagepandect", require("./messagepandect")); //全服查询玩家信息总览
    app.use("/messageplayer", require("./messageplayer")); //查询玩家信息
    app.use("/logplayer", require("./logplayer")); //帐号创建登陆登出日志
    app.use("/logpower", require("./logpower")); //体力消耗日志
    app.use("/logPVE", require("./logPVE")); //关卡数据个人日志
    app.use("/logPVES", require("./logPVES")); //关卡数据全服统计
    app.use("/logPVA", require("./logPVA")); //竞技塔个人爬塔日志
    app.use("/logPVAS", require("./logPVAS")); //竞技塔爬塔日志
    app.use("/logPVP", require("./logPVP")); //周赛场个人日志
    app.use("/logPVPS", require("./logPVPS")); //周赛场日志
    app.use("/logPVB", require("./logPVB")); //无尽boss个人日志
    app.use("/logPVBS", require("./logPVBS")); //无尽boss全服日志
    app.use("/logSignS", require("./logSignS")); //账号签到领取日志
    app.use("/logMailS", require("./logMailS")); //邮件全服日志
    app.use("/logMail", require("./logMail")); //收取个人邮件
    app.use("/logHero", require("./logHero")); //英雄成长日志
    app.use("/logWeapon", require("./logWeapon")); //武器成长日志
    app.use("/logTask", require("./logTask")); //任务交付日志
    app.use("/logEergy", require("./logEergy")); //能量卡购买个人日志
    app.use("/logEergyS", require("./logEergyS")); //能量卡购买全服日志
    app.use("/logItem", require("./logItem")); //道具使用日志
    app.use("/logItemS", require("./logItemS")); //道具消耗全服日志
    app.use("/logActivity", require("./logActivity")); //活动参与日志
    app.use("/logGift", require("./logGift")); //礼包领取日志
    app.use("/logShop", require("./logShop")); //商店购买个人日志
    app.use("/logShopS", require("./logShopS")); //商店购买日志总览
    app.use("/logDimondC", require("./logDimondC")); //用户钻石花费记录
    app.use("/logDimondA", require("./logDimondA")); //用户钻石获得个人日志
    app.use("/logRecharge", require("./logRecharge")); //用户充值个人日志
    app.use("/logGoldA", require("./logGoldA")); //用户金币获得个人日志
    app.use("/logGoldC", require("./logGoldC")); //用户金币消耗个人日志
    app.use("/manageAnnouncement", require("./manageAnnouncement")); //公告管理
    app.use("/manageActivity", require("./manageActivity")); //活动管理
    app.use("/manageSign", require("./manageSign")); //签到管理
};

var Authenticated = function (req, res, next) {
    logger.debug("Authenticated, path: %s, method: %s, body: %j, query: %j", req.path, req.method, req.body, req.query);

    if (req.gmAccount) {
        var gmService = req.app.get("gmService");

        var index = req.url.indexOf('?');
        var url = req.url;

        if (index !== -1) {
            url = req.url.slice(0, index);
        }

        gmService.checkAuthorization(req.gmAccount, url, function (isOk) {
            if (isOk) {
                next();
            } else {
                res.redirect("/");
            }
        });
    } else {
        res.redirect("/");
    }
};
