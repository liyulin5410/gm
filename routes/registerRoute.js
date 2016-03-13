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
