function authorization(){
    createAuthorization();

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/authorization/getAccounts",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            drawAccounts( json );
        },
        failure: function(){
            Ext.Msg.alert("错误", "没有找到相关记录");
        }
    });
};

function drawAccounts( dataFromServer ){
    var datas = [];
    for (var i in dataFromServer) {
        datas.push(dataFromServer[i]);
    }

    Ext.getDom('search_player').innerHTML = '';
    Ext.getDom('player_info').innerHTML = '';
    Ext.getDom('player_data').innerHTML = '';

    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'isAdmin', type:'string'},
            {name: 'name', type:'string'},
            {name: 'remark', type:'string'},
            {name: 'password', type:'string'},
            {name: 'board', type:'string'},
            {name: 'arpu', type:'string'},
            {name: 'retention', type:'string'},
            {name: 'paidRetention', type:'string'},
            {name: 'announce', type:'string'},
            {name: 'player', type:'string'},
            {name: 'robot', type:'string'},
            {name: 'diamond', type:'string'},
            {name: 'gamingMoney', type:'string'},
            {name: 'insiderGamingMoney', type:'string'},
            {name: 'cdKey', type:'string'},
            {name: 'cdKeyOrder', type:'string'},
            {name: 'coupon', type:'string'},
            {name: 'present', type:'string'},
            {name: 'systemAction', type:'string'},
            {name: 'feedback', type:'string'},
            {name: 'presentExchange', type:'string'},
            {name: 'recharge', type:'string'},
            {name: 'cards', type:'string'},
            {name: 'channel', type:'string'},
            {name: 'poker', type:'string'},
            {name: 'accountAnnounce', type:'string'},
            {name: 'beauty', type:'string'},
            {name: 'activity', type:'string'},
            {name: 'authorization', type:'string'},
            {name: 'p2pMessage', type:'string'},
            {name: 'insider', type:'string'},
            {name: 'sendDiamond', type:'string'},
            {name: 'isBeauty', type:'string'},
            {name: 'isBadGuy', type:'string'},
            {name: 'isBanToLogin', type:'string'},
            {name: 'rechargeAmount', type:'string'}
        ]
    });

    var store = Ext.create('Ext.data.JsonStore', {
        model: LogDataStruct,
        data: datas
    });

    var logList = Ext.create('Ext.grid.Panel', {
        store: store,
        viewConfig  : {
            enableTextSelection:true
        },
        loadMask: true,
        columnLines:true,
        columns: [
            {text: '账号', width: 100, dataIndex: 'name'},
            {text: '备注', width: 100, dataIndex: 'remark'}
        ],
        style: 'margin-left:2px;',
        autoScroll : true,
        id : "gmAccounts",
        height: 700
    });

    logList.render('search_player');
    logList.addListener('cellclick',function(grid, rowIndex, columnIndex, e)
    {
        //Todo Something here
        var sm = grid.getSelectionModel();
        var records = sm.getSelection();
        if (!records || records.length != 1) {
            alert("请选定要查询的账号");
            return;
        }

        drawAccount(records[0]);
    });
};

function createAuthorization() {
    var accountForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 'auto',
        height: 50,
        region: 'center',
        defaults: {
            labelAlign: 'left',
            msgTarget: 'side',
            style : 'margin-left:15px;margin-top:10px;font-size:12px;'
        },
        layout : 'column',
        items:[
            {
                xtype : 'label',
                style : 'margin-left:15px;margin-top:13px;',
                text: "用户列表"
            },
            {
                xtype : 'button',
                text:'新增用户',
                handler : function(){
                    addAccount();
                }
            },
            {
                xtype : 'button',
                text:'修改用户',
                handler : function(){
                    modifyAccount();
                }
            },
            {
                xtype : 'button',
                text:'删除用户',
                handler : function(){
                    deleteAccount();
                }
            }
        ]
    });
    accountForm.render('condition');
}

function deleteAccount(){
    var selectionModel = Ext.getCmp('gmAccounts').getSelectionModel();
    var records = selectionModel.getSelection();
    if (!records || records.length != 1) {
        Ext.Msg.alert("错误", "请选中要删除的用户");
        return;
    }

    if (parseInt(records[0].get('isAdmin')) === 1) {
        Ext.Msg.alert("错误", "超级管理员不能删除");
        return;
    }

    Ext.MessageBox.confirm("提示", "您确定删除选中的用户么?", function(e) {
        if (e != "yes") {
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/authorization/deleteAccount",
            method: 'POST',
            params: {name: records[0].get("name")},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.Msg.alert("错误", "删除用户失败");
                } else {
                    drawAccounts( json );
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "删除用户失败");
            }
        });
    });
}
function addAccount(){
    var addForm = new Ext.FormPanel({
        frame: true,
        layout : 'column',
        baseCls:'border-style:none',
        fieldDefaults: {
            style : 'margin-left:30px;margin-top:20px;'
        },
        items:[
            {
                xtype : 'textfield',
                fieldLabel: '账号',
                labelWidth: 30,
                width: 150,
                name: 'name'
            },
            {
                xtype : 'textfield',
                fieldLabel: '密码',
                labelWidth: 30,
                width: 150,
                name: 'password'
            },
            {
                xtype : 'textfield',
                fieldLabel: '备注',
                labelWidth: 30,
                width: 150,
                name: 'remark'
            },
            {
                xtype : 'checkbox',
                boxLabel: '数据总览',
                width: 150,
                name: 'board'
            },
            {
                xtype : 'checkbox',
                boxLabel: '日关键数据',
                width: 150,
                name: 'arpu'
            },
            {
                xtype : 'checkbox',
                boxLabel: '日留存率',
                width: 150,
                name: 'retention'
            },
            {
                xtype : 'checkbox',
                boxLabel: '充值日留存率',
                width: 150,
                name: 'paidRetention'
            },
            {
                xtype : 'checkbox',
                boxLabel: '系统公告',
                width: 150,
                name: 'announce'
            },
            {
                xtype : 'checkbox',
                boxLabel: '玩家管理',
                width: 150,
                name: 'player'
            },
            {
                xtype : 'checkbox',
                boxLabel: '系统设置',
                width: 150,
                name: 'robot'
            },
            {
                xtype : 'checkbox',
                boxLabel: '日钻石充值/消耗',
                width: 150,
                name: 'diamond'
            },
            {
                xtype : 'checkbox',
                boxLabel: '日金币产出/消耗',
                width: 150,
                name: 'gamingMoney'
            },
            {
                xtype : 'checkbox',
                boxLabel: 'CDKEY',
                width: 150,
                name: 'cdKey'
            },
            {
                xtype : 'checkbox',
                boxLabel: 'CDKEY统计',
                width: 150,
                name: 'cdKeyOrder'
            },
            {
                xtype : 'checkbox',
                boxLabel: '系统操作',
                width: 150,
                name: 'systemAction'
            },
            {
                xtype : 'checkbox',
                boxLabel: '意见反馈',
                width: 150,
                name: 'feedback'
            },
            {
                xtype : 'checkbox',
                boxLabel: '客服通道',
                width: 150,
                name: 'channel'
            },
            {
                xtype : 'checkbox',
                boxLabel: '查看广播',
                width: 150,
                name: 'accountAnnounce'
            },
            {
                xtype : 'checkbox',
                boxLabel: '限时活动',
                width: 150,
                name: 'activity'
            },
            {
                xtype : 'checkbox',
                boxLabel: '用户权限管理',
                width: 150,
                name: 'authorization'
            },
            {
                xtype : 'checkbox',
                boxLabel: '发钻石',
                width: 150,
                name: 'sendDiamond'
            },
            {
                xtype : 'checkbox',
                boxLabel: '封号',
                width: 150,
                name: 'isBanToLogin'
            },
            {
                xtype : 'checkbox',
                boxLabel: '充值额度',
                width: 150,
                name: 'rechargeAmount'
            },
            {
                xtype : 'button',
                style:'margin-top:40px;margin-left:80px;',
                text: "<font size=3px>提 交</font>",
                handler : function(){
                    submit();
                }
            }
        ]
    });

    var win = new Ext.Window({
        title:'新增用户',
        width:600,
        height:550,
        closeAction:'hide',
        items:[addForm]
    });

    win.on('close',function(){
        if(win){
            win.destroy();
        }
    });

    win.show();

    function submit(){
        var args = addForm.getForm().getValues();
        if (args.name === "" || args.password === "") {
            Ext.Msg.alert("错误", "账号和密码不能为空!");
            return;
        }

        args.board = args.board == "on" ? 1 : 0;
        args.arpu = args.arpu == "on" ? 1 : 0;
        args.retention = args.retention == "on" ? 1 : 0;
        args.paidRetention = args.paidRetention == "on" ? 1 : 0;
        args.announce = args.announce == "on" ? 1 : 0;
        args.player = args.player == "on" ? 1 : 0;
        args.robot = args.robot == "on" ? 1 : 0;
        args.diamond = args.diamond == "on" ? 1 : 0;
        args.gamingMoney = args.gamingMoney == "on" ? 1 : 0;
        args.insiderGamingMoney = args.insiderGamingMoney == "on" ? 1 : 0;
        args.cdKey = args.cdKey == "on" ? 1 : 0;
        args.cdKeyOrder = args.cdKeyOrder == "on" ? 1 : 0;
        args.coupon = args.coupon == "on" ? 1 : 0;
        args.present = args.present == "on" ? 1 : 0;
        args.systemAction = args.systemAction == "on" ? 1 : 0;
        args.feedback = args.feedback == "on" ? 1 : 0;
        args.presentExchange = args.presentExchange == "on" ? 1 : 0;
        args.recharge = args.recharge == "on" ? 1 : 0;
        args.cards = args.cards == "on" ? 1 : 0;
        args.channel = args.channel == "on" ? 1 : 0;
        args.poker = args.poker == "on" ? 1 : 0;
        args.accountAnnounce = args.accountAnnounce == "on" ? 1 : 0;
        args.beauty = args.beauty == "on" ? 1 : 0;
        args.activity = args.activity == "on" ? 1 : 0;
        args.authorization = args.authorization == "on" ? 1 : 0;
        args.p2pMessage = args.p2pMessage == 'on' ? 1 : 0;
        args.insider = args.insider == "on" ? 1 : 0;
        args.sendDiamond = args.sendDiamond == 'on' ? 1 : 0;
        args.isBeauty = args.isBeauty == 'on' ? 1 : 0;
        args.isBadGuy = args.isBadGuy == "on" ? 1 : 0;
        args.isBanToLogin = args.isBanToLogin == 'on' ? 1 : 0;
        args.rechargeAmount = args.rechargeAmount == 'on' ? 1 : 0;

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/authorization/addAccount",
            method: 'POST',
            params: {account : JSON.stringify(args)},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.Msg.alert("错误", "新增用户失败");
                } else {
                    drawAccounts( json );
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "新增用户失败");
            }
        });

        win.close();
    }
};

function modifyAccount(){
    var selectionModel = Ext.getCmp('gmAccounts').getSelectionModel();
    var records = selectionModel.getSelection();
    if (!records || records.length != 1) {
        Ext.Msg.alert("错误", "请选中要修改的用户");
        return;
    }

    var modifyForm = new Ext.FormPanel({
        frame: true,
        layout : 'column',
        baseCls:'border-style:none',
        fieldDefaults: {
            style : 'margin-left:30px;margin-top:20px;'
        },
        items:[
            {
                xtype : 'textfield',
                fieldLabel: '账号',
                labelWidth: 30,
                width: 150,
                readOnly:true,
                name : "name",
                value : records[0].get("name")
            },
            {
                xtype : 'textfield',
                fieldLabel: '密码',
                labelWidth: 30,
                width: 150,
                name : "password",
                value : ""
            },
            {
                xtype : 'textfield',
                fieldLabel: '备注',
                labelWidth: 30,
                width: 150,
                name : "remark",
                value : records[0].get("remark")
            },
            {
                xtype : 'checkbox',
                boxLabel: '数据总览',
                width: 150,
                name: 'board',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("board")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '日关键数据',
                width: 150,
                name: 'arpu',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("arpu")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '日留存率',
                width: 150,
                name: 'retention',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("retention")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '充值日留存率',
                width: 150,
                name: 'paidRetention',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("paidRetention")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '系统公告',
                width: 150,
                name: 'announce',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("announce")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '玩家管理',
                width: 150,
                name: 'player',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("player")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '系统设置',
                width: 150,
                name: 'robot',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("robot")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '日钻石充值/消耗',
                width: 150,
                name: 'diamond',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("diamond")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '日金币产出/消耗',
                width: 150,
                name: 'gamingMoney',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("gamingMoney")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: 'CDKEY',
                width: 150,
                name: 'cdKey',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("cdKey")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: 'CDKEY统计',
                width: 150,
                name: 'cdKeyOrder',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("cdKeyOrder")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '系统操作',
                width: 150,
                name: 'systemAction',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("systemAction")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '意见反馈',
                width: 150,
                name: 'feedback',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("feedback")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '客服通道',
                width: 150,
                name: 'channel',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("channel")) === 1
            },

            {
                xtype : 'checkbox',
                boxLabel: '查看广播',
                width: 150,
                name: 'accountAnnounce',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("accountAnnounce")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '限时活动',
                width: 150,
                name: 'activity',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("activity")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '用户权限管理',
                width: 150,
                name: 'authorization',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("authorization")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '发钻石',
                width: 150,
                name: 'sendDiamond',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("sendDiamond")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '封号',
                width: 150,
                name: 'isBanToLogin',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("isBanToLogin")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '充值额度',
                width: 150,
                name: 'rechargeAmount',
                checked : parseInt(records[0].get("isAdmin")) === 1 || parseInt(records[0].get("rechargeAmount")) === 1
            },
            {
                xtype : 'button',
                style:'margin-top:40px;margin-left:80px;',
                text: "<font size=3px>提 交</font>",
                handler : function(){
                    submit();
                }
            }
        ]
    });

    var win = new Ext.Window({
        title:'修改用户',
        width:600,
        height:550,
        closeAction:'hide',
        items:[modifyForm]
    });
    win.show();

    function submit(){
        var args = modifyForm.getForm().getValues();
        console.log(args);
        if (args.name === "") {
            Ext.Msg.alert("错误", "账号不能为空!");
            return;
        }

        args.board = args.board === "on" ? 1 : 0;
        args.arpu = args.arpu === "on" ? 1 : 0;
        args.retention = args.retention === "on" ? 1 : 0;
        args.paidRetention = args.paidRetention === "on" ? 1 : 0;
        args.announce = args.announce === "on" ? 1 : 0;
        args.player = args.player === "on" ? 1 : 0;
        args.robot = args.robot === "on" ? 1 : 0;
        args.diamond = args.diamond === "on" ? 1 : 0;
        args.gamingMoney = args.gamingMoney === "on" ? 1 : 0;
        args.insiderGamingMoney = args.insiderGamingMoney === "on" ? 1 : 0;
        args.cdKey = args.cdKey === "on" ? 1 : 0;
        args.cdKeyOrder = args.cdKeyOrder === "on" ? 1 : 0;
        args.coupon = args.coupon === "on" ? 1 : 0;
        args.present = args.present === "on" ? 1 : 0;
        args.systemAction = args.systemAction === "on" ? 1 : 0;
        args.feedback = args.feedback === "on" ? 1 : 0;
        args.presentExchange = args.presentExchange === "on" ? 1 : 0;
        args.recharge = args.recharge === "on" ? 1 : 0;
        args.cards = args.cards === "on" ? 1 : 0;
        args.channel = args.channel === "on" ? 1 : 0;
        args.poker = args.poker === "on" ? 1 : 0;
        args.accountAnnounce = args.accountAnnounce == "on" ? 1 : 0;
        args.beauty = args.beauty === "on" ? 1 : 0;
        args.activity = args.activity === "on" ? 1 : 0;
        args.authorization = args.authorization === "on" ? 1 : 0;
        args.p2pMessage = args.p2pMessage === 'on' ? 1 : 0;
        args.insider = args.insider === "on" ? 1 : 0;
        args.sendDiamond = args.sendDiamond === 'on' ? 1 : 0;
        args.isBeauty = args.isBeauty == 'on' ? 1 : 0;
        args.isBadGuy = args.isBadGuy == "on" ? 1 : 0;
        args.isBanToLogin = args.isBanToLogin == 'on' ? 1 : 0;
        args.rechargeAmount = args.rechargeAmount == 'on' ? 1 : 0;

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/authorization/modifyAccount",
            method: 'POST',
            params: {account : JSON.stringify(args)},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.Msg.alert("错误", "修改用户失败");
                } else {
                    drawAccounts( json );
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "修改用户失败");
            }
        });

        win.close();
    }
};

function drawAccount( data ){
    Ext.getDom('player_info').innerHTML = '';
    Ext.getDom('player_data').innerHTML = '';
    var accountPanel = new Ext.FormPanel({
        title: '',
        id : "detail",
        width: 600,
        height: 700,
        layout : 'column',
        frame: true,
        defaults: {
            labelAlign: 'left',
            msgTarget: 'side',
            style : 'margin-top:20px;margin-left:30px;font-size:12px;'
        },
        items: [
            {
                xtype : 'textfield',
                fieldLabel: '账号',
                labelWidth: 30,
                width: 150,
                readOnly:true,
                value : data.get("name")
            },
            {
                xtype : 'textfield',
                fieldLabel: '密码',
                labelWidth: 30,
                width: 150,
                readOnly:true,
                value : ""
            },
            {
                xtype : 'textfield',
                fieldLabel: '备注',
                labelWidth: 30,
                width: 150,
                readOnly:true,
                value : data.get("remark")
            },
            {
                xtype : 'checkbox',
                boxLabel: '数据总览',
                width: 150,
                name: 'board',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("board")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '日关键数据',
                width: 150,
                name: 'arpu',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("arpu")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '日留存率',
                width: 150,
                name: 'retention',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("retention")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '充值日留存率',
                width: 150,
                name: 'paidRetention',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("paidRetention")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '系统公告',
                width: 150,
                name: 'announce',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("announce")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '玩家管理',
                width: 150,
                name: 'player',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("player")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '系统设置',
                width: 150,
                name: 'robot',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("robot")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '日钻石充值/消耗',
                width: 150,
                name: 'diamond',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("diamond")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '日金币产出/消耗',
                width: 150,
                name: 'gamingMoney',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("gamingMoney")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: 'CDKEY',
                width: 150,
                name: 'cdKey',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("cdKey")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: 'CDKEY统计',
                width: 150,
                name: 'cdKeyOrder',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("cdKeyOrder")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '系统操作',
                width: 150,
                name: 'systemAction',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("systemAction")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '意见反馈',
                width: 150,
                name: 'feedback',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("feedback")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '客服通道',
                width: 150,
                name: 'channel',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("channel")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '查看广播',
                width: 150,
                name: 'accountAnnounce',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("accountAnnounce")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '限时活动',
                width: 150,
                name: 'activity',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("activity")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '用户权限管理',
                width: 150,
                name: 'authorization',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("authorization")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '发钻石',
                width: 150,
                name: 'sendDiamond',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("sendDiamond")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '封号',
                width: 150,
                name: 'isBanToLogin',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("isBanToLogin")) === 1
            },
            {
                xtype : 'checkbox',
                boxLabel: '充值额度',
                width: 150,
                name: 'rechargeAmount',
                readOnly:true,
                checked : parseInt(data.get("isAdmin")) === 1 || parseInt(data.get("rechargeAmount")) === 1
            }
        ]
    });


    accountPanel.render("player_info");
};









