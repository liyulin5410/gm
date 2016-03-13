/**
 * Created with JetBrains WebStorm.
 * User: poo
 * Date: 13-7-30
 * Time: 上午9:25
 * To change this template use File | Settings | File Templates.
 */
var batchId = 0;
function cdKeyManage(){
    createCDKeyForm();

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/CDKEY/batch",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            batchId =  (json.length || 0) + 1;
            drawBatch( json );
        },
        failure: function(){
            Ext.Msg.alert("错误", "没有找到相关记录");
        }
    });
};

function drawBatch( dataFromServer ){
    Ext.getDom('search_player').innerHTML = '';
    Ext.getDom('player_info').innerHTML = '';
    Ext.getDom('player_data').innerHTML = '';

    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'type', type:'string'},
            {name: 'name', type:'string'},
            {name: 'startTime', type:'string'},
            {name: 'endTime', type:'string'},
            {name: 'diamond', type:'string'},
            {name: 'gamingMoney', type:'string'},
            {name: 'canMany', type:'string'}
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
            {text: '批次ID', width: 80, dataIndex: 'type'},
            {text: '批次名称', width: 160, dataIndex: 'name'}
        ],
        style: 'margin-left:2px;',
        autoScroll : true,
        id : "batch",
        height: 700
    });

    logList.render('search_player');
    logList.addListener('cellclick',function(grid, rowIndex, columnIndex, e)
    {
        //Todo Something here
        var sm = grid.getSelectionModel();
        var records = sm.getSelection();
        if (!records || records.length != 1) {
            alert("请选定要查询的CDKEY批次");
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/CDKEY/details",
            method: 'GET',
            params: {"batchId": records[0].get('type')},
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

function createCDKeyForm() {
    var cdKeyForm = new Ext.FormPanel({
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
                text: "CDKEY批次"
            },
            {
                xtype : 'button',
                text:'新增批次',
                handler : function(){
                    addBatch();
                }
            },
            {
                xtype : 'button',
                text:'修改批次',
                handler : function(){
                    modifyBatch();
                }
            }
        ]
    });
    cdKeyForm.render('condition');
}

function addBatch(){
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
                fieldLabel: '批次ID',
                labelWidth: 55,
                width: 230,
                name: 'batchId',
                value: batchId,
                readOnly: true
            },
            {
                xtype : 'textfield',
                fieldLabel: '批次名称',
                labelWidth: 55,
                width: 380,
                name: 'batchName',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'datefield',
                fieldLabel: '开始时间',
                labelWidth: 55,
                width: 230,
                name: 'startTime',
                value: new Date(),
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空'

            },
            {
                xtype : 'datefield',
                fieldLabel: '结束时间',
                labelWidth: 55,
                width: 230,
                name: 'endTime',
                value: new Date(),
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'textfield',
                fieldLabel: '奖励钻石',
                labelWidth: 55,
                width: 230,
                name: 'diamond'
            },
            {
                xtype : 'textfield',
                fieldLabel: '奖励金币',
                labelWidth: 55,
                width: 230,
                name: 'gamingMoney'
            },
            {
                xtype : 'checkbox',
                boxLabel: '同一玩家可领取多个CDKEY',
                width: 200,
                name: 'canMany'
            },
            {
                xtype : 'button',
                style:'margin-top:40px;margin-left:100px;',
                text: "<font size=3px>提 交</font>",
                handler : function(){
                    submit();
                }
            }
        ]
    });

    var win = new Ext.Window({
        title:'新增CDKEY批次',
        width:700,
        height:250,
        closeAction:'hide',
        items:[addForm]
    });

    win.show();

    function submit(){
        var args = addForm.getForm().getValues();
        args.canMany = args.canMany === "on" ? 1 : 0;
        console.log(args);
        if (args.batchId === "" || args.batchName === "") {
            Ext.Msg.alert("错误", "内容不能为空!");
            return;
        }

        if (!isToday(args.startTime) || !isToday(args.endTime)) {
            Ext.Msg.alert("错误", "时间格式错误!");
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/CDKEY/create",
            method: 'POST',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.Msg.alert("错误", "新增批次失败");
                } else {
                    batchId = json.length + 1;
                    drawBatch( json );
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "新增批次失败");
            }
        });

        win.close();
    }
};

function modifyBatch(){
    var selectionModel = Ext.getCmp('batch').getSelectionModel();
    var records = selectionModel.getSelection();
    if (!records || records.length != 1) {
        Ext.Msg.alert("错误", "请选中要查询的CDKEY批次");
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
                fieldLabel: '批次ID',
                labelWidth: 55,
                width: 230,
                name: 'batchId',
                readOnly: true,
                value: records[0].get("type")
            },
            {
                xtype : 'textfield',
                fieldLabel: '批次名称',
                labelWidth: 55,
                width: 380,
                name: 'batchName',
                allowBlank : false,
                blankText:'此项不能为空',
                value: records[0].get("name")
            },
            {
                xtype : 'datefield',
                fieldLabel: '开始时间',
                labelWidth: 55,
                width: 230,
                name: 'startTime',
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空',
                value: new Date(records[0].get("startTime"))
            },
            {
                xtype : 'datefield',
                fieldLabel: '结束时间',
                labelWidth: 55,
                width: 230,
                name: 'endTime',
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空',
                value: new Date(records[0].get("endTime"))
            },
            {
                xtype : 'textfield',
                fieldLabel: '奖励钻石',
                labelWidth: 55,
                width: 230,
                name: 'diamond',
                value: records[0].get("diamond")
            },
            {
                xtype : 'textfield',
                fieldLabel: '奖励金币',
                labelWidth: 55,
                width: 230,
                name: 'gamingMoney',
                value: records[0].get("gamingMoney")
            },
            {
                xtype : 'checkbox',
                boxLabel: '同一玩家可领取多个CDKEY',
                width: 200,
                name: 'canMany',
                checked: parseInt(records[0].get("canMany")) === 1
            },
            {
                xtype : 'button',
                style:'margin-top:40px;margin-left:100px;',
                text: "<font size=3px>提 交</font>",
                handler : function(){
                    submit();
                }
            }
        ]
    });

    var win = new Ext.Window({
        title:'修改CDKEY批次',
        width:700,
        height:250,
        closeAction:'hide',
        items:[modifyForm]
    });
    win.show();

    function submit(){
        var args = modifyForm.getForm().getValues();
        args.canMany = args.canMany === "on" ? 1 : 0;
        console.log(args);
        if (args.batchId === "" || args.batchName === "") {
            Ext.Msg.alert("错误", "内容不能为空!");
            return;
        }

        if (!isToday(args.startTime) || !isToday(args.endTime)) {
            Ext.Msg.alert("错误", "时间格式错误!");
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/CDKEY/update",
            method: 'POST',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.Msg.alert("错误", "修改批次失败");
                } else {
                    drawBatch( json );
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "修改批次失败");
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
        width: 700,
        height: 180,
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
                fieldLabel: '批次ID',
                labelWidth: 55,
                width: 230,
                readOnly:true,
                value : dataFromServer.type
            },
            {
                xtype : 'textfield',
                fieldLabel: '批次名称',
                labelWidth: 55,
                width: 380,
                readOnly:true,
                value : dataFromServer.name
            },
            {
                xtype : 'datefield',
                fieldLabel: '开始时间',
                labelWidth: 55,
                width: 230,
                format: 'Y-m-d H:i:s',
                readOnly:true,
                value : new Date(dataFromServer.startTime)
            },
            {
                xtype : 'datefield',
                fieldLabel: '结束时间',
                labelWidth: 55,
                width: 230,
                format: 'Y-m-d H:i:s',
                readOnly:true,
                value : new Date(dataFromServer.endTime)
            },
            {
                xtype : 'textfield',
                fieldLabel: '奖励钻石',
                labelWidth: 55,
                width: 230,
                readOnly:true,
                value : dataFromServer.diamond
            },
            {
                xtype : 'textfield',
                fieldLabel: '奖励金币',
                labelWidth: 55,
                width: 230,
                readOnly:true,
                value : dataFromServer.gamingMoney
            },
            {
                xtype : 'checkbox',
                boxLabel: '同一玩家可领取多个CDKEY',
                width: 200,
                name: 'canMany',
                readOnly:true,
                checked: parseInt(dataFromServer.canMany) === 1
            }
        ]
    });

    var receivedCount = 0;
    for (var i in dataFromServer.receivedLogs) {
        ++receivedCount;
    }
    var bottomPanel = new Ext.Panel({
        title: '',
        width: 700,
        height: 80,
        frame: true,
        baseCls:'border-style:none',
        layout : 'column',
        items: [
            {
                xtype : 'label',
                style : 'margin-left:30px;margin-top:13px;',
                text : "CDKEY数量: " + receivedCount + "(已领)/"  + dataFromServer.cdkeys.length + "(总数)"
            },
            {
                xtype : 'button',
                style : 'margin-left:300px;margin-top:10px;',
                text:'新增CDKEY',
                handler : function(){
                    addCDKey(dataFromServer.type);
                }
            },
            {
                xtype : 'button',
                style : 'margin-left:15px;margin-top:10px;',
                text:'删除CDKEY',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定删除此CDKEY么?", function(e) {
                        if (e != "yes") {
                            //console.log(e);
                            return;
                        }
                        deleteCDKey(dataFromServer.type);
                    });
                }
            }
        ]
    });

    var totalPanel = new Ext.Panel({
        title: '',
        width: 872,
        height: 230,
        frame: true,
        items: [
            topPanel,
            bottomPanel
        ]
    });
    totalPanel.render("player_info");

    showCDKeyList(getCDKeyList(dataFromServer.cdkeys, dataFromServer.receivedLogs));
};

function getCDKeyList (CDKeys, receives) {
    var CDKeyList = [];
    for (var i = CDKeys.length - 1; i >= 0; --i) {
        var key = CDKeys[i];
        var ts =  receives[key] ? receives[key].ts : "";
        var cdkey = {
            CDKEY: key,
            queryId : receives[key] ? receives[key].queryId : "",
            time : dateFormat(ts)
        }
        CDKeyList.push(cdkey);
    }

    return CDKeyList;
};

function showCDKeyList (CDKeyList) {
    console.log(CDKeyList);
    Ext.getDom('player_data').innerHTML = '';
    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'CDKEY', type:'string'},
            {name: 'queryId', type:'string'},
            {name: 'time', type:'string'}
        ]
    });

    var store = Ext.create('Ext.data.JsonStore', {
        model: LogDataStruct,
        data: CDKeyList
    });

    var logList = Ext.create('Ext.grid.Panel', {
        store: store,
        viewConfig  : {
            enableTextSelection:true
        },
        loadMask: true,
        columnLines:true,
        columns: [
            {text: 'CDKEY', width: 320, dataIndex: 'CDKEY'},
            {text: '玩家ID', width: 160, dataIndex: 'queryId'},
            {text: '领取时间', width: 160, dataIndex: 'time'}
        ],
        id : "CDKeyGrid",
        autoScroll : true,
        width : 'auto',
        height: 470
    });

    logList.render('player_data');
};

function addCDKey(batchId){
    var cdKeyForm = new Ext.FormPanel({
        frame: true,
        baseCls:'border-style:none',
        items:[
            {
                xtype : 'textfield',
                style : 'margin-left:70px;margin-top:30px;',
                fieldLabel: '新增CDKEY个数',
                labelWidth: 90,
                width: 250,
                name: 'CDKey',
                value: 1,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'button',
                style:'margin-top:20px;margin-left:170px;',
                text: "<font size=3px>提 交</font>",
                handler : function(){
                    submit();
                }
            }
        ]
    });

    var win = new Ext.Window({
        title:'新增CDKEY',
        width:400,
        height:160,
        closeAction:'hide',
        items:[cdKeyForm]
    });
    win.show();

    function submit(){
        var args = cdKeyForm.getForm().getValues();
        var cdKey = args.CDKey || 0;
        if (cdKey < 1) {
            Ext.Msg.alert("错误", "新增CDKEY个数大于等于1, 请修改!");
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/CDKEY/new",
            method: 'POST',
            params: {"batchId" : batchId, "CDKey" : cdKey},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.Msg.alert("错误", "新增CDKEY失败");
                } else {
                    Ext.Msg.alert("成功", "新增CDKEY成功");
                    showCDKeyList(getCDKeyList(json.cdkeys, json.receivedLogs));
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "新增CDKEY失败");
            }
        });

        win.close();
    }
};

function deleteCDKey(batchId){
    var selectionModel = Ext.getCmp('CDKeyGrid').getSelectionModel();
    var records = selectionModel.getSelection();
    if (!records || records.length != 1) {
        Ext.Msg.alert("错误", "请选中要删除的CDKEY条目");
        return;
    }

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/CDKEY/delete",
        method: 'POST',
        params: {batchId : batchId, CDKey : records[0].get("CDKEY")},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "删除CDKEY失败");
            } else {
                Ext.Msg.alert("成功", "成功删除CDKEY");
                showCDKeyList(getCDKeyList(json.cdkeys, json.receivedLogs));
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "删除CDKEY失败");
        }
    });
};






