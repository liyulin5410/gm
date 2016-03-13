var logger = require('pomelo-logger').getLogger("test", __filename);

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
	logger.debug("method: %s, ip: %s, session: %j, body: %j, query: %j", req.path, req.ip, req.session, req.body, req.query);

	if (req.body.username) {
		req.app.get("gmService").findGmAccount(req.body.username, req.body.password, function (isOk, plat) {
			logger.debug("findGmAccount, isOk: %s, plat: %s", isOk, plat);

			if (isOk) {
				req.session.user = {username: req.body.username, password: req.body.password};
				res.redirect(plat);
			} else {
				res.render("login", {title : "用户登陆", errorMessage : "密码错误"});
			}
		});
	} else {
		res.render("login", {title : "用户登陆", errorMessage : "密码错误"});
	}
});


router.post('/setClosing', function(req, res, next) {
	var isClosing = parseInt(req.body.isClosing) === 0 ? false : true;

	req.app.get("gmService").setClosing(req.gmAccount, isClosing, function (error) {
		res.json({resultCode: (!error ? 200 : 500)});
	});

});

router.get('/getClosing', function(req, res, next) {
	req.app.get("gmService").getClosing(req.gmAccount, function (isClosing) {
		res.json({resultCode: (isClosing ? 200 : 500)});
	});
});


module.exports = router;
