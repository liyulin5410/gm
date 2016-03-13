var host = window.location.host.split(":");
var avatarsPath = "http://" + host[0] + ":8888/download?avatar=";
//var avatarsPath = "http://" + "115.159.26.146" + ":8888/download?avatar=";


function beauty(){
     var searchForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 'auto',
        height:50,
        region: 'center',
        layout : 'column',
        items:[
            {
                xtype : 'textfield',
                style : 'margin-left:20px;margin-top:10px;',
                fieldLabel: '玩家ID',
                id: 'queryId',
                labelWidth: 50,
                width: 200
            },
            {
                xtype : 'button',
                style : 'margin-left:5px; margin-top:10px;',
                text:'查 询',
                handler : function(){
                    var queryId = Ext.getCmp('queryId').getValue();
                    queryAccount(queryId);
                }
            },
            {
                xtype : 'datefield',
                style : 'margin-left:100px; margin-top:10px;',
                fieldLabel: '申请日期',
                labelWidth: 90,
                width: 250,
                name: 'startTime',
                id: 'startTime',
                format: 'Y-m-d H:i:s',
                value:Ext.Date.add(new Date(), Ext.Date.DAY, -3),
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'datefield',
                style : 'margin-left:5px;margin-top:10px;',
                width: 150,
                name: 'endTime',
                id: 'endTime',
                format: 'Y-m-d H:i:s',
                value:Ext.Date.add(new Date(), Ext.Date.DAY, 1),
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'button',
                style : 'margin-left:5px; margin-top:10px;',
                text:'查 询',
                handler : function(){
                    var startTime = Ext.getCmp('startTime').getValue();
                    var endTime = Ext.getCmp('endTime').getValue();
                    submit(startTime, endTime);
                }
            }
        ]
    });

    searchForm.render('condition');
};

function submit(startTime, endTime){
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/beauty/query",
        method: 'GET',
        params: {startTime : new Date(startTime).getTime(), endTime: new Date(endTime).getTime()},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "没有找到相关记录");
            } else {
                drawTable(getAccount(json));
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "没有找到相关记录");
        }
    });
};

function getAccount(datas){
    var accounts = [];
    var queryIdToAccount = {};
    for (var i in datas) {
        var account = queryIdToAccount[datas[i].queryId];
        if (account) {
            continue;
        }
        account = {
            accountId : datas[i].accountId,
            queryId : datas[i].queryId,
            nickname : datas[i].nickname,
            applyTime: dateFormat(datas[i].applyTime),
            isGM : datas[i].authTime ? "是" : ""
        }

        accounts.push(account);
        queryIdToAccount[datas[i].queryId] = account;
    }
    return accounts;
};

function queryAccount(queryId){
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/player/query",
        method: 'GET',
        params: {option : "玩家ID=",  optionValue: queryId, startTime: new Date(), endTime: new Date()},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "没有找到相关记录");
            } else {
                drawPlayer( json );
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "没有找到相关记录");
        }
    });
};

function drawPlayer( dataFromServer ){
    Ext.getDom('search_player').innerHTML = '';
    Ext.getDom('player_info').innerHTML = '';
    Ext.getDom('player_data').innerHTML = '';

    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: '_id', type:'string'},
            {name: 'queryId', type:'string'},
            {name: 'nickname', type:'string'}
        ]
    });

    var store = Ext.create('Ext.data.JsonStore', {
        model: LogDataStruct,
        data: dataFromServer
    });

    var logList = Ext.create('Ext.grid.Panel', {
        store: store,
        viewConfig  : {
            enableTextSelection:true
        },
        loadMask: true,
        columnLines:true,
        columns: [
            {text: '玩家ID', width: 80, dataIndex: 'queryId'},
            {text: '玩家昵称', width: 120, dataIndex: 'nickname'}
        ],
        style: 'margin-left:2px;',
        autoScroll : true,
        height: 700
    });

    logList.render('search_player');
    logList.addListener('cellclick',function(grid, rowIndex, columnIndex, e)
    {
        //Todo Something here
        var sm = grid.getSelectionModel();
        var records = sm.getSelection();
        if (!records || records.length != 1) {
            alert("请选定要查询的玩家");
            return;
        }

        var queryId =  records[0].get('queryId');
        Ext.Ajax.request({
            url: "http://" + window.location.host + "/beauty/getBeauty",
            method: 'GET',
            params: {"queryId": queryId},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
				console.log("drawPlayer, data: " + JSON.stringify(json));
                drawMessage(queryId, json);
            },
            failure: function(){
                Ext.Msg.alert("错误", "没有找到相关记录");
            }
        });
    });
};

function drawTable( dataFromServer ){
    Ext.getDom('search_player').innerHTML = '';
    Ext.getDom('player_info').innerHTML = '';
    Ext.getDom('player_data').innerHTML = '';

    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'accountId', type:'string'},
            {name: 'queryId', type:'string'},
            {name: 'nickname', type:'string'},
            {name: 'applyTime', type:'string'},
            {name: 'isGM', type:'string'}
        ]
    });

    var store = Ext.create('Ext.data.JsonStore', {
        model: LogDataStruct,
        data: dataFromServer
    });

    var logList = Ext.create('Ext.grid.Panel', {
        store: store,
        viewConfig  : {
            enableTextSelection:true
        },
        loadMask: true,
        columnLines:true,
        columns: [
            {text: '玩家ID', width: 72, dataIndex: 'queryId'},
            {text: '已审核', width: 45, dataIndex: 'isGM'},
            {text: '玩家昵称', width: 120, dataIndex: 'nickname'},
            {text: '申请时间', width: 130, dataIndex: 'applyTime'}
        ],
        style: 'margin-left:2px;',
        autoScroll : true,
        width : "auto",
        height : 700
    });

    logList.render('search_player');
    logList.addListener('cellclick',function(grid, rowIndex, columnIndex, e)
    {
        //Todo Something here
        var sm = grid.getSelectionModel();
        var records = sm.getSelection();
        if (!records || records.length != 1) {
            alert("请选定要查询的玩家");
            return;
        }

        var queryId =  records[0].get('queryId');
        Ext.Ajax.request({
            url: "http://" + window.location.host + "/beauty/getBeauty",
            method: 'GET',
            params: {"queryId": queryId},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
				console.log("drawTable, data: " + JSON.stringify(json));
                drawMessage(queryId, json);
            },
            failure: function(){
                Ext.Msg.alert("错误", "没有找到相关记录");
            }
        });
    });
};

var options = new Ext.data.SimpleStore({
    fields: ['id', 'option'],
    data: [
        ['1','无法确认认证照和生活照为同一人'],
        ['2','请重拍认证照，正面，肩以上全部可见，五官清晰'],
        ['3','请重拍认证照，正面，五官清晰，左手食指做“嘘”手势'],
        ['4','请重拍认证照，正面，五官清晰，右手食指做“嘘”手势'],
        ['5','请重拍认证照，正面，五官清晰，左手近左颊做“V”手势'],
        ['6','请重拍认证照，正面，五官清晰，右手近右颊做“V”手势'],
        ['7','请重拍认证照，向左侧，肩以上全部可见，五官清晰'],
        ['8','请重拍认证照，向右侧，肩以上全部可见，五官清晰'],
        ['9','请重拍认证照，向左侧，肩以上全部可见，五官清晰，右手托右下巴'],
        ['10','请重拍认证照，向右侧，肩以上全部可见，五官清晰，左手托左下巴'],
        ['11','生活照太过艺术化，请重传真实生活近照'],
        ['12','生活照与认证照雷同，请重传不同生活近照'],
        ['13','生活照达不到认证标准，请重传更美生活近照']
    ]
});
var id = "";
function drawMessage(queryId, dataFromServer){
    Ext.getDom('player_info').innerHTML = '';
    Ext.getDom('player_data').innerHTML = '';
    console.log("drawMessage, data: " + JSON.stringify(dataFromServer));

    var topPanel = new Ext.FormPanel({
        frame: true,
        width: 800,
        height: 100,
        layout : 'column',
        defaults: {
            labelAlign: 'left',
            msgTarget: 'side'
        },
        items: [
            {
                xtype : 'button',
                text:'审核通过',
                style : 'margin-top:20px;margin-left:30px;',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定审核通过么?", function(e) {
                        setBeautyAuth(e, queryId, 1, id, 1);
                    });
                }
            },
            {
                xtype : 'button',
                text:'不通过',
                style : 'margin-top:20px;margin-left:30px;',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定审核不通过么?", function(e) {
                        setBeautyAuth(e, queryId, 0, id, 1);
                    });
                }
            },
            {
                xtype : 'textfield',
                style : 'margin-top:20px;margin-left:30px;',
                width: 550,
                id : 'message',
                editable : true,// 是否允许输入
                value: ''
            },
            {
                xtype : 'button',
                text:'审核通过',
                style : 'margin-top:10px;margin-left:30px;',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定审核通过么?", function(e) {
                        setBeautyAuth(e, queryId, 1, id, 2);
                    });
                }
            },
            {
                xtype : 'button',
                text:'不通过',
                style : 'margin-top:10px;margin-left:30px;',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定审核不通过么?", function(e) {
                        setBeautyAuth(e, queryId, 0, id, 2);
                    });
                }
            },
            {
                xtype : 'combo',
                style : 'margin-top:10px;margin-left:30px;',
                width: 550,
                id : 'message1',
                model: 'local',
                store: options,
                displayField:'option',
                editable : true,// 是否允许输入
                value: ''
            }
        ]
    });

    topPanel.render("player_info");

    showMessageList(dataFromServer, getMessageList(dataFromServer.documents));
};

var setBeautyAuth = function(e, queryId, isBeauty, id, flag) {
    if (e != "yes") {
        return;
    }

    if (id == "") {
        Ext.Msg.alert("提示", "未选中审核条目!");
        return;
    }

    var message = Ext.getCmp('message').getValue();
    var message1 = Ext.getCmp('message1').getValue();
    if (!isBeauty && flag === 1 && message === "") {
        Ext.Msg.alert("提示", "回复内容不能为空!");
        return;
    } else if (!isBeauty && flag === 2 && message1 === "") {
        Ext.Msg.alert("提示", "回复内容不能为空!");
        return;
    }
    if (flag === 2) {
        message = message1;
    }

    console.log(id);
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/beauty/authBeauty",
        method: 'POST',
        params: {id: id, queryId : queryId, "message": message, isBeauty: isBeauty},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "操作失败");
            } else {
                Ext.Msg.alert("成功", "操作成功");
                var json = Ext.JSON.decode(response.responseText);
                drawMessage(queryId, json);
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });
}

var AuthState = ["", "", "审核中", "审核通过", "审核不通过"];
var getMessageList = function(datas) {
    console.dir(datas);
    var messages = [];
    if (datas.length > 0) {
        id = datas[0]._id;
        for(var i in datas) {
            var data = {
                id : datas[i]._id,
                applyTime : dateFormat(datas[i].applyTime),
                state : AuthState[datas[i].state],
                message: datas[i].message,
                authTime: dateFormat(datas[i].authTime),
                dailyPhoto: datas[i].avatar450,
                beautyPhoto: datas[i].authAvatar
            };
            messages.push(data);
        }
    }
    return messages;
}
function showMessageList (account, dataFromServer) {
    console.log("showMessageList, account: " + JSON.stringify(account) + ", data: " + JSON.stringify(dataFromServer));

    Ext.getDom('player_data').innerHTML = '';
    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', type:'string'},
            {name: 'applyTime', type:'string'},
            {name: 'state', type:'string'},
            {name: 'message', type: 'string'},
            {name: 'authTime', type: 'string'},
            {name: 'dailyPhoto', type: 'string'},
            {name: 'beautyPhoto', type: 'string'}
        ]
    });

    var store = Ext.create('Ext.data.JsonStore', {
        model: LogDataStruct,
        data: dataFromServer
    });

    var logList = Ext.create('Ext.grid.Panel', {
        store: store,
        viewConfig  : {
            enableTextSelection:true
        },
        loadMask: true,
        columnLines:true,
        autoScroll : true,
        height: 260,
        columns: [
            {text: '申请时间', width: 150, dataIndex: 'applyTime'},
            {text: '状态', width: 80, dataIndex: 'state'},
            {text: '说明', width: 400, dataIndex: 'message'},
            {text: '审核时间', width: 150, dataIndex: 'authTime'}
        ],
        width: 800
    });

    logList.addListener('cellclick',function(grid, rowIndex, columnIndex, e)
    {
        //Todo Something here
        var sm = grid.getSelectionModel();
        var records = sm.getSelection();
        if (!records || records.length != 1) {
            alert("请选定要查询的目录");
            return;
        }

        Ext.getCmp('beautyPhoto').body.update('<img style="max-height:250px;max-width:250px" src=' + getAvatar(records[0].get('beautyPhoto')) + '> ');
        Ext.getCmp('dailyPhoto').body.update('<img style="max-height:250px;max-width:250px" src=' +  getAvatar(records[0].get('dailyPhoto')) + '> ');
        id = records[0].get('id');
    });

    var beautyPanel = new Ext.Panel({
        title: '',
        width: 850,
        height: 300,
        layout : 'column',
        frame: true,
        border: false,
        baseCls:'border-style:none',
        items: [
            {
                border: false,
                width: 280,
                height: 280,
                baseCls:'border-style:none',
                frame: true,
                style : 'margin-left:10px;',
                items: [
                    {
                        xtype:"label",
                        html: "<br><font size=3>生活照, 所有玩家可见:" + "</font><br>"
                    },
                    {
                        xtype:'panel',
                        width: 250,
                        height: 250,
                        id:'dailyPhoto',
                        html:'<img style="max-height:250px;max-width:250px" src=' + getAvatar(dataFromServer.length ? dataFromServer[0].dailyPhoto : "") + '> '
                    }
                ]
            },
            {
                border: false,
                width: 280,
                height: 280,
                baseCls:'border-style:none',
                frame: true,
                style : 'margin-top:15px;margin-left:10px;',
                items: [
                    {
                        xtype:"label",
                        html: "<font size=3>现拍认证照, 仅客服可见: </font><br>"
                    },
                    {
                        xtype:'panel',
                        width: 250,
                        height: 250,
                        id:'beautyPhoto',
                        html:'<img style="max-height:250px;max-width:250px" src=' + getAvatar(dataFromServer.length ? dataFromServer[0].beautyPhoto : "") + '> '
                    }
                ]
            } ,
            {
                border: false,
                width: 200,
                height: 280,
                baseCls:'border-style:none',
                frame: true,
                style : 'margin-top:20px;margin-left:5px;',
                items: [
                    {
                        xtype:"label",
                        html: "<p style=font-size:14px;margin:8px>玩家昵称: " + account.nickname + "</p>"
                    },
                    {
                        xtype:"label",
                        html:"<p style=font-size:14px;margin:8px>VIP: " + account.vipLevel + " 级</p>"
                    },
                    {
                        xtype:"label",
                        html: "<p style=font-size:14px;margin:8px>总充值: " + account.totalRecharge + "</p>"
                    },
                    {
                        xtype:"label",
                        html: "<p style=font-size:14px;margin:8px>钻石: " + account.diamond + "</p>"
                    },
                    {
                        xtype:"label",
                        html: "<p style=font-size:14px;margin:8px>金币: " + account.gamingMoney + "</p>"
                    },
                    {
                        xtype:"label",
                        html: "<p style=font-size:14px;margin:8px>胜利: " + account.wins + "</p>"
                    },
                    {
                        xtype:"label",
                        html: "<p style=font-size:14px;margin:8px>失败: " + account.losses + "</p>"
                    },
                    {
                        xtype:"label",
                        html: "<p style=font-size:14px;margin:8px>签名: " + account.description + "</p>"
                    }
                ]
            }
        ]
    });

    var authPanel = new Ext.Panel({
        width: 650,
        height: 600,
        frame: true,
        border: false,
        baseCls:'border-style:none',
        style : 'margin-left:10px;',
        items: [
            {
                xtype:"label",
                html: "<font size=3>认证列表: </font><br>"
            },
            logList
        ]
    });

    var totalPanel= new Ext.Panel({
        width: 900,
        height: 600,
        frame: true,
        border: false,
        items: [
            beautyPanel,
            authPanel
        ]
    });

    totalPanel.render('player_data');
};

function getAvatar(avatar) {
	console.log("getAvatar, path=" + avatarsPath + ", avatar=", avatar);

    if (!avatar) {
        return;
    }

    if (parseInt(avatar) <= 20) {
        return "../../img/user_photo" + avatar + ".jpg";
    }

	if(avatar.indexOf("http") != -1){
		return avatar;
	}

    return avatarsPath + avatar;
};





