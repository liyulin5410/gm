function treeNavigation(account) {
	gmHead(gmAccount);
    var Message = Ext.create("Ext.tree.Panel", {
        width: 190,
        height: "auto",
        border:false,
        //collapsible:true,
        root: {
            text: "基本帐号状态信息查询",
            expanded: true

        }
    });
    var Log = Ext.create("Ext.tree.Panel", {
        width: 190,
        height: "auto",
        border:false,
        //collapsible:true,
        root: {
            text: "游戏日志",
            expanded: true
        }
    });
    var Manage = Ext.create("Ext.tree.Panel", {
        width: 190,
        height: "auto",
        border:false,
        //collapsible:true,
        root: {
            text: "运营策略管理",
            expanded: true
        }
    });
    var Analyze = Ext.create("Ext.tree.Panel", {
        width: 190,
        height: "auto",
        border:false,
        //collapsible:true,
        root: {
            text: "数据总览及分析",
            expanded: true
        }
    });
    var message = Message.getRootNode();
    var log = Log.getRootNode();
    var manage = Manage.getRootNode();
    var analyze = Analyze.getRootNode();

    if (account.isAdmin || account.messagepandect) {
        message.appendChild({
            text: "全服查询玩家信息总览",
            leaf: true,
            href: "http://" + window.location.host + "/messagepandect"
        });
    }
    if (account.isAdmin || account.messageplayer) {
        message.appendChild({
            text: "查询玩家信息",
            leaf: true,
            href: "http://" + window.location.host + "/messageplayer"
        });
    }
    if (account.isAdmin || account.logDimondC) {
        log.appendChild({
            text: "用户钻石花费记录",
            leaf: true,
            href: "http://" + window.location.host + "/logDimondC"
        });
    }
    if (account.isAdmin || account.logDimondA) {
        log.appendChild({
            text: "用户钻石获得个人日志",
            leaf: true,
            href: "http://" + window.location.host + "/logDimondA"
        });
    }
    if (account.isAdmin || account.logRecharge) {
        log.appendChild({
            text: "用户充值个人日志",
            leaf: true,
            href: "http://" + window.location.host + "/logRecharge"
        });
    }
    if (account.isAdmin || account.logGoldA) {
        log.appendChild({
            text: "用户金币获得个人日志",
            leaf: true,
            href: "http://" + window.location.host + "/logGoldA"
        });
    }
    if (account.isAdmin || account.logGoldC) {
        log.appendChild({
            text: "用户金币消耗个人日志",
            leaf: true,
            href: "http://" + window.location.host + "/logGoldC"
        });
    }
    //if (account.isAdmin || account.logplayer) {
    //    log.appendChild({
    //        text: "帐号创建登陆登出日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logplayer"
    //    });
    //}
    //if (account.isAdmin || account.logpower) {
    //    log.appendChild({
    //        text: "体力消耗日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logpower"
    //    });
    //}
    //if (account.isAdmin || account.logPVE) {
    //    log.appendChild({
    //        text: "关卡数据个人日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logPVE"
    //    });
    //}
    //if (account.isAdmin || account.logPVES) {
    //    log.appendChild({
    //        text: "关卡数据全服统计",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logPVES"
    //    });
    //}
    //if (account.isAdmin || account.logPVA) {
    //    log.appendChild({
    //        text: "竞技塔个人爬塔日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logPVA"
    //    });
    //}
    //if (account.isAdmin || account.logPVAS) {
    //    log.appendChild({
    //        text: "竞技塔爬塔日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logPVAS"
    //    });
    //}
    //if (account.isAdmin || account.logPVP) {
    //    log.appendChild({
    //        text: "周赛场个人日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logPVP"
    //    });
    //}
    //if (account.isAdmin || account.logPVPS) {
    //    log.appendChild({
    //        text: "周赛场日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logPVPS"
    //    });
    //}
    //if (account.isAdmin || account.logPVB) {
    //    log.appendChild({
    //        text: "无尽boss个人日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logPVB"
    //    });
    //}
    //if (account.isAdmin || account.logPVBS) {
    //    log.appendChild({
    //        text: "无尽boss全服日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logPVBS"
    //    });
    //}
    //if (account.isAdmin || account.logSignS) {
    //    log.appendChild({
    //        text: "账号签到领取日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logSignS"
    //    });
    //}
    //if (account.isAdmin || account.logMailS) {
    //    log.appendChild({
    //        text: "邮件全服日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logMailS"
    //    });
    //}
    //if (account.isAdmin || account.logMail) {
    //    log.appendChild({
    //        text: "收取个人邮件",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logMail"
    //    });
    //}
    //if (account.isAdmin || account.logHero) {
    //    log.appendChild({
    //        text: "英雄成长日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logHero"
    //    });
    //}
    //if (account.isAdmin || account.logWeapon) {
    //    log.appendChild({
    //        text: "武器成长日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logWeapon"
    //    });
    //}
    //if (account.isAdmin || account.logTask) {
    //    log.appendChild({
    //        text: "任务交付日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logTask"
    //    });
    //}
    //if (account.isAdmin || account.logEergy) {
    //    log.appendChild({
    //        text: "能量卡购买个人日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logEergy"
    //    });
    //}
    //if (account.isAdmin || account.logEergyS) {
    //    log.appendChild({
    //        text: "能量卡购买全服日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logEergyS"
    //    });
    //}
    //if (account.isAdmin || account.logItem) {
    //    log.appendChild({
    //        text: "道具使用日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logItem"
    //    });
    //}
    //if (account.isAdmin || account.logItemS) {
    //    log.appendChild({
    //        text: "道具消耗全服日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logItemS"
    //    });
    //}
    //if (account.isAdmin || account.logActivity) {
    //    log.appendChild({
    //        text: "活动参与日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logActivity"
    //    });
    //}
    //if (account.isAdmin || account.logGift) {
    //    log.appendChild({
    //        text: "礼包领取日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logGift"
    //    });
    //}
    //if (account.isAdmin || account.logShop) {
    //    log.appendChild({
    //        text: "商店购买个人日志",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logShop"
    //    });
    //}
    //if (account.isAdmin || account.logShopS) {
    //    log.appendChild({
    //        text: "商店购买日志总览",
    //        leaf: true,
    //        href: "http://" + window.location.host + "/logShopS"
    //    });
    //}


    if (account.isAdmin || account.manageAnnouncement) {
        manage.appendChild({
            text: "公告管理",
            leaf: true,
            href: "http://" + window.location.host + "/manageAnnouncement"
        });
    }
    if (account.isAdmin || account.manageActivity) {
        manage.appendChild({
            text: "活动管理",
            leaf: true,
            href: "http://" + window.location.host + "/manageActivity"
        });
    }
    if (account.isAdmin || account.manageSign) {
        manage.appendChild({
            text: "签到管理",
            leaf: true,
            href: "http://" + window.location.host + "/manageSign"
        });
    }
    if (account.isAdmin || account.ManageMail) {
        manage.appendChild({
            text: "邮件管理",
            leaf: true,
            href: "http://" + window.location.host + "/ManageMail"
        });
    }
    if (account.isAdmin || account.ManagePlayer) {
        manage.appendChild({
            text: "玩家账号管理",
            leaf: true,
            href: "http://" + window.location.host + "/ManagePlayer"
        });
    }
    if (account.isAdmin || account.ManageGift) {
        manage.appendChild({
            text: "礼包管理",
            leaf: true,
            href: "http://" + window.location.host + "/ManageGift"
        });
    }



    if (account.isAdmin || account.AnalyzePandect) {
        analyze.appendChild({
            text: "新增和启动",
            leaf: true,
            href: "http://" + window.location.host + "/AnalyzePandect"
        });
    }
    if (account.isAdmin || account.AnalyzeRemain) {
        analyze.appendChild({
            text: "用户留存",
            leaf: true,
            href: "http://" + window.location.host + "/AnalyzeRemain"
        });
    }
    if (account.isAdmin || account.AnalyzeTime) {
        analyze.appendChild({
            text: "时段数据",
            leaf: true,
            href: "http://" + window.location.host + "/AnalyzeTime"
        });
    }
    if (account.isAdmin || account.AnalyzeRegion) {
        analyze.appendChild({
            text: "版本分布",
            leaf: true,
            href: "http://" + window.location.host + "/AnalyzeRegion"
        });
    }
    if (account.isAdmin || account.AnalyzeOperator) {
        analyze.appendChild({
            text: "运营商和网络",
            leaf: true,
            href: "http://" + window.location.host + "/AnalyzeOperator"
        });
    }
    if (account.isAdmin || account.AnalyzePlayer) {
        analyze.appendChild({
            text: "渠道用户数据",
            leaf: true,
            href: "http://" + window.location.host + "/AnalyzePlayer"
        });
    }
    if (account.isAdmin || account.AnalyzeRMB) {
        analyze.appendChild({
            text: "渠道用户付费转化数据",
            leaf: true,
            href: "http://" + window.location.host + "/AnalyzeRMB"
        });
    }
    if (account.isAdmin || account.AnalyzeRMBHabit) {
        analyze.appendChild({
            text: "付费习惯",
            leaf: true,
            href: "http://" + window.location.host + "/AnalyzeRMBHabit"
        });
    }
    if (account.isAdmin || account.AnalyzeChange) {
        analyze.appendChild({
            text: "计费转化",
            leaf: true,
            href: "http://" + window.location.host + "/AnalyzeChange"
        });
    }





/*



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

    if (account.isAdmin || account.props) {
        root.appendChild({
            text: "日道具购买/消耗",
            leaf: true,
            href: "http://" + window.location.host + "/props"
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
*/
    var totalPanel = new Ext.Panel({
        width: 'auto',
        height: document.documentElement.clientHeight,
        autoScroll:true,
        items: [
            Message,
            Log,
            Manage,
            Analyze
        ]
    });

    totalPanel.render('navigation');
}

