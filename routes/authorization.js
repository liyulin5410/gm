/**
 * Created by shine on 2015/9/6.
 */
var logger = require('pomelo-logger').getLogger("test", __filename);

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render("account/index", {title : '用户权限管理', account: req.gmAccount});
});

router.get('/getAccounts', function(req, res, next) {
	res.json();
});


module.exports = router;
