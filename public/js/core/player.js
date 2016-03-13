var host = window.location.host.split(":");
var avatarsPath = "http://" + host[0] + ":8888/download?avatar=";

var insiderHidden = true;
var sendDiamondHidden = true;
var beautyHidden = true;
var banToLoginHidden = true;
var badGuyHidden = true;


function searchPlayer(){
    var options = new Ext.data.SimpleStore({
        fields: ['id', 'option'],
        data: [['1','金币>=<='],['2', '平台账号='],['3','玩家昵称='],['4','钻石>=<='],
            ['5','玩家ID='],['6','充值>=<='],['7', "封号"]]
    });

    var timeOptions = new Ext.data.SimpleStore({
        fields: ['id', 'timeOption'],
        data: [['1','最后充值时间'],['2', '首次充值时间'],['3','最后登录时间'],['4', '创建时间']]
    });

    var searchForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 'auto',
        height:35,
        region: 'center',
        layout : 'column',
        baseCls:'border-style:none',
        items:[
            {
                xtype : 'combo',
                style : 'margin-left:15px;',
                name: 'option',
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                value: '金币>=<=',
                width: 100
            },
            {
                xtype : 'textfield',
                style : 'margin-left:5px;',
                name: 'optionValue',
                width: 80
            },
            {
                xtype : 'textfield',
                style : 'margin-left:5px;',
                name: 'optionValue1',
                width: 80
            },
            {
                xtype : 'button',
                style : 'margin-left:5px;',
                text:'查 询',
                handler : function(){
                    submit(0);
                }
            },
            {
                xtype : 'combo',
                style : 'margin-left:15px;',
                name: 'timeOption',
                model: 'local',
                store: timeOptions,
                displayField:'timeOption',
                editable : false,// 是否允许输入
                value: '最后充值时间',
                width: 100
            },
            {
                xtype : 'datefield',
                style : 'margin-left:5px;',
                width: 160,
                name: 'startTime',
                format: 'Y-m-d H:i:s',
                value:Ext.Date.add(new Date(), Ext.Date.DAY, -1),
                editable:true
            },
            {
                xtype : 'datefield',
                width: 160,
                name: 'endTime',
                format: 'Y-m-d H:i:s',
                value:Ext.Date.add(new Date(), Ext.Date.DAY, 1),
                editable:true
            },
            {
                xtype : 'button',
                style : 'margin-left:5px;',
                text:'查 询',
                handler : function(){
                    submit(1);
                }
            }
        ]
    });

    var richerSearch = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 'auto',
        height:35,
        region: 'center',
        layout : 'column',
        baseCls:'border-style:none',
        items:[
            {
                xtype : 'button',
                style : 'margin-left:50px;',
                text:'合并查询',
                handler : function(){
                    submit(2);
                }
            },
            {
                xtype:"label",
                id: "records",
                style : 'margin-left:30px;margin-top:2px',
                text: "记录数量：0"
            }
        ]
    });

    var totalSearch = Ext.create("Ext.Panel", {
        title: '',
        width: 'auto',
        height: 70,
        frame: true,
        items: [
            searchForm,
            richerSearch
        ]
    });

    totalSearch.render("condition");

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/player/getAuthorization",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "没有找到相关记录");
            } else {
                insiderHidden = json.insider ? false : true;
                sendDiamondHidden = json.sendDiamond ? false : true;
                beautyHidden = json.isBeauty ? false : true;
                banToLoginHidden = json.isBanToLogin ? false : true;
                badGuyHidden = json.isBadGuy ? false : true;
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "没有找到相关记录");
        }
    });

    function submit(flag){
        var args = searchForm.getForm().getValues();
		args.flag = flag;

        if (flag === 0 || flag === 2) {
            if (args.optionValue === "" && (args.option === "玩家ID=" || args.option === "平台账号=" || args.option === "玩家昵称=" ||
                args.option === "玩家对象ID=" || args.option === "钻石>=" || args.option === "金币>=" || args.option === "充值>=")) {
                Ext.Msg.alert("告警", "选项值未填写");
                return;
            }

			args.optionValue = parseInt(args.optionValue) ? parseInt(args.optionValue) : 0;
			args.optionValue1 = parseInt(args.optionValue1) ? parseInt(args.optionValue1) : 0;
        } else if (flag === 1 || flag === 2) {
            if (args.startTime == "" || args.endTime == "") {
                Ext.Msg.alert("告警", "日期格式错误");
                return;
            }
        } else {
			Ext.Msg.alert("告警", "无效查询，参数错误");
			return;
        }

        console.log(args);

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/player/query",
            method: 'GET',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.Msg.alert("错误", "没有找到相关记录");
                } else {
                    drawTable( json );
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "没有找到相关记录");
            }
        });
    };
};

function drawTable( dataFromServer ){
    Ext.getDom('search_player').innerHTML = '';
    Ext.getDom('player_info').innerHTML = '';
    Ext.getDom('player_data').innerHTML = '';

    var count =  dataFromServer && dataFromServer.length > 0 ?  dataFromServer.length : 1;
    Ext.getCmp('records').setText("记录数量：" + count);
    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'username', type:'string'},
            {name: 'nickname', type:'string'},
			{name: 'playerId', type:'string'},
        ]
    });

    var store = Ext.create('Ext.data.JsonStore', {
        model: LogDataStruct,
        data: dataFromServer
    });


    initLogList();

    function initLogList(){
        var logList = Ext.create('Ext.grid.Panel', {
            store: store,
            viewConfig  : {
                enableTextSelection:true
            },
            loadMask: true,
            columnLines:true,
            columns: [
                {text: '平台账号', width: 170, dataIndex: 'username'},
                {text: '玩家昵称', width: 170, dataIndex: 'nickname'}
            ],
            style: 'margin-left:2px;',
            autoScroll : true,
            height: 700
        });

        logList.render('search_player');
        logList.addListener('cellclick',function(grid, rowIndex, columnIndex, e) {
            var sm = grid.getSelectionModel();
            var records = sm.getSelection();

            if (!records || records.length != 1) {
                alert("请选定要查询的玩家");
                return;
            }

            Ext.Ajax.request({
                url: "http://" + window.location.host + "/player/get",
                method: 'GET',
                params: {"playerId": records[0].get('playerId')},
                success: function(response){
                    var json = Ext.JSON.decode(response.responseText);
                    drawPlayer( json );
                },
                failure: function(){
                    Ext.Msg.alert("错误", "没有找到相关记录");
                }
            });
        });
    }
};

function drawPlayer( dataFromServer ){
    Ext.getDom('player_info').innerHTML = '';
    Ext.getDom('player_data').innerHTML = '';
    console.log("drawPlayer, data: " + JSON.stringify(dataFromServer));

    var leftPanel = new Ext.Panel({
        title: '',
        width: 300,
        height: 460,
        baseCls:'border-style:none',
        frame: true,
        items: [
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>平台来源: " + dataFromServer.operator + "</p>"
			},
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>平台账号: " + dataFromServer.username + "</p>"
			},
            {
                xtype:"label",
                html:"<p style=font-size:14px;margin:8px>玩家ID: " + dataFromServer.playerId + "</p>"
            },
            {
                xtype:"label",
                html: "<p style=font-size:14px;margin:8px>玩家昵称: " + dataFromServer.nickname + "</p>"
            },
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>资源类型: " + dataFromServer.resType + "</p>"
			},
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>等级: " + dataFromServer.level + "</p>"
			},
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>经验: " + dataFromServer.exp + "</p>"
			},
            {
                xtype:"label",
                html: "<p style=font-size:14px;margin:8px>钻石: " + dataFromServer.diamond + "</p>"
            },
            {
                xtype:"label",
                html: "<p style=font-size:14px;margin:8px>金币: " + dataFromServer.gold + "</p>"
            },
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>推图ID: " + dataFromServer.curThroughId + "</p>"
			},
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>挑战ID: " + dataFromServer.curChallengeId + "</p>"
			},
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>最大挑战ID: " + dataFromServer.maxChallengeId + "</p>"
			},
        ]
    });

    var rightPanel = new Ext.Panel({
        title: '',
        width: 250,
        height: 460,
        baseCls:'border-style:none',
        frame: true,
        items: [
            {
                xtype:"label",
                html:"<p style=font-size:14px;margin:8px>VIP: " + dataFromServer.vip + "级</p>"
            },
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>首次充值: " + dateFormat(dataFromServer.firstRechargeTime) + "</p>"
			},
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>最后充值: " + dateFormat(dataFromServer.lastRechargeTime) + "</p>"
			},
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>总充值: " + (dataFromServer.totalRecharge || 0) + "</p>"
			},
            {
                xtype:"label",
                html: "<p style=font-size:14px;margin:8px>手机号: " + (dataFromServer.phone || "") + "</p>"
            },
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>创建时间: " + dateFormat(dataFromServer.createTime) + "</p>"
			},
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>最后登录: " + dateFormat(dataFromServer.loginTime) + "</p>"
			},
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>离开游戏时间: " + dateFormat(dataFromServer.leaveTime) + "</p>"
			},
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>IP: " + dataFromServer.ip + "</p>"
			},
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>好友: " + (dataFromServer.friendIds || []).length + "</p>"
			},
			{
				xtype:"label",
				html: "<p style=font-size:14px;margin:8px>黑名单: " + (dataFromServer.blacklist || []).length + "</p>"
			},
        ]
    });

    var topPanel = new Ext.Panel({
        title: '',
        width: 1100,
        height: 460,
        layout : 'column',
        defaults: {
            style : 'margin-left:10px;'
        },
        frame: true,
        items: [
            {
                border: false,
                width: 150,
                height: 160,
                baseCls:'border-style:none',
                frame: true,
                style : 'margin-top:20px;',
                items: [
                    {
                        xtype:"label",
                        html: "<font size=3>玩家头像: </font><br>"
                    },
                    {
                        xtype:'panel',
                        width: 150,
                        height: 150,
                        html:'<img style="max-height:150px;max-width:150px" src=' + getAvatar(dataFromServer.resType) + '> '
                    }
                ]
            },
            leftPanel,
            rightPanel
        ]
    });

    var beautyPanel = new Ext.FormPanel({
        title: '',
        width: 1100,
        height: 20,
        layout : 'column',
        frame: true,
        baseCls:'border-style:none',
        items: [
            {
                xtype : 'button',
                text:'扣除金币',
                style : 'margin-left:0px;',
                hidden : insiderHidden,
                handler : function(){
                    randomWithdraw(dataFromServer.playerId);
                }
            }
        ]
    });

    var diamondPanel = new Ext.FormPanel({
        title: '',
        width: 1100,
        height: 20,
        layout : 'column',
        frame: true,
        baseCls:'border-style:none',
        items: [
            {
                xtype : 'textfield',
                fieldLabel: '钻石数',
				style : 'margin-left:0px',
                name: "amount",
                labelWidth: 50,
                width: 100,
                value: 10,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
				xtype : 'textfield',
				fieldLabel: '加VIP($)',
				style : 'margin-left:20px',
				name: "withVip",
				labelWidth: 55,
				width: 100,
				value: 0.01,
				allowBlank : false,
				blankText:'此项不能为空'
            },
            {
                xtype : 'button',
                text:'发钻石',
                style : 'margin-left:20px;',
                hidden : sendDiamondHidden,
                handler : function(){
                    Ext.MessageBox.confirm("提示", "确定给此人发放钻石?", function(e) {
                        if (e != "yes") {
                            return;
                        }
                        gmRecharge(dataFromServer.playerId);
                    });
                }
            }
        ]
    });

    var banOptions = new Ext.data.SimpleStore({
        fields: ['banId', 'banOption'],
        data: [
            ['1','帐号违规，请联系客服QQ100186']
        ]
    });
    var banPanel = new Ext.FormPanel({
        title: '',
        width: 1100,
        height: 20,
        layout : 'column',
        frame: true,
        baseCls:'border-style:none',
        items: [
            {
                xtype : 'label',
                id : 'banToLogin',
                text :  dataFromServer._isBanToLogin ? "封号: 是" : "封号: 否"
            },
            {
                xtype : 'combo',
                style : 'margin-left:10px;',
                width: 450,
                id : 'banReason',
                name : 'banReason',
                model: 'local',
                store: banOptions,
                displayField:'banOption',
                editable : true,// 是否允许输入
                value: dataFromServer.isBanToLogin ? dataFromServer.banReason : ("玩家ID " + dataFromServer.playerId + " : "),
                listeners:{
                    "select":function(combo, record, index){
                        combo.setValue("玩家ID" + dataFromServer.playerId + ": " + record[0].data.banOption);
                    }
                }
            },
            {
                xtype : 'button',
                text:'设 置',
                style : 'margin-left:10px;',
                hidden : banToLoginHidden,
                handler : function(){
                    var labelText = Ext.getCmp("banToLogin").text;
                    var msgText = "";
                    var isBanToLogin = 2;
                    if (labelText === "封号: 是") {
                        msgText = "您确定解封此人?";
                        isBanToLogin = 0;
                    }  else if (labelText === "封号: 否"){
                        msgText = "您确定封号?";
                        isBanToLogin = 1;
                    }

                    if(isBanToLogin != 0 && isBanToLogin != 1) {
                        return;
                    }

                    var banReason = Ext.getCmp("banReason").getValue();
                    if (banReason.indexOf("玩家ID") === -1) {
                        console.log("未携带玩家ID");
                        //Ext.Msg.alert("提示", "未携带玩家ID");
                        //return;
                    }
                    Ext.MessageBox.confirm("提示", msgText, function(e) {
                        if (e != "yes") {
                            return;
                        }

                        Ext.Ajax.request({
                            url: "http://" + window.location.host + "/player/banToLogin",
                            method: 'GET',
                            params: {"playerId": dataFromServer.playerId, "isBan": isBanToLogin,"banReason": banReason, "endTime": Ext.Date.add(new Date(), Ext.Date.DAY, 3)},
                            success: function(response){
                                var json = Ext.JSON.decode(response.responseText);
                                if (json.resultCode === 200) {
                                    Ext.Msg.alert("成功", "操作成功");
                                    var text = isBanToLogin ? "封号: 是" : "封号: 否";
                                    Ext.getCmp("banToLogin").setText(text);
                                } else {
                                    Ext.Msg.alert("错误", "操作失败");
                                }
                            },
                            failure: function(){
                                Ext.Msg.alert("错误", "操作失败");
                            }
                        });
                    });
                }
            }
        ]
    });

    var centerPanel = new Ext.Panel({
        title: '',
        width: 1100,
        height: 140,
        defaults: {
            style : 'margin-top:20px;margin-left:20px;'
        },
        frame: true,
        items: [
            beautyPanel,
            diamondPanel,
            banPanel
        ]
    });

    var bottomPanel = new Ext.Panel({
        title: '',
        width: 1100,
        height: 40,
        defaults: {
            style : 'margin-top:5px;margin-left:20px;'
        },
        frame: true,
        items: [
            {
                xtype : 'button',
                text:'充值记录',
                handler : function(){
                    getGmRecord(dataFromServer.playerId, 2);
                }
            },
            {
                xtype : 'button',
                text:'购买记录',
                handler : function(){
                    getGmRecord(dataFromServer.playerId, 3);
                }
            },
            {
                xtype : 'button',
                text:'好友',
                handler : function(){
                    getGmRecord(dataFromServer.playerId, 7);
                }
            },
            {
                xtype : 'button',
                text:'黑名单',
                handler : function(){
                    getGmRecord(dataFromServer.playerId, 9);
                }
            }
        ]
    });

    var totalPanel = new Ext.Panel({
        title: '',
        width: 1100,
        height: 605,
        frame: true,
        baseCls:'border-style:none',
        items: [
            topPanel,
            centerPanel,
            bottomPanel
        ]
    });
    totalPanel.render("player_info");
	/*
	if (args.withVip === "on") {
		url =  "http://" + window.location.host + "/gmrecharge/withVip";
	} else {
		url = "http://" + window.location.host + "/gmrecharge/withoutVip";
	}
	*/
    function  gmRecharge(playerId) {
        var args = diamondPanel.getForm().getValues();
        console.log("args: " + JSON.stringify(args));

        var url = '';
        if (args.withVip > 0) {
            url =  "http://" + window.location.host + "/gmrecharge/withVip";
        } else {
            url = "http://" + window.location.host + "/gmrecharge/withoutVip";
        }

        Ext.Ajax.request({
            url: url,
            method: 'POST',
            params: {"playerId": playerId, "amount": args.amount, "pay": args.withVip},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (!json.resultCode) {
                    Ext.Msg.alert("成功", "操作成功");
                } else {
                    Ext.Msg.alert("错误", "操作失败");
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "操作失败");
            }
        });
    }
};

function getGmRecord(playerId, type) {
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/player/gmRecord",
        method: 'GET',
        params: {"playerId": playerId, "logType": type},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            console.log(json);
            if (json.resultCode === 500) {
                Ext.getDom('player_data').innerHTML = '';
                Ext.Msg.alert("错误", "无相关记录");
            } else {
                showGmRecord(json, type);
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "无相关记录");
        }
    });
}

function showGmRecord(recordJson, type){
    Ext.getDom('player_data').innerHTML = '';
    console.log(recordJson);

    var title = "";
    var fields = [];
    var columns = [];
    if (type === 1) {
        fields = [
            {name: 'type', type:'string'},
            {name: 'remarks', type:'string'},
            {name: 'time', type:'string'}
        ];
        columns = [
            {text: '类型', width: 80, dataIndex: 'type'},
            {text: '说明', width: 200, dataIndex: 'remarks'},
            {text: '操作时间', width: 200, dataIndex: 'time'}
        ];
    } else if (type === 2) {
        title = "充值记录";
        fields = [
            {name: 'amount', type:'string'},
            {name: 'diamond', type:'string'},
            {name: 'time', type:'string'}
        ];
        columns = [
            {text: '充值(元)', width: 80, dataIndex: 'amount'},
            {text: '获得钻石', width: 200, dataIndex: 'diamond'},
            {text: '充值时间', width: 200, dataIndex: 'time'}
        ];
    } else if (type === 3) {
        title = "购买记录";
        fields = [
            {name: 'diamond', type:'string'},
            {name: 'amount', type:'string'},
            {name: 'time', type:'string'}
        ];
        columns = [
            {text: '花费钻石', width: 80, dataIndex: 'diamond'},
            {text: '获得金币', width: 200, dataIndex: 'amount'},
            {text: '购买时间', width: 200, dataIndex: 'time'}
        ];
    } else if (type === 7 || type === 9) {
        title = type === 7 ? "好友" : "黑名单";
        fields = [
            {name: 'playerId', type:'string'},
            {name: 'nickname', type:'string'},
            {name: 'time', type:'string'}
        ];
        columns = [
            {text: '玩家ID', width: 80, dataIndex: 'playerId'},
            {text: '玩家昵称', width: 200, dataIndex: 'nickname'},
            {text: '操作时间', width: 200, dataIndex: 'time'}
        ];
    }

    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: fields
    });

    var store = Ext.create('Ext.data.JsonStore', {
        model: LogDataStruct,
        data: recordJson
    });


    showLogs();

    function showLogs(){
        var logList = Ext.create('Ext.grid.Panel', {
            store: store,
            loadMask: true,
            columnLines:true,
            columns: columns,
            autoScroll : true,
            height: 360
        });

        var win = new Ext.Window({
            title: title + "-->显示记录条数: " + recordJson.length,
            width: 650,
            height:400,
            closeAction:'close',
            items:[logList]
        });

        win.on('close',function(){
            if(win){
                win.destroy();
            }
        });

        win.show();
    }
};

function giftAmount(type, gifts) {
    var amount = 0;
    for(var i in gifts) {
        if (type === gifts[i].name) {
            amount = gifts[i].amount;
        }
    }

    return amount;
};

function randomWithdraw(playerId) {
    var win = new Ext.Window({
        title:'扣除金币',
        width:300,
        height:120,
        closeAction:'close',
        layout : 'column',
        items:[
            {
                xtype : 'textfield',
                style: "margin-left: 30px; margin-top: 30px",
                fieldLabel: '金币数',
                name: "withDrawGamingMoney",
                id : "withDrawGamingMoney",
                labelWidth: 50,
                width: 150,
                value: 0,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'button',
                style: "margin-left: 10px; margin-top: 30px",
                text:'提 交',
                handler : function(){
                    withDraw();
                }
            }
        ]
    });

    win.on('close',function(){
        if(win){
            win.destroy();
        }
    });

    win.show();

    function withDraw() {
        var gamingMoney = Ext.getCmp("withDrawGamingMoney").getValue();
        if(gamingMoney <= 0) {
            Ext.Msg.alert("提示", "金币数需大于0");
            return;
        }
        Ext.MessageBox.confirm("提示", "您确定扣除此人金币么？", function(e) {
            if (e != "yes") {
                return;
            }

            Ext.Ajax.request({
                url: "http://" + window.location.host + "/player/cutdown",
                method: 'POST',
                params: {"playerId": playerId, gamingMoney: gamingMoney},
                success: function(response){
                    var json = Ext.JSON.decode(response.responseText);
                    if (json.resultCode === 200) {
                        Ext.Msg.alert("成功", "操作成功");
                        win.destroy();
                    } else {
                        Ext.Msg.alert("错误", "操作失败");
                    }
                },
                failure: function(){
                    Ext.Msg.alert("错误", "操作失败");
                }
            });
        });
    }
};

function getAvatar(avatar) {
	console.log("getAvatar, avatar=", avatar);
	return "../../img/photo_" + (avatar || 1) + ".png";
};
