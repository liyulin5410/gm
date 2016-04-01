/**
 * Created by Administrator on 2016/3/17.
 * 武器成长日志
 */
var logger = require('pomelo-logger').getLogger("test", __filename);

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render("account/index", {title : '武器成长日志', account : req.gmAccount});
});


router.get('/Intensify', function(req, res, next) {
    req.app.get("gmService").getLogWeaponIntensifyData(req.gmAccount, function(error, document) {
        if(document.length){
            res.json(document);
        }else{
            res.status(500).json({error: "get null message"});
        }
    });
});
router.get('/Star', function(req, res, next) {
    req.app.get("gmService").getLogWeaponStarData(req.gmAccount, function(error, document) {
        if(document.length){
            res.json(document);
        }else{
            res.status(500).json({error: "get null message"});
        }
    });
});
router.get('/Advance', function(req, res, next) {
    req.app.get("gmService").getLogWeaponAdvanceData(req.gmAccount, function(error, document) {
        if(document.length){
            res.json(document);
        }else{
            res.status(500).json({error: "get null message"});
        }
    });
});


module.exports = router;