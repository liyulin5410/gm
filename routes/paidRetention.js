/**
 * Created by shine on 2015/9/6.
 */
var logger = require('pomelo-logger').getLogger("test", __filename);

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render("account/index", {title : '充值日留存率', account: req.gmAccount});
});

router.get('/stats', function(req, res, next) {
	req.app.get("gmService").getPaidRetentionData(req.gmAccount, req.query.starttime, req.query.endtime, function(error, document) {
		if(document.length){
			res.json(document);
		}else{
			res.status(500).json({error: "get null message"});
		}
	});
});

module.exports = router;
