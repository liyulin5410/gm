var typeId = 0;
function present(){
    createPresentForm();

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/present/type",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            typeId =  (json.length || 0) + 1;
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
            {name: 'coupon', type:'string'},
            {name: 'giftType', type:'string'}
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
            {text: '类型ID', width: 80, dataIndex: 'type'},
            {text: '类型名称', width: 160, dataIndex: 'name'}
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
            Ext.Msg.alert("提示", "请选定要查询的礼品批次");
            return;
        }

        console.log(records[0].get('type'));
        Ext.Ajax.request({
            url: "http://" + window.location.host + "/present/query",
            method: 'GET',
            params: {"type": records[0].get('type')},
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

function createPresentForm() {
    var presentForm = new Ext.FormPanel({
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
                text: "礼品类型"
            },
            {
                xtype : 'button',
                text:'新增类型',
                handler : function(){
                    addBatch();
                }
            },
            {
                xtype : 'button',
                text:'修改类型',
                handler : function(){
                    modifyBatch();
                }
            }
        ]
    });
    presentForm.render('condition');
}

var nameOptions = new Ext.data.SimpleStore({
    fields: ['nameId', 'nameOptions'],
    data: [['1','10元移动充值卡'], ['2','20元移动充值卡'], ['3','50元移动充值卡'],
           ['4','20元联通充值卡'], ['5','50元联通充值卡'],
           ['6','30元电信充值卡'], ['7','50元电信充值卡'],
           ['8','10万金币'], ['9','50万金币']]
});

var options = new Ext.data.SimpleStore({
    fields: ['id', 'option'],
    data: [['1','移动充值卡'],['2','联通充值卡'],['3','电信充值卡'],['4','金币'],['5','其它']]
});

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
                fieldLabel: '类型ID',
                labelWidth: 55,
                width: 230,
                name: 'type',
                value: typeId,
                readOnly: true
            },
            {
                xtype : 'combo',
                fieldLabel: '类型名称',
                labelWidth: 55,
                width: 300,
                name: 'name',
                model: 'local',
                store: nameOptions,
                displayField:'nameOptions',
                //editable : true,// 是否允许输入
                value: '10元移动充值卡'
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
                fieldLabel: '所需礼券',
                labelWidth: 55,
                width: 230,
                name: 'coupon'
            },
            {
                xtype : 'combo',
                fieldLabel: '兑换类型',
                labelWidth: 55,
                width: 230,
                name: 'option',
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                value: '移动充值卡'
            },
            {
                xtype : 'button',
                style:'margin-top:40px;margin-left:300px;',
                text: "<font size=3px>提 交</font>",
                handler : function(){
                    submit();
                }
            }
        ]
    });

    var win = new Ext.Window({
        title:'新增礼品类型',
        width:700,
        height:250,
        closeAction:'hide',
        items:[addForm]
    });

    win.show();

    function submit(){
        var args = addForm.getForm().getValues();
        //var args = addForm.getForm().getFieldValues();
        console.log(args);
        if (args.type === "" || args.name === "") {
            Ext.Msg.alert("错误", "内容不能为空!");
            return;
        }

        if (!isToday(args.startTime) || !isToday(args.endTime)) {
            Ext.Msg.alert("错误", "时间格式错误!");
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/present/create",
            method: 'POST',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.Msg.alert("错误", "新增礼品类型失败");
                } else {
                    typeId = (json.length || 0) + 1;
                    drawBatch( json );
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "新增礼品类型失败");
            }
        });

        win.close();
    }
};

function modifyBatch(){
    var selectionModel = Ext.getCmp('batch').getSelectionModel();
    var records = selectionModel.getSelection();
    if (!records || records.length != 1) {
        Ext.Msg.alert("错误", "请选中要查询的礼品类型");
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
                fieldLabel: '类型ID',
                labelWidth: 55,
                width: 230,
                name: 'type',
                readOnly: true,
                value: records[0].get("type")
            },
            {
                xtype : 'combo',
                fieldLabel: '类型名称',
                labelWidth: 55,
                width: 300,
                name: 'name',
                model: 'local',
                store: nameOptions,
                displayField:'nameOptions',
                //editable : true,// 是否允许输入
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
                value: new Date(parseInt(records[0].get("startTime")))
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
                value: new Date(parseInt(records[0].get("endTime")))
            },
            {
                xtype : 'textfield',
                fieldLabel: '所需礼券',
                labelWidth: 55,
                width: 230,
                name: 'coupon',
                value: records[0].get("coupon")
            },
            {
                xtype : 'combo',
                fieldLabel: '兑换类型',
                labelWidth: 55,
                width: 230,
                name: 'option',
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                value: records[0].get("giftType")
            },
            {
                xtype : 'button',
                style:'margin-top:40px;margin-left:300px;',
                text: "<font size=3px>提 交</font>",
                handler : function(){
                    submit();
                }
            }
        ]
    });

    var win = new Ext.Window({
        title:'修改礼品类型',
        width:700,
        height:250,
        closeAction:'hide',
        items:[modifyForm]
    });
    win.show();

    function submit(){
        var args = modifyForm.getForm().getValues();
        console.log(args);
        if (args.type === "" || args.name === "") {
            Ext.Msg.alert("错误", "内容不能为空!");
            return;
        }

        if (!isToday(args.startTime) || !isToday(args.endTime)) {
            Ext.Msg.alert("错误", "时间格式错误!");
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/present/update",
            method: 'POST',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.Msg.alert("错误", "修改礼品类型失败");
                } else {
                    drawBatch( json );
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "修改礼品类型失败");
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
        height: 150,
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
                fieldLabel: '类型ID',
                labelWidth: 55,
                width: 230,
                readOnly:true,
                value : dataFromServer.type
            },
            {
                xtype : 'textfield',
                fieldLabel: '类型名称',
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
                fieldLabel: '所需礼券',
                labelWidth: 55,
                width: 230,
                readOnly:true,
                value : dataFromServer.coupon
            },
            {
                xtype : 'combo',
                fieldLabel: '兑换类型',
                labelWidth: 55,
                width: 230,
                name: 'option',
                model: 'local',
                store: options,
                displayField:'option',
                readOnly:true,
                value: dataFromServer.giftType
            }
        ]
    });

    var total = 0;
    var receivedCount = 0;
    for (var i in dataFromServer.receivedLogs) {
        ++total;
        if(dataFromServer.receivedLogs[i].queryId) {
            ++receivedCount;
        }
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
                text : "礼品数量: " + receivedCount + "(已兑)/"  + total + "(总数)"
            },
            {
                xtype : 'button',
                style : 'margin-left:300px;margin-top:10px;',
                text:'新增礼品',
                handler : function(){
                    addPresent(dataFromServer.type);
                }
            },
            {
                xtype : 'button',
                style : 'margin-left:15px;margin-top:10px;',
                text:'删除礼品',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定删除此礼品么?", function(e) {
                        if (e != "yes") {
                            //console.log(e);
                            return;
                        }
                        deletePresent(dataFromServer.type);
                    });
                }
            }
        ]
    });

    var totalPanel = new Ext.Panel({
        title: '',
        width: 872,
        height: 200,
        frame: true,
        items: [
            topPanel,
            bottomPanel
        ]
    });
    totalPanel.render("player_info");

    showPresentList(getPresentList(dataFromServer.receivedLogs));
};

function getPresentList(gifts) {
    var giftList = [];
    for (var i = gifts.length - 1; i >= 0; --i) {
        var ts =  gifts[i] ? gifts[i].ts : "";
        var gift = {
            id : gifts[i]._id,
            gift: gifts[i].gift,
            queryId : gifts[i] ? gifts[i].queryId : "",
            time : dateFormat(ts)
        }
        giftList.push(gift);
    }

    return giftList;
};

function showPresentList(PresentList) {
    console.log(PresentList);
    Ext.getDom('player_data').innerHTML = '';
    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', type: 'string'},
            {name: 'gift', type:'string'},
            {name: 'queryId', type:'string'},
            {name: 'time', type:'string'}
        ]
    });

    var store = Ext.create('Ext.data.JsonStore', {
        model: LogDataStruct,
        data: PresentList
    });

    var logList = Ext.create('Ext.grid.Panel', {
        store: store,
        viewConfig  : {
            enableTextSelection:true
        },
        loadMask: true,
        columnLines:true,
        columns: [
            {text: '礼品兑换结果说明', width: 550, dataIndex: 'gift'},
            {text: '玩家ID', width: 160, dataIndex: 'queryId'},
            {text: '兑换时间', width: 160, dataIndex: 'time'}
        ],
        id : "presentGrid",
        autoScroll : true,
        width : 'auto',
        height: 600
    });

    logList.render('player_data');
};

function addPresent(type){
    var presentForm = new Ext.FormPanel({
        frame: true,
        baseCls:'border-style:none',
        labelWidth:20,
        items:[
            {
                xtype : 'label',
                style:"position:relative;top:30px;left:30px",
                html: "<font size=2px>礼品兑换结果说明</font>"
            },
            {
                xtype : 'textarea',
                style : 'margin-left:30px;margin-top:35px;',
                width: 300,
                height: 200,
                name: 'present',
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
        title:'新增礼品',
        width:400,
        height:350,
        closeAction:'hide',
        items:[presentForm]
    });
    win.show();

    function submit(){
        var args = presentForm.getForm().getValues();
        if (args.present == "") {
            Ext.Msg.alert("错误", "礼品兑换结果说明不能为空!");
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/present/new",
            method: 'POST',
            params: {"type" : type, "present" : args.present},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.Msg.alert("错误", "新增礼品失败");
                } else {
                    Ext.Msg.alert("成功", "新增礼品成功");
                    showPresentList(getPresentList(json.receivedLogs));
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "新增礼品失败");
            }
        });

        win.close();
    }
};

function deletePresent(type){
    var selectionModel = Ext.getCmp('presentGrid').getSelectionModel();
    var records = selectionModel.getSelection();
    if (!records || records.length != 1) {
        Ext.Msg.alert("错误", "请选中要删除的礼品条目");
        return;
    }

    if (records[0].get("queryId")) {
        Ext.Msg.alert("错误", "已领取的礼品不能删除");
        return;
    }

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/present/delete",
        method: 'POST',
        params: {type : type, present : records[0].get("id")},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "删除礼品失败");
            } else {
                Ext.Msg.alert("成功", "成功删除礼品");
                showPresentList(getPresentList(json.receivedLogs));
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "删除礼品失败");
        }
    });
};

