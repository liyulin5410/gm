function treeNavigation(account) {
	gmHead(gmAccount);
    var tree1 = Ext.create("Ext.tree.Panel", {
        width: 190,
        height: "auto",
        border:false,
        collapsible:true,
        root: {
            text: "点点游戏",
            expanded: true
        }
    });

    var root = tree1.getRootNode();
    if (account.isAdmin || account.board) {
        root.appendChild({
            text: "数据总览",
            leaf: true,
            href: "http://" + window.location.host + "/account"
        });
    }

    if (account.isAdmin || account.arpu) {
        root.appendChild({
            text: "日关键数据",
            leaf: true,
            href: "http://" + window.location.host + "/arpu"
        });
    }

    if (account.isAdmin || account.retention) {
        root.appendChild({
            text: "日留存率",
            leaf: true,
            href: "http://" + window.location.host + "/retention"
        });
    }
    if (account.isAdmin || account.paidRetention) {
        root.appendChild({
            text: "充值日留存率",
            leaf: true,
            href: "http://" + window.location.host + "/paidRetention"
        });
    }

    if (account.isAdmin || account.announce) {
        root.appendChild({
            text: "系统公告",
            leaf: true,
            href: "http://" + window.location.host + "/announce"
        });
    }

    if (account.isAdmin || account.mail) {
        root.appendChild({
            text: "邮件管理",
            leaf: true,
            href: "http://" + window.location.host + "/mail"
        });
    }

    if (account.isAdmin || account.player) {
        root.appendChild({
            text: "玩家管理",
            leaf: true,
            href: "http://" + window.location.host + "/player"
        });
    }

    if (account.isAdmin || account.robot) {
        root.appendChild({
            text: "系统设置",
            leaf: true,
            href: "http://" + window.location.host + "/robot"
        });
    }

    if (account.isAdmin || account.diamond) {
        root.appendChild({
            text: "日钻石充值/消耗",
            leaf: true,
            href: "http://" + window.location.host + "/diamond"
        });
    }

    if (account.isAdmin || account.gamingMoney) {
        root.appendChild({
            text: "日金币产出/消耗",
            leaf: true,
            href: "http://" + window.location.host + "/gamingMoney"
        });
    }

    if (account.isAdmin || account.cdKey) {
        root.appendChild({
            text: "CDKEY",
            leaf: true,
            href: "http://" + window.location.host + "/CDKEY"
        });
    }

    if (account.isAdmin || account.cdKeyOrder) {
        root.appendChild({
            text: "CDKEY统计",
            leaf: true,
            href: "http://" + window.location.host + "/CDKEY/order"
        });
    }


    if (account.isAdmin || account.systemAction) {
        root.appendChild({
            text: "系统操作",
            leaf: true,
            href: "http://" + window.location.host + "/action"
        });
    }

    if (account.isAdmin || account.feedback) {
        root.appendChild({
            text: "意见反馈",
            leaf: true,
            href: "http://" + window.location.host + "/feedback"
        });
    }

    if (account.isAdmin || account.accountAnnounce) {
        root.appendChild({
            text: "查看广播",
            leaf: true,
            href: "http://" + window.location.host + "/accountAnnounce"
        });
    }

    if (account.isAdmin || account.activity) {
        root.appendChild({
            text: "限时活动",
            leaf: true,
            href: "http://" + window.location.host + "/activity"
        });
    }

    if (account.isAdmin || account.authorization) {
        root.appendChild({
            text: "用户权限管理",
            leaf: true,
            href: "http://" + window.location.host + "/authorization"
        });
    }

    var totalPanel = new Ext.Panel({
        width: 'auto',
        height: document.documentElement.clientHeight,
        items: [
            tree1
        ]
    });

    totalPanel.render('navigation');
}

