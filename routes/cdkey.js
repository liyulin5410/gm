/**
 * Created by shine on 2015/9/6.
 */
var logger = require('pomelo-logger').getLogger("test", __filename);

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render("account/index", {title : 'CDKEY', account: req.gmAccount});
});

router.get('/batch', function(req, res, next) {
	res.json();
});

module.exports = router;
