var logger = require('pomelo-logger').getLogger("test", __filename);
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    req.app.get("gmService").getItems(req.gmAccount, function (err, items) {
        if (err) {
            logger.error(err);
        }

        res.render("account/index", {
            title: '邮件管理',
            account: req.gmAccount,
            items: JSON.stringify(items)
        });
    });
});

/**
 * 获取所有由gm发送的邮件
 */
router.get('/get', function (req, res) {
    req.app.get("gmService").getMails(req.gmAccount, function (error, document) {
            if (!!error) {
                res.status(500).json({error: error});
            } else {
                res.json(document);
            }
        }
    );
});

router.post('/new', function (req, res) {
    // 检查参数
    if (!req.body.title || !req.body.sendTime) {
        res.status(500).json({error: "invalid param"});
        return;
    }

    if (!parseInt(req.body.sendTime)) {
        res.status(500).json({error: "invalid time param"});
        return;
    }

    // 转换字符串到数字
    req.body.sendTime = new Date(req.body.sendTime).getTime();

    // 从数据库中读取item代表的物品，转换成game-server的格式
    if (req.body.item) {
        req.body.item.id = parseInt(req.body.item.id);
        req.body.item.count = parseInt(req.body.item.count);
        if (isNaN(req.body.item.id) || isNaN(req.body.item.count)) {
            // 输入的item有误，不是数字
            res.status(500).json({error: 'invalid item param'});
            return;
        }
    } else {
        res.status(500).json({error: "invalid item param"});
        return;
    }

    req.app.get("gmService").insertMail(req.gmAccount, {
            title: req.body.title,
            message: req.body.message,
            sendTime: req.body.sendTime,
            createTime: Date.now(),
            endTime: req.body.sendTime + 7 * 24 * 60 * 60 * 1000,
            state: '未发送',
            items: req.body.item
        }, function (error, mails) {
            if (!!error) {
                res.status(500).json({error: error});
            } else {
                res.json(mails);
            }
        }
    );
});

module.exports = router;