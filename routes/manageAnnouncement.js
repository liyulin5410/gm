/**
 * Created by Administrator on 2016/3/22.
 * 公告管理
 */
var logger = require('pomelo-logger').getLogger("test", __filename);
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render("account/index", {
        title: '公告管理',
        account: req.gmAccount
    });
});

//获取公告
router.get('/get', function (req, res, next) {
    logger.debug("req.query.startTime, data: %j",req.query.startTime );
    req.app.get("gmService").getManageAnnouncementData(req.gmAccount,req.query.startTime,req.query.endTime, function (error, document) {
            if (!!error) {
                res.status(500).json({error: error});
            } else {
                res.json(document);
            }
        }
    );
});

//添加公告
router.post('/new', function (req, res, next) {
    if (!req.body.message || !req.body.startTime || !req.body.endTime || !req.body.title) {
        res.status(500).json({error: "invalid param"});
        return;
    }

    if (!parseInt(req.body.startTime) || !parseInt(req.body.endTime)) {
        res.status(500).json({error: "invalid time param"});
        return;
    }

    var startTime = new Date(req.body.startTime).getTime();
    var endTime = new Date(req.body.endTime).getTime();

    req.app.get("gmService").insertGMAnnounce(req.gmAccount, req.body.message, startTime, endTime, req.body.title, function (error, document) {
            if (!!error) {
                res.status(500).json({error: error});
            } else {
                res.json(document);
            }
        }
    );
});

//取消公告
router.post('/cancel', function (req, res, next) {
    if (!req.body.AnnouncementState) {
        res.status(500).json({error: "invalid param"});
        return;
    }

    //var createTime = new Date(req.body.createTime);
    //createTime.setMilliseconds(0);

    req.app.get("gmService").cancelManageAnnouncement(req.gmAccount, parseInt(req.body.AnnouncementState), function (error) {
            res.json({resultCode: 200});
        }
    );
});

module.exports = router;