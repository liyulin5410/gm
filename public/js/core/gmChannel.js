function gmChannel(){
     var searchForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 'auto',
        height:50,
        region: 'center',
        layout : 'column',
        items:[
            {
                xtype : 'datefield',
                style : 'margin-left:20px; margin-top:10px;',
                fieldLabel: '反馈/回复日期',
                labelWidth: 90,
                width: 250,
                name: 'startTime',
                id: 'startTime',
                format: 'Y-m-d H:i:s',
                value:Ext.Date.add(new Date(), Ext.Date.DAY, -1),
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
                    submit(0, startTime, endTime);
                }
            },
            {
                xtype : 'textfield',
                style : 'margin-left:100px;margin-top:10px;',
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
            }
        ]
    });

    searchForm.render('condition');
};

function submit(isGM, startTime, endTime){
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/channel/query",
        method: 'GET',
        params: {isGM : isGM, startTime : new Date(startTime).getTime(), endTime: new Date(endTime).getTime()},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "没有找到相关记录");
            } else {
                json.sort(function(a, b) {
                    var bTs = new Date(b.ts).getTime();
                    var aTs = new Date(a.ts).getTime();
                    return bTs - aTs;
                });
                drawTable( json );
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "没有找到相关记录");
        }
    });
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

        var accountId =  records[0].get('_id');
        Ext.Ajax.request({
            url: "http://" + window.location.host + "/channel/getMessage",
            method: 'GET',
            params: {"accountId": accountId},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                drawMessage(accountId, json);
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
            {name: 'ts', type:'string'},
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
            {text: '已回复', width: 45, dataIndex: 'isGM'},
            {text: '最后反馈/回复时间', width: 130, dataIndex: 'ts'},
            {text: '玩家昵称', width: 120, dataIndex: 'nickname'}
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

        var accountId =  records[0].get('accountId');
        Ext.Ajax.request({
            url: "http://" + window.location.host + "/channel/getMessage",
            method: 'GET',
            params: {"accountId": accountId},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                drawMessage(accountId, json);
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
        ['1','*********************你好、在不***********************'],
        ['2','谢谢您的建议'],
        ['3','请直接提交问题'],
        ['4','已收到部分玩家反映问题，官方正努力查排查解决中，谢谢反馈'],
        ['5','公司招聘由人力资源负责，可到人才热线看有没合适岗位应聘，谢谢'],
        ['6','*********************账号、手机、游戏***********************'],
        ['7','游戏使用的是小米帐号，非小米手机可到app.xiaomi.com注册帐号，安装游戏'],
        ['8','安卓系统的手机就可以玩,可到小米应用商店app.xiaomi.com注册帐号安装游戏'],
        ['9','安卓系统的手机就可以玩,可到小米应用商店app.xiaomi.com/detail/41461安装'],
        ['10','系统设置-小米帐户/小米云帐户-删除帐户/注销帐户-登录新帐号，重新登录游戏'],
        ['11','系统设置-应用/应用管理-小米安全控件-清空数据，重新登录游戏'],
        ['12','**********************充值、VIP**********************'],
        ['13','请见大厅-帮助-VIP介绍。谢谢'],
        ['14','充值奖励是在大厅-活动中自己领取的，谢谢'],
        ['15','请点充值按钮，选左边购买金币，用钻石换金币。谢谢'],
        ['16','请点充值按钮，根据提示进行充值得到米币。米币换钻石，钻石换金币。谢谢'],
        ['17','VIP是永久的，累积的VIP级别越高，钻石换金币时获得的赠送就越多。谢谢'],
        ['18','月充值奖是按自然月算的，月初充值对领月充值奖来说最合算，谢谢'],
        ['19','1元人民币=1米币=1钻石=1万金币，钻石换金币时，VIP等级越高赠送比例越大'],
        ['20','最低5钻石起，用支付宝、网银支付、手机充值卡需5元，短信充需10元'],
        ['21','查到您的充值已经到账，谢谢您的支持'],
        ['22','没有查到你的充钻石记录，请检查是否充米币成功后没换钻石'],
        ['23','若米币充值未成功，请联系小米客服400-100-5678，谢谢'],
        ['24','不支持手机话费充值，建议用支付宝、网银支付、手机充值卡，谢谢'],
        ['25','短信充值易出错且2元只能充1钻不划算，建议用支付宝、网银支付、手机充值卡'],
        ['26','米币的返利是小米平台开展的活动，请联系小米客服400-100-5678'],
        ['27','****************获得金币、收礼、礼券、CDKey*******************'],
        ['28','请见大厅-帮助-获得金币。谢谢'],
        ['29','CDKey只在官方做活动时发放，发放前会预先公告的。谢谢'],
        ['30','按系统提示完成任务可获得礼券，用在大厅-礼品中兑换实物奖品。谢谢'],
        ['31','收礼物所得是直接加币，不需要领。普通玩家收礼得一成，认证美女三成。谢谢'],
        ['32','****************输牌、作弊*******************'],
        ['33','目前未发现外挂或作弊情况，游戏系统有防外挂和作弊技术'],
        ['34','系统是随机发牌的，充值多少只影响充值活动奖励，不影响牌的好坏'],
        ['35','系统是随机发牌的，所有玩家的牌都是遵循同一规则发出的，建议牌差时到低级场玩'],
        ['36','*******************闪退、掉线、掉币***********************'],
        ['37','你是不是发过喇叭没注意？喇叭消息3万一条。谢谢'],
        ['38','进竞技场需要每人6万金币，中途退出也会扣，请看竞技场说明。谢谢'],
        ['39','系统设置-应用/应用管理-快乐三张牌，点清空数据。谢谢'],
        ['40','建议清理手机内存，卸载不必要的应用。另系统设置-应用-快乐三张牌-清除数据'],
        ['41','清理操作不会影响金币和好友的，但聊天记录会被清空'],
        ['42','自动弃牌是因为网络信号差断线所致，请检查网络，注意信号不稳定时别下大注'],
        ['43','网络信号差导致的掉线，游戏官方是无法解决的，请注意信号不稳定时别下大注'],
        ['44','****************好友*******************'],
        ['45','在大厅-好友中，你可以找到，并和对方私聊。谢谢！'],
        ['46','在加好友之前，只能在牌场互找，直到桌上碰到。谢谢！'],
        ['47','同桌点对方头象，或喇叭消息后面点小图标，点加为好友，送一个礼物。谢谢！'],
        ['48','除了擂台场可以直接挑战好友外，其他场只能通过私聊或发喇叭叫了换桌互找。谢谢！'],
        ['49','别人加你后私聊向你说话，会出现在你大厅-好友的陌生人中，点加为好友才进你好友中'],
        ['50','可以和好友互找同桌，然后弃牌故意输给对方，也可以通过送礼物让好友提成'],
        ['51','****************图像、认证*******************'],
        ['52','在大厅-美女-我的认证-领排名奖。谢谢'],
        ['53','如果上传图像失败，一般是手机内存太少或图片尺寸太大。'],
        ['54','大厅点美女，我的认证中提交自拍认证照和日常生活照各一张。谢谢'],
        ['55','一般情况1个工作日内会有审核结果，有恶意、假冒认证嫌疑不会回复'],
        ['56','大厅-点自己图像-点图像、昵称或标签后小铅笔可修改相应内容。谢谢'],
        ['57','****************行骗、卖币*******************'],
        ['58','已封号，谢谢举报'],
        ['59','请提供确凿证据，以便官方查封骗子账号'],
        ['60','抱歉，无确凿证据，官方不能查封玩家账号'],
        ['61','金币不可以换成人民币、钻石、米币，也不允许私下买卖金币'],
        ['62','对不起！确定有卖币或行骗行为而查封的账号，是永久封号，不会解封的。'],
        ['63','****************辱骂、色情、举报*******************'],
        ['64','请提供ID或昵称，谢谢！'],
        ['65','已封号，谢谢举报，奖励10钻'],
        ['66','请文明游戏，不要恶意侮骂玩家或客服！'],
        ['67','严重警告：违规上传色情图片，尽快换掉，再犯封号！'],
        ['68','恶意侮骂他人的，官方知道会发出警告，严重者甚至封号的。谢谢 '],
        ['69','官方测试没发现游戏有问题，还是手机内存不足、网络信号不好的问题']
    ]
});

function drawMessage(accountId, dataFromServer){
    Ext.getDom('player_info').innerHTML = '';
    Ext.getDom('player_data').innerHTML = '';
    console.log(dataFromServer);

    var topPanel = new Ext.FormPanel({
        frame: true,
        width: 900,
        height: 100,
        layout : 'column',
        defaults: {
            labelAlign: 'left',
            msgTarget: 'side'
        },
        items: [
            {
                xtype : 'textfield',
                style : 'margin-top:20px;margin-left:30px;',
                fieldLabel: '客服回复',
                labelWidth: 55,
                width: 650,
                id : 'message',
                editable : true,// 是否允许输入
                value: ''
            },
            {
                xtype : 'button',
                style : 'margin-top:20px;margin-left:30px;',
                text:'回 复',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定回复此玩家么?", function(e) {
                        answer(e, accountId, 1);
                    });
                }
            },
            {
                xtype : 'button',
                style : 'margin-top:20px;margin-left:30px;',
                text:'删 除',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定删除此消息么?", function(e) {
                        deleteMessage(e, accountId);
                    });
                }
            },
            {
                xtype : 'combo',
                style : 'margin-top:10px;margin-left:30px;',
                width: 650,
                id : 'message1',
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                value: ''
            },
            {
                xtype : 'button',
                style : 'margin-top:10px;margin-left:30px;',
                text:'回 复',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定回复此玩家么?", function(e) {
                        answer(e, accountId, 2);
                    });
                }
            },
            {
                xtype : 'button',
                style : 'margin-top:10px;margin-left:30px;',
                text:'删 除',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定删除此消息么?", function(e) {
                        deleteMessage(e, accountId);
                    });
                }
            }
        ]
    });

    topPanel.render("player_info");

    showMessageList(getMessageList(dataFromServer));
};

var answer = function(e, accountId, flag) {
    if (e != "yes") {
        return;
    }

    var message = Ext.getCmp('message').getValue();
    var message1 = Ext.getCmp('message1').getValue();
    if (flag === 1 && message === "") {
        Ext.Msg.alert("提示", "回复内容不能为空!");
        return;
    } else if (flag === 2 && message1 === "") {
        Ext.Msg.alert("提示", "回复内容不能为空!");
        return;
    }
    if (flag === 2) {
        message = message1;
    }

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/channel/answer",
        method: 'POST',
        params: {accountId : accountId, "message": message},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "操作失败");
            } else {
                Ext.Msg.alert("成功", "操作成功");
                var json = Ext.JSON.decode(response.responseText);
                drawMessage(accountId, json);
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });
}

var getMessageList = function(data) {
    var messages = [];
    for (var i in data) {
        var message = {
            id : data[i]._id,
            nickname : data[i].isGM ? "客服" : data[i].nickname,
            content : data[i].message,
            time : dateFormat(data[i].ts)
        }
        messages.push(message);
    }
    return messages;
}
function showMessageList (messages) {
    console.log(messages);
    Ext.getDom('player_data').innerHTML = '';
    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', type:'string'},
            {name: 'nickname', type:'string'},
            {name: 'content', type:'string'},
            {name: 'time', type:'string'}
        ]
    });

    var store = Ext.create('Ext.data.JsonStore', {
        model: LogDataStruct,
        data: messages
    });

    var logList = Ext.create('Ext.grid.Panel', {
        store: store,
        viewConfig  : {
            enableTextSelection:true
        },
        loadMask: true,
        columnLines:true,
        columns: [
            {text: '名称', width: 100, dataIndex: 'nickname'},
            {text: '内容', width: 650, dataIndex: 'content'},
            {text: '时间', width: 150, dataIndex: 'time'}
        ],
        id : "MessageGrid",
        style: 'margin-left:1px;',
        autoScroll : true,
        width : 900,
        height : 600
    });

    logList.render('player_data');
};

var deleteMessage = function(e, accountId){
    if (e != "yes") {
        return;
    }

    var selectionModel = Ext.getCmp('MessageGrid').getSelectionModel();
    var records = selectionModel.getSelection();
    if (!records || records.length != 1) {
        Ext.Msg.alert("错误", "请选中要删除的消息条目");
        return;
    }

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/channel/delete",
        method: 'POST',
        params: {id : records[0].get("id"), accountId: accountId},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "删除消息失败");
            } else {
                Ext.Msg.alert("成功", "成功删除消息");
                showMessageList(getMessageList(json));
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "删除消息失败");
        }
    });
};





