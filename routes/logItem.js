/**
 * Created by Administrator on 2016/3/17.
 * 道具使用日志
 */
var logger = require('pomelo-logger').getLogger("test", __filename);

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render("account/index", {title : '道具使用日志', account : req.gmAccount});
});


router.get('/board', function(req, res, next) {
    req.app.get("gmService").getLogItemData(req.gmAccount, function(error, document) {
        if(document.length){
            res.json(document);
        }else{
            res.status(500).json({error: "get null message"});
        }
    });
});


module.exports = router;