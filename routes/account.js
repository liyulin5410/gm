/**
 * Created by shine on 2015/9/6.
 */
var logger = require('pomelo-logger').getLogger("test", __filename);

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render("account/index", {title : '数据总览', account : req.gmAccount, app: req.app});
});

router.post('/setGmQuery', function(req, res, next) {
	req.app.get("gmService").setGmQuery(req.gmAccount, parseInt(req.body.serverId), req.body.appId, req.body.operator);
	res.json({resultCode: 200});
});

router.get('/board', function(req, res, next) {
	req.app.get("gmService").getBoardData(req.gmAccount, req.query.endtime, req.query.endtime, function(error, document) {
		if(document.length){
			res.json(document);
		}else{
			res.status(500).json({error: "get null message"});
		}
	});
});


module.exports = router;


