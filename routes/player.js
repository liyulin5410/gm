var logger = require('pomelo-logger').getLogger("test", __filename);

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render("account/index", {title : '玩家管理', account: req.gmAccount});
});

router.get('/getAuthorization', function(req, res, next) {
	var gmAccount = req.gmAccount;

	res.json({
		insider : gmAccount.isAdmin || gmAccount.insider,
		sendDiamond : gmAccount.isAdmin || gmAccount.sendDiamond,
		isBeauty : gmAccount.isAdmin || gmAccount.isBeauty,
		isBanToLogin : gmAccount.isAdmin || gmAccount.isBanToLogin,
		isBadGuy : gmAccount.isAdmin || gmAccount.isBadGuy
	});
});

//查询玩家
router.get('/query', function(req, res, next) {
	var sdt = new Date(req.query.startTime);
	var edt = new Date(req.query.endTime);

	var msg = {
		flag: parseInt(req.query.flag),

		option: req.query.option,
		optionValue: parseInt(req.query.optionValue),
		optionValue1: parseInt(req.query.optionValue1),

		timeOption: req.query.timeOption,
		sdt: sdt.getTime(),
		edt: edt.getTime()
	};

	req.app.get("gmService").getAccounts(req.gmAccount, msg,function(error, document) {
			if(document && document.length){
				logger.debug("/query, document: %d", document.length);

				res.json(document);
			}else{
				res.status(500).json({error: (error || "get null message")});
			}
		}
	);
});

//获取某个玩家
router.get('/get', function(req, res, next) {
	req.app.get("gmService").getAccountById(req.gmAccount, req.query.playerId, function(error, document) {
			if(document){
				res.json(document);
			}else{
				res.status(500).json({error: (error || "get null message")});
			}
		}
	);
});

//禁止登陆
router.get('/banToLogin', function(req, res, next) {
	res.render("account/index", {title : '玩家管理', account: req.gmAccount});
});

//获取玩家的gm记录
router.get('/gmRecord', function(req, res, next) {
	res.render("account/index", {title : '玩家管理', account: req.gmAccount});
});

//扣除玩家金币
router.get('/cutdown', function(req, res, next) {
	res.render("account/index", {title : '玩家管理', account: req.gmAccount});
});



module.exports = router;