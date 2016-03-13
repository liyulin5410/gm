/**
 * Created by shine on 2015/9/10.
 */
var logger = require('pomelo-logger').getLogger("test", __filename);

exports.create = function (dbManager) {
	return new PlayerDao(dbManager);
};

var PlayerDao = function (dbManager) {
	this._dbManager = dbManager;
	this._webDbClient = dbManager.getWebDbClient();
};


PlayerDao.prototype.combinedQueryAccounts = function(gmAccount, condition, sortCondition, callback) {
	this._dbManager.getGameDbClient(gmAccount.serverId).collection('player', function(error, collection) {
		if ( !! error) {
			callback(error, null);
			return;
		}

		collection.find(condition, {
			_id: 0,
			playerId: 1,
			username: 1,
			nickname: 1
		}).sort(sortCondition).toArray(function(error, docs){
			if ( !! error) {
				callback(error, null);
				return;
			}

			callback(null, docs);
		});
	});
};

PlayerDao.prototype.getAccount = function(gmAccount, condition, callback) {
	this._dbManager.getGameDbClient(gmAccount.serverId).collection('player', function(error, collection) {
		if ( !! error) {
			callback(error, null);
			return;
		}

		collection.findOne(condition, function(error, document) {
			if ( !! error) {
				callback(error, null);
				return;
			}

			logger.debug("getAccount, condition: %j, doc: %j", condition, document);

			callback(null, document);
		});

	});
};
