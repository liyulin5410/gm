var GmAccount = function () {
    this.isAdmin = 0;

    this.name = "";
    this.password = "";
    this.remark = "";

    this.board = 0;
    this.arpu = 0;
    this.retention = 0;
    this.paidRetention = 0;
    this.announce = 0;
    this.player = 0;
    this.robot = 0;
    this.diamond = 0;
    this.gamingMoney = 0;
    this.insiderGamingMoney = 0;
    this.cdKey = 0;
    this.cdKeyOrder = 0;
    this.coupon = 0;
    this.present = 0;
    this.systemAction = 0;
    this.feedback = 0;
    this.presentExchange = 0;
    this.recharge = 0;
    this.cards = 0;
    this.channel = 0;
    this.poker = 0;
    this.accountAnnounce = 0;
    this.beauty = 0;
    this.activity = 0;
    this.authorization = 0;
    this.p2pMessage = 0;
    this.insider = 0;
    this.sendDiamond = 0;
    this.isBeauty = 0;
    this.isBanToLogin = 0;
    this.isBadGuy = 0;
    this.rechargeAmount = 0;
    this.blessing = 0;
};

GmAccount.prototype.setIsAdmin = function (isAdmin) {
    this.isAdmin = isAdmin;
};

GmAccount.prototype.setName = function (name) {
    this.name = name;
};

GmAccount.prototype.setPassword = function (password) {
    this.password = password;
};

GmAccount.prototype.setRemark = function (remark) {
    this.remark = remark;
};

GmAccount.prototype.setBoard = function (board) {
    this.board = board;
};

GmAccount.prototype.setArpu = function (arpu) {
    this.arpu = arpu;
};

GmAccount.prototype.setRetention = function (retention) {
    this.retention = retention;
};

GmAccount.prototype.setPaidRetention = function (paidRetention) {
    this.paidRetention = paidRetention;
};

GmAccount.prototype.setAnnounce = function (announce) {
    this.announce = announce;
};

GmAccount.prototype.setPlayer = function (player) {
    this.player = player;
};

GmAccount.prototype.setRobot = function (robot) {
    this.robot = robot;
};

GmAccount.prototype.setDiamond = function (diamond) {
    this.diamond = diamond;
};

GmAccount.prototype.setGamingMoney = function (gamingMoney) {
    this.gamingMoney = gamingMoney;
};

GmAccount.prototype.setInsiderGamingMoney = function (insiderGamingMoney) {
    this.insiderGamingMoney = insiderGamingMoney;
};

GmAccount.prototype.setCdKey = function (cdKey) {
    this.cdKey = cdKey;
};

GmAccount.prototype.setCdKeyOrder = function (cdKeyOrder) {
    this.cdKeyOrder = cdKeyOrder;
};

GmAccount.prototype.setCoupon = function (coupon) {
    this.coupon = coupon;
};

GmAccount.prototype.setPresent = function (present) {
    this.present = present;
};

GmAccount.prototype.setSystemAction = function (systemAction) {
    this.systemAction = systemAction;
};

GmAccount.prototype.setFeedBack = function (feedback) {
    this.feedback = feedback;
};

GmAccount.prototype.setPresentExchange = function (presentExchange) {
    this.presentExchange = presentExchange;
};

GmAccount.prototype.setRecharge = function (recharge) {
    this.recharge = recharge;
};

GmAccount.prototype.setCards = function (cards) {
    this.cards = cards;
};

GmAccount.prototype.setChannel = function (channel) {
    this.channel = channel;
};

GmAccount.prototype.setPoker = function (poker) {
    this.poker = poker;
};

GmAccount.prototype.setAccountAnnounce = function (accountAnnounce) {
    this.accountAnnounce = accountAnnounce;
};

GmAccount.prototype.setBeauty = function (beauty) {
    this.beauty = beauty;
};

GmAccount.prototype.setActivity = function (activity) {
    this.activity = activity;
};

GmAccount.prototype.setAuthorization = function (authorization) {
    this.authorization = authorization;
};

GmAccount.prototype.setP2PMessage = function (p2pMessage) {
    this.p2pMessage = p2pMessage;
};

GmAccount.prototype.setInsider = function (insider) {
    this.insider = insider;
};

GmAccount.prototype.setSendDiamond = function (sendDiamond) {
    this.sendDiamond = sendDiamond;
};

GmAccount.prototype.setIsBeauty = function (beauty) {
    this.isBeauty = beauty;
};

GmAccount.prototype.setIsBadGuy = function (isBadGuy) {
    this.isBadGuy = isBadGuy;
};

GmAccount.prototype.setIsBanToLogin = function (isBanToLogin) {
    this.isBanToLogin = isBanToLogin;
};

GmAccount.prototype.setRechargeAmount = function (amount) {
    this.rechargeAmount = amount;
};

GmAccount.prototype.setBlessing = function (blessing) {
    this.blessing = blessing;
};

module.exports.createGmAccount = function () {
    return new GmAccount();
};