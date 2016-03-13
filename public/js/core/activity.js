var activityId = 0;
function activity(){
    createActivityForm();

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/activity/list",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            activityId =  (json.length || 0) + 1;
            drawActivities( json );
        },
        failure: function(){
            Ext.Msg.alert("错误", "没有找到相关记录");
        }
    });
};

function drawActivities( dataFromServer ){
    Ext.getDom('search_player').innerHTML = '';
    Ext.getDom('player_info').innerHTML = '';
    Ext.getDom('player_data').innerHTML = '';

    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'activityId', type:'string'},
            {name: 'name', type:'string'},
            {name: 'message', type:'string'},
            {name: 'rechargeStartTime', type:'string'},
            {name: 'rechargeEndTime', type:'string'},
            {name: 'receiveAwardStartTime', type:'string'},
            {name: 'receiveAwardEndTime', type:'string'},
            {name: 'isDanBi', type:'string'},
            {name: 'jump', type:'string'},
            {name: 'jumpUrl', type:'string'}
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
            {text: '限时活动ID', width: 75, dataIndex: 'activityId'},
            {text: '限时活动名称', width: 160, dataIndex: 'name'}
        ],
        style: 'margin-left:2px;',
        autoScroll : true,
        id : "activities",
        height: 700
    });

    logList.render('search_player');
    logList.addListener('cellclick',function(grid, rowIndex, columnIndex, e)
    {
        //Todo Something here
        var sm = grid.getSelectionModel();
        var records = sm.getSelection();
        if (!records || records.length != 1) {
            alert("请选定要查询的限时活动!");
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/activity/details",
            method: 'GET',
            params: {"activityId": records[0].get('activityId')},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                drawDetails( json );
            },
            failure: function(){
                Ext.Msg.alert("错误", "没有找到相关记录");
            }
        });
    });
};

var options = new Ext.data.SimpleStore({
    fields: ['id', 'option'],
    data: [[0,'累计充值返固定值'],[1, '累计充值返百分比'],[2, '单笔充值返固定值']]
});

function createActivityForm() {
    var activityForm = new Ext.FormPanel({
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
                text: "限时活动列表"
            },
            {
                xtype : 'button',
                text:'新增活动',
                handler : function(){
                    addActivity();
                }
            },
            {
                xtype : 'button',
                text:'修改活动',
                handler : function(){
                    modifyActivity();
                }
            }
        ]
    });
    activityForm.render('condition');
}

function addActivity(){
    if (Ext.getCmp("danBiId")) {
        return;
    }
    var addForm = new Ext.FormPanel({
        frame: true,
        layout : 'column',
        baseCls:'border-style:none',
        items:[
            {
                xtype : 'textfield',
                style : 'margin-top:20px;margin-left:65px;',
                fieldLabel: '活动名称',
                labelWidth: 55,
                width: 500,
                name: 'name',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'textarea',
                fieldLabel: '活动内容',
                style : 'margin-top:20px;margin-left:65px;',
                labelWidth: 55,
                height: 250,
                width: 500,
                name: 'message',
                editable:true,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'datefield',
                style : 'margin-top:20px;margin-left:15px;',
                fieldLabel: '充值累计开始时间',
                labelWidth: 105,
                width: 300,
                name: 'rechargeStartTime',
                value: new Date(),
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'datefield',
                style : 'margin-top:20px;margin-left:15px;',
                fieldLabel: '充值累计结束时间',
                labelWidth: 105,
                width: 300,
                name: 'rechargeEndTime',
                value: new Date(),
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'datefield',
                style : 'margin-top:20px;margin-left:15px;',
                fieldLabel: '领取奖励开始时间',
                labelWidth: 105,
                width: 300,
                name: 'receiveAwardStartTime',
                value: new Date(),
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空'

            },
            {
                xtype : 'datefield',
                style : 'margin-top:20px;margin-left:15px;',
                fieldLabel: '领取奖励结束时间',
                labelWidth: 105,
                width: 300,
                name: 'receiveAwardEndTime',
                value: new Date(),
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'combo',
                style : 'margin-top:20px;margin-left:65px;',
                fieldLabel: '奖励类型',
                labelWidth: 55,
                width: 250,
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                valueField: 'id',
                hiddenName : 'danBiFlag',
                id:'danBiId',
                name:"isDanBi"
            },
            {
                xtype : 'checkbox',
                style : 'margin-top:20px;margin-left:15px;',
                boxLabel: '点击跳转',
                width: 70,
                name: 'jump'
            },
            {
                xtype : 'textfield',
                style : 'margin-top:20px;',
                width: 250,
                name: 'jumpUrl'
            },
            {
                xtype : 'button',
                style:'margin-top:18px;margin-left:300px;',
                text: "<font size=3px>提 交</font>",
                handler : function(){
                    submit();
                }
            }
        ]
    });

    var win = new Ext.Window({
        title:'新增限时活动',
        width:700,
        height:530,
        closeAction:'close',
        items:[addForm]
    });
    Ext.getCmp("danBiId").setValue(1);
    win.on('close',function(){
        if(win){
            win.destroy();
        }
    });

    win.show();

    function submit(){
        var args = addForm.getForm().getValues();
        if (args.name === "" || args.message === "") {
            Ext.Msg.alert("错误", "内容不能为空!");
            return;
        }

        if (!isToday(args.rechargeStartTime) || !isToday(args.rechargeEndTime) || !isToday(args.receiveAwardStartTime) || !isToday(args.receiveAwardEndTime)) {
            Ext.Msg.alert("错误", "时间格式错误!");
            return;
        }

        if ((new Date(args.rechargeStartTime).getTime() >= new Date(args.rechargeEndTime).getTime()) ||
            (new Date(args.receiveAwardStartTime).getTime() >= new Date(args.receiveAwardEndTime).getTime())) {
            Ext.Msg.alert("错误", "时间格式错误!");
            return;
        }

        args.activityId = activityId;
        args.jump = args.jump === "on" ? 1 : 0;
        Ext.Ajax.request({
            url: "http://" + window.location.host + "/activity/add",
            method: 'POST',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.Msg.alert("错误", "新增限时活动失败");
                } else {
                    activityId = json.length + 1;
                    drawActivities( json );
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "新增限时活动失败");
            }
        });

        win.close();
    }
};

function modifyActivity(){
    var selectionModel = Ext.getCmp('activities').getSelectionModel();
    var records = selectionModel.getSelection();
    if (!records || records.length != 1) {
        Ext.Msg.alert("错误", "请选中要查询的限时活动!");
        return;
    }

    if (Ext.getCmp("danBiId1")) {
        return;
    }

    var modifyForm = new Ext.FormPanel({
        frame: true,
        layout : 'column',
        baseCls:'border-style:none',
        items:[
            {
                xtype : 'textfield',
                style : 'margin-top:20px;margin-left:65px;',
                fieldLabel: '活动名称',
                labelWidth: 55,
                width: 500,
                name: 'name',
                allowBlank : false,
                blankText:'此项不能为空',
                value: records[0].get("name")
            },
            {
                xtype : 'textarea',
                fieldLabel: '活动内容',
                style : 'margin-top:20px;margin-left:65px;',
                labelWidth: 55,
                height: 250,
                width: 500,
                name: 'message',
                editable:true,
                allowBlank : false,
                blankText:'此项不能为空',
                value: records[0].get("message")
            },
            {
                xtype : 'datefield',
                style : 'margin-top:20px;margin-left:15px;',
                fieldLabel: '充值累计开始时间',
                labelWidth: 105,
                width: 300,
                name: 'rechargeStartTime',
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空',
                value: new Date(parseInt(records[0].get("rechargeStartTime")))
            },
            {
                xtype : 'datefield',
                style : 'margin-top:20px;margin-left:15px;',
                fieldLabel: '充值累计结束时间',
                labelWidth: 105,
                width: 300,
                name: 'rechargeEndTime',
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空',
                value: new Date(parseInt(records[0].get("rechargeEndTime")))
            },
            {
                xtype : 'datefield',
                style : 'margin-top:20px;margin-left:15px;',
                fieldLabel: '领取奖励开始时间',
                labelWidth: 105,
                width: 300,
                name: 'receiveAwardStartTime',
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空',
                value: new Date(parseInt(records[0].get("receiveAwardStartTime")))
            },
            {
                xtype : 'datefield',
                style : 'margin-top:20px;margin-left:15px;',
                fieldLabel: '领取奖励结束时间',
                labelWidth: 105,
                width: 300,
                name: 'receiveAwardEndTime',
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空',
                value: new Date(parseInt(records[0].get("receiveAwardEndTime")))
            },
            {
                xtype : 'combo',
                style : 'margin-top:20px;margin-left:65px;',
                fieldLabel: '奖励类型',
                labelWidth: 55,
                width: 250,
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                valueField: 'id',
                hiddenName : 'danBiFlag',
                id:'danBiId1',
                name:"isDanBi"
            },
            {
                xtype : 'checkbox',
                style : 'margin-top:20px;margin-left:15px;',
                boxLabel: '点击跳转',
                width: 70,
                name: 'jump',
                checked: parseInt(records[0].get("jump")) === 1
            },
            {
                xtype : 'textfield',
                style : 'margin-top:20px;',
                width: 250,
                name: 'jumpUrl',
                value: records[0].get("jumpUrl")
            },
            {
                xtype : 'button',
                style:'margin-top:18px;margin-left:300px;',
                text: "<font size=3px>提 交</font>",
                handler : function(){
                    submit();
                }
            }
        ]
    });


    var win = new Ext.Window({
        title:'修改限时活动',
        width:700,
        height:530,
        closeAction:'close',
        items:[modifyForm]
    });
    Ext.getCmp("danBiId1").setValue(parseInt(records[0].get("isDanBi")));
    win.on('close',function(){
        if(win){
            win.destroy();
        }
    });

    win.show();

    function submit(){
        var args = modifyForm.getForm().getValues();
        if (args.name === "" || args.message === "") {
            Ext.Msg.alert("错误", "内容不能为空!");
            return;
        }

        if (!isToday(args.rechargeStartTime) || !isToday(args.rechargeEndTime) || !isToday(args.receiveAwardStartTime) || !isToday(args.receiveAwardEndTime)) {
            Ext.Msg.alert("错误", "时间格式错误!");
            return;
        }

        if ((new Date(args.rechargeStartTime).getTime() >= new Date(args.rechargeEndTime).getTime()) ||
            (new Date(args.receiveAwardStartTime).getTime() >= new Date(args.receiveAwardEndTime).getTime())) {
            Ext.Msg.alert("错误", "时间格式错误!");
            return;
        }
        console.log(args);
        args.activityId = records[0].get("activityId");
        args.jump = args.jump === "on" ? 1 : 0;
        Ext.Ajax.request({
            url: "http://" + window.location.host + "/activity/update",
            method: 'POST',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.Msg.alert("错误", "修改限时活动失败");
                } else {
                    drawActivities( json );
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "修改限时活动失败");
            }
        });

        win.close();
    }
};

function drawDetails( dataFromServer ){
    Ext.getDom('player_info').innerHTML = '';
    Ext.getDom('player_data').innerHTML = '';

    var topPanel = new Ext.FormPanel({
        title: '',
        id : "detail",
        width:700,
        height:300,
        layout : 'column',
        frame: true,
        baseCls:'border-style:none',
        defaults: {
            labelAlign: 'left',
            msgTarget: 'side',
            style : 'margin-top:20px;margin-left:30px;font-size:12px;'
        },
        items: [
            {
                xtype : 'textfield',
                style : 'margin-top:20px;margin-left:65px;',
                fieldLabel: '活动名称',
                labelWidth: 55,
                width: 500,
                name: 'name',
                readOnly:true,
                value: dataFromServer.name
            },
            {
                xtype : 'textarea',
                fieldLabel: '活动内容',
                style : 'margin-top:20px;margin-left:65px;',
                labelWidth: 55,
                height: 250,
                width: 500,
                name: 'message',
                readOnly:true,
                value: dataFromServer.message
            },
            {
                xtype : 'datefield',
                style : 'margin-top:20px;margin-left:15px;',
                fieldLabel: '充值累计开始时间',
                labelWidth: 105,
                width: 300,
                name: 'rechargeStartTime',
                format: 'Y-m-d H:i:s',
                readOnly:true,
                value: new Date(dataFromServer.rechargeStartTime)
            },
            {
                xtype : 'datefield',
                style : 'margin-top:20px;margin-left:15px;',
                fieldLabel: '充值累计结束时间',
                labelWidth: 105,
                width: 300,
                name: 'rechargeEndTime',
                format: 'Y-m-d H:i:s',
                readOnly:true,
                value: new Date(dataFromServer.rechargeEndTime)
            },
            {
                xtype : 'datefield',
                style : 'margin-top:20px;margin-left:15px;',
                fieldLabel: '领取奖励开始时间',
                labelWidth: 105,
                width: 300,
                name: 'receiveAwardStartTime',
                format: 'Y-m-d H:i:s',
                readOnly:true,
                value: new Date(dataFromServer.receiveAwardStartTime)
            },
            {
                xtype : 'datefield',
                style : 'margin-top:20px;margin-left:15px;',
                fieldLabel: '领取奖励结束时间',
                labelWidth: 105,
                width: 300,
                name: 'receiveAwardEndTime',
                format: 'Y-m-d H:i:s',
                readOnly:true,
                value: new Date(dataFromServer.receiveAwardEndTime)
            },
            {
                xtype : 'combo',
                style : 'margin-top:20px;margin-left:65px;',
                fieldLabel: '奖励类型',
                labelWidth: 55,
                width: 250,
                model: 'local',
                store: options,
                displayField:'option',
                readOnly:true,
                valueField: 'id',
                hiddenName : 'danBiFlag',
                id:'danBiId2',
                name:"isDanBi"
            },
            {
                xtype : 'checkbox',
                style : 'margin-top:20px;margin-left:15px;',
                boxLabel: '点击跳转',
                width: 70,
                name: 'jump',
                checked: parseInt(dataFromServer.jump) === 1
            },
            {
                xtype : 'textfield',
                style : 'margin-top:20px;',
                width: 250,
                name: 'jumpUrl',
                value: dataFromServer.jumpUrl,
                readOnly:true
            }
        ]
    });

    var bottomPanel = new Ext.Panel({
        title: '',
        width: 700,
        height: 30,
        frame: true,
        baseCls:'border-style:none',
        layout : 'column',
        items: [
            {
                xtype : 'label',
                id : 'activityState',
                style : 'margin-left:15px;margin-top:23px;',
                text :  "活动状态: " + (dataFromServer.state ? "开 启" : "关 闭")
            },
            {
                xtype : 'button',
                style : 'margin-left:15px;margin-top:20px;',
                id : "closeButton",
                text: dataFromServer.state ? "关 闭" : "开 启",
                handler : function(){
                    var msgText = dataFromServer.state ? "您确定关闭此活动?" : "您确定开启此活动?";

                    Ext.MessageBox.confirm("提示", msgText, function(e) {
                        if (e != "yes") {
                            return;
                        }

                        Ext.Ajax.request({
                            url: "http://" + window.location.host + "/activity/setState",
                            method: 'POST',
                            params: {"activityId": dataFromServer.activityId, "state": dataFromServer.state ? 0 : 1},
                            success: function(response){
                                var json = Ext.JSON.decode(response.responseText);
                                if (json.resultCode === 200) {
                                    Ext.Msg.alert("成功", "操作成功");
                                    Ext.getCmp("activityState").setText("活动状态: " + (dataFromServer.state ? "关 闭" : "开 启"));
                                    Ext.getCmp("closeButton").setText(dataFromServer.state ? "开 启" : "关 闭");
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
            },
            {
                xtype : 'button',
                style : 'margin-left:50px;margin-top:20px;',
                text: "查看活动玩家",
                handler : function(){
                    getActivityAccounts(dataFromServer.activityId);
                }
            },
            {
                xtype : 'button',
                style : 'margin-left:150px;margin-top:20px;',
                text: "新增奖励",
                handler : function(){
                    addAward(dataFromServer.activityId, dataFromServer.isDanBi);
                }
            },
            {
                xtype : 'button',
                style : 'margin-left:10px;margin-top:20px;',
                text: "删除奖励",
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定删除选中的活动奖励么?", function(e) {
                        if (e != "yes") {
                            return;
                        }
                        deleteAward(dataFromServer.activityId, dataFromServer.isDanBi);
                    });
                }
            }
        ]
    });

    var totalPanel = new Ext.Panel({
        title: '',
        width: 872,
        height: 500,
        frame: true,
        items: [
            topPanel,
            bottomPanel
        ]
    });
    Ext.getCmp("danBiId2").setValue(parseInt(dataFromServer.isDanBi));
    totalPanel.render("player_info");

    showActivityAward(dataFromServer.isDanBi, dataFromServer.awards);
};

function showActivityAward (isDanBi, awardList) {
    if (isDanBi === 1) {
        for (var i in awardList) {
            awardList[i].diamond = !awardList[i].diamond ? "" : awardList[i].diamond + "%";
            awardList[i].gamingMoney = !awardList[i].gamingMoney ? "" : awardList[i].gamingMoney + "%";
        }
    }
    Ext.getDom('player_data').innerHTML = '';
    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'recharge', type:'string'},
            {name: 'diamond', type:'string'},
            {name: 'gamingMoney', type:'string'}
        ]
    });

    var store = Ext.create('Ext.data.JsonStore', {
        model: LogDataStruct,
        data: awardList
    });

    var logList = Ext.create('Ext.grid.Panel', {
        store: store,
        viewConfig  : {
            enableTextSelection:true
        },
        loadMask: true,
        columnLines:true,
        columns: [
            {text: '充值钻石', width: 150, dataIndex: 'recharge'},
            {text: '奖励钻石', width: 150, dataIndex: 'diamond'},
            {text: '领取金币', width: 150, dataIndex: 'gamingMoney'}
        ],
        id : "awardList",
        autoScroll : true,
        width : 'auto',
        height: 200
    });

    logList.render('player_data');
};

function addAward(activityId, isDanBi){
    var awardForm = new Ext.FormPanel({
        frame: true,
        baseCls:'border-style:none',
        items:[
            {
                xtype : 'textfield',
                style : 'margin-left:70px;margin-top:30px;',
                fieldLabel: '充值钻石',
                labelWidth: 70,
                width: 200,
                name: 'recharge',
                value: 0,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'textfield',
                style : 'margin-left:70px;margin-top:20px;',
                fieldLabel: '奖励钻石',
                labelWidth: 70,
                width: 200,
                name: 'diamond',
                value: 0,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'textfield',
                style : 'margin-left:70px;margin-top:20px;',
                fieldLabel: '奖励金币',
                labelWidth: 70,
                width: 200,
                name: 'gamingMoney',
                value: 0,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'button',
                style:'margin-top:20px;margin-left:170px;',
                text: "<font size=3px>提 交</font>",
                handler : function(){
                    submit(isDanBi);
                }
            }
        ]
    });

    var win = new Ext.Window({
        title:'新增活动奖励',
        width:400,
        height:250,
        closeAction:'hide',
        items:[awardForm]
    });
    win.show();

    function submit(isDanBi){
        var args = awardForm.getForm().getValues();
        var recharge = args.recharge || 0;
        if (recharge <= 0) {
            Ext.Msg.alert("错误", "充值钻石需大于0, 请修改!");
            return;
        }

        if (isDanBi === 1) {
            var diamondIndex = args.diamond.indexOf("%");
            var gamingMoneyIndex = args.gamingMoney.indexOf("%");
            if (diamondIndex <= 0 || gamingMoneyIndex <= 0) {
                Ext.Msg.alert("错误", "奖励钻石和金币格式错误(百分比)，请修改!");
                return;
            }

            if (diamondIndex > 0) {
                args.diamond = parseInt(args.diamond.slice(0, diamondIndex));
            }
            if (gamingMoneyIndex > 0) {
                args.gamingMoney = parseInt(args.gamingMoney.slice(0, gamingMoneyIndex));
            }
        }

        var diamond = args.diamond || 0;
        var gamingMoney = args.gamingMoney || 0;
        if (diamond <= 0 && gamingMoney <= 0) {
            Ext.Msg.alert("错误", "奖励钻石或金币需大于0, 请修改!");
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/activity/addAward",
            method: 'POST',
            params: {"activityId" : activityId, "recharge" : recharge, "diamond": diamond, "gamingMoney": gamingMoney},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.Msg.alert("错误", "新增活动奖励失败");
                } else {
                    Ext.Msg.alert("成功", "新增活动奖励成功");
                    showActivityAward(isDanBi, json);
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "新增活动奖励失败");
            }
        });

        win.close();
    }
};

function deleteAward(activityId, isDanBi){
    var selectionModel = Ext.getCmp('awardList').getSelectionModel();
    var records = selectionModel.getSelection();
    if (!records || records.length != 1) {
        Ext.Msg.alert("错误", "请选中要删除的活动奖励条目");
        return;
    }

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/activity/deleteAward",
        method: 'POST',
        params: {activityId : activityId, recharge : records[0].get("recharge")},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "删除活动奖励失败");
            } else {
                Ext.Msg.alert("成功", "成功删除活动奖励");
                showActivityAward(isDanBi, json);
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "删除活动奖励失败");
        }
    });
};

function getActivityAccounts(activityId){
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/activity/getActivityAccounts",
        method: 'GET',
        params: {activityId : activityId},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            var total = 0;
            var receiveds = 0;
            for(var i in json) {
                total++;
                if (json[i].isReceived) {
                    receiveds++;
                    json[i].isReceived = "已领";
                } else {
                    json[i].isReceived = "";
                }
            }
            showActivityAccounts(json, receiveds, total);
        },
        failure: function(){
            Ext.Msg.alert("错误", "查看活动玩家失败");
        }
    });
};

var showActivityAccounts = function(dataFromServer, receiveds, total) {
    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'queryId', type:'string'},
            {name: 'nickname', type:'string'},
            {name: 'recharge', type:'string'},
            {name: 'isReceived', type:'string'}
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
        height: 400,
        columns: [
            {text: '玩家ID', width: 100, dataIndex: 'queryId'},
            {text: '玩家昵称', width: 120, dataIndex: 'nickname'},
            {text: '充值钻石', width: 120, dataIndex: 'recharge'},
            {text: '状态', width: 100, dataIndex: 'isReceived'}
        ],
        width: 'auto'
    });

    var accountPanel = new Ext.Panel({
        width: 450,
        height: 400,
        frame: true,
        border: false,
        baseCls:'border-style:none',
        items: [
            logList
        ]
    });

    var win = new Ext.Window({
        title:'已达到条件的玩家    已领:' + receiveds + '/' + total,
        width:450,
        height:400,
        closeAction:'close',
        items:[accountPanel]
    });

    win.on('close',function(){
        if(win){
            win.destroy();
        }
    });

    win.show();
}






