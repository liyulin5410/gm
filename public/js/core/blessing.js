var blessingId = 0;
function blessing(){
    createBlessingForm();

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/blessing/list",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            blessingId =  (json.length || 0) + 1;
            drawBlessing( json );
        },
        failure: function(){
            Ext.Msg.alert("错误", "没有找到相关记录");
        }
    });
};

function drawBlessing( dataFromServer ){
    Ext.getDom('search_player').innerHTML = '';
    Ext.getDom('player_info').innerHTML = '';
    Ext.getDom('player_data').innerHTML = '';

    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'blessingId', type:'string'},
            {name: 'name', type:'string'},
            {name: 'message', type:'string'},
            {name: 'rechargeStartTime', type:'int'},
            {name: 'rechargeEndTime', type:'int'},
            {name: 'blessingStartTime', type:'int'},
            {name: 'blessingEndTime', type:'int'},
            {name: 'unitPrice', type:'int'},
            {name: 'awardType0', type:'int'},
            {name: 'awardRatio0', type:'int'},
            {name: 'minGamingMoney0', type:'int'},
            {name: 'maxGamingMoney0', type:'int'},
            {name: 'awardType1', type:'int'},
            {name: 'awardRatio1', type:'int'},
            {name: 'minGamingMoney1', type:'int'},
            {name: 'maxGamingMoney1', type:'int'},
            {name: 'awardType2', type:'int'},
            {name: 'awardRatio2', type:'int'},
            {name: 'minGamingMoney2', type:'int'},
            {name: 'maxGamingMoney2', type:'int'},
            {name: 'awardType3', type:'int'},
            {name: 'awardRatio3', type:'int'},
            {name: 'awardDetail', type:'string'}
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
            {text: '活动ID', width: 75, dataIndex: 'blessingId'},
            {text: '活动名称', width: 160, dataIndex: 'name'}
        ],
        style: 'margin-left:2px;',
        autoScroll : true,
        id : "blessing",
        height: 700
    });

    logList.render('search_player');
    logList.addListener('cellclick',function(grid, rowIndex, columnIndex, e)
    {
        //Todo Something here
        var sm = grid.getSelectionModel();
        var records = sm.getSelection();
        if (!records || records.length != 1) {
            alert("请选定要查询的活动!");
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/blessing/details",
            method: 'GET',
            params: {"blessingId": records[0].get('blessingId')},
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
    data: [[0,'金币'],[1, '礼品']]
});

function createBlessingForm() {
    var blessingForm = new Ext.FormPanel({
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
                xtype : 'button',
                text:'新增活动',
                handler : function(){
                    addBlessing();
                }
            },
            {
                xtype : 'button',
                text:'修改活动',
                handler : function(){
                    modifyBlessing();
                }
            }
        ]
    });
    blessingForm.render('condition');
}

function addBlessing(){
    if (Ext.getCmp("addAwardType0")) {
        return;
    }
    var unitPriceForm = new Ext.FormPanel({
        frame: true,
        layout : 'column',
        baseCls:'border-style:none',
        items:[
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '祈福单价',
                labelWidth: 55,
                width: 200,
                name: 'unitPrice',
                allowBlank : false,
                blankText:'此项不能为空'
            }
        ]
    });

    var awardsForm = new Ext.FormPanel({
        frame: true,
        layout : 'column',
        baseCls:'border-style:none',
        items:[
            {
                xtype : 'combo',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '类型',
                labelWidth: 35,
                width: 135,
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                valueField: 'id',
                hiddenName : 'awardHidden_0',
                id:'addAwardType0',
                name:"awardType0"
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '万分概率',
                labelWidth: 55,
                width: 155,
                name: 'awardRatio0',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '数量',
                labelWidth: 35,
                width: 135,
                name: 'minGamingMoney0',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:5px;',
                width: 100,
                name: 'maxGamingMoney0',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'combo',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '类型',
                labelWidth: 35,
                width: 135,
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                valueField: 'id',
                hiddenName : 'awardHidden_1',
                id:'addAwardType1',
                name:"awardType1"
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '万分概率',
                labelWidth: 55,
                width: 155,
                name: 'awardRatio1',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '数量',
                labelWidth: 35,
                width: 135,
                name: 'minGamingMoney1',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:5px;',
                width: 100,
                name: 'maxGamingMoney1',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'combo',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '类型',
                labelWidth: 35,
                width: 135,
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                valueField: 'id',
                hiddenName : 'awardHidden_2',
                id:'addAwardType2',
                name:"awardType2"
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '万分概率',
                labelWidth: 55,
                width: 155,
                name: 'awardRatio2',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '数量',
                labelWidth: 35,
                width: 135,
                name: 'minGamingMoney2',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:5px;',
                width: 100,
                name: 'maxGamingMoney2',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'combo',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '类型',
                labelWidth: 35,
                width: 135,
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                valueField: 'id',
                hiddenName : 'awardHidden_3',
                id:'addAwardType3',
                name:"awardType3"
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '万分概率',
                labelWidth: 55,
                width: 155,
                name: 'awardRatio3',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '简述',
                labelWidth: 35,
                width: 240,
                name: 'awardDetail',
                allowBlank : false,
                blankText:'此项不能为空'
            }
        ]
    });

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
                height: 150,
                width: 500,
                name: 'message',
                editable:true,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'datefield',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '充值开始',
                labelWidth: 55,
                width: 250,
                name: 'rechargeStartTime',
                value: new Date(),
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空'

            },
            {
                xtype : 'datefield',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '充值结束',
                labelWidth: 55,
                width: 250,
                name: 'rechargeEndTime',
                value: new Date(),
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'datefield',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '祈福开始',
                labelWidth: 55,
                width: 250,
                name: 'blessingStartTime',
                value: new Date(),
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空'

            },
            {
                xtype : 'datefield',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '祈福结束',
                labelWidth: 55,
                width: 250,
                name: 'blessingEndTime',
                value: new Date(),
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            unitPriceForm,
            awardsForm,
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
        title:'新增活动',
        width:700,
        height:530,
        closeAction:'close',
        items:[addForm]
    });

    Ext.getCmp("addAwardType0").setRawValue(options.data.items[0].data.option);
    Ext.getCmp("addAwardType0").setValue(options.data.items[0].data.id);
    Ext.getCmp("addAwardType1").setRawValue(options.data.items[0].data.option);
    Ext.getCmp("addAwardType1").setValue(options.data.items[0].data.id);
    Ext.getCmp("addAwardType2").setRawValue(options.data.items[0].data.option);
    Ext.getCmp("addAwardType2").setValue(options.data.items[0].data.id);
    Ext.getCmp("addAwardType3").setRawValue(options.data.items[1].data.option);
    Ext.getCmp("addAwardType3").setValue(options.data.items[1].data.id);

    win.on('close',function(){
        if(win){
            win.destroy();
        }
    });

    win.show();

    function submit(){
        var args = addForm.getForm().getValues();
        console.log(args);
        if (args.name === "" || args.message === "") {
            Ext.Msg.alert("错误", "内容不能为空!");
            return;
        }

        if (!isToday(args.rechargeStartTime) || !isToday(args.rechargeEndTime) || !isToday(args.blessingStartTime) || !isToday(args.blessingEndTime)) {
            Ext.Msg.alert("错误", "时间格式错误!");
            return;
        }

        if ((new Date(args.rechargeStartTime).getTime() >= new Date(args.rechargeEndTime).getTime()) ||
            (new Date(args.blessingStartTime).getTime() >= new Date(args.blessingEndTime).getTime())) {
            Ext.Msg.alert("错误", "时间格式错误!");
            return;
        }

        if (args.awardType0 !== 0 || args.awardType1 !== 0 || args.awardType2 !== 0 || args.awardType3 !== 1) {
            Ext.Msg.alert("错误", "奖励类型有误!");
            return;
        }

        if (parseInt(args.awardRatio0) + parseInt(args.awardRatio1) + parseInt(args.awardRatio2) + parseInt(args.awardRatio3) !== 10000) {
            Ext.Msg.alert("错误", "四种奖励概率相加不为10000!");
            return;
        }

        if (parseInt(args.minGamingMoney0) > parseInt(args.maxGamingMoney0) ||
            parseInt(args.minGamingMoney1) > parseInt(args.maxGamingMoney1) ||
            parseInt(args.minGamingMoney2) > parseInt(args.maxGamingMoney2)) {
            Ext.Msg.alert("错误", "金币数量有误!");
            return;
        }

        args.blessingId = blessingId;
        Ext.Ajax.request({
            url: "http://" + window.location.host + "/blessing/add",
            method: 'POST',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.Msg.alert("错误", "新增活动失败");
                } else {
                    blessingId = json.length + 1;
                    drawBlessing( json );
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "新增活动失败");
            }
        });

        win.close();
    }
};

function modifyBlessing(){
    var selectionModel = Ext.getCmp('blessing').getSelectionModel();
    var records = selectionModel.getSelection();
    if (!records || records.length != 1) {
        Ext.Msg.alert("错误", "请选中要查询的活动!");
        return;
    }

    if (Ext.getCmp("modifyAwardType0")) {
        return;
    }

    var unitPriceForm = new Ext.FormPanel({
        frame: true,
        layout : 'column',
        baseCls:'border-style:none',
        items:[
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '祈福单价',
                labelWidth: 55,
                width: 200,
                name: 'unitPrice',
                allowBlank : false,
                blankText:'此项不能为空',
                value: records[0].get("unitPrice")
            }
        ]
    });

    var awardsForm = new Ext.FormPanel({
        frame: true,
        layout : 'column',
        baseCls:'border-style:none',
        items:[
            {
                xtype : 'combo',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '类型',
                labelWidth: 35,
                width: 135,
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                valueField: 'id',
                hiddenName : 'awardHidden_0',
                id:'modifyAwardType0',
                name:"awardType0"
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '万分概率',
                labelWidth: 55,
                width: 155,
                name: 'awardRatio0',
                allowBlank : false,
                blankText:'此项不能为空',
                value: records[0].get("awardRatio0")
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '数量',
                labelWidth: 35,
                width: 135,
                name: 'minGamingMoney0',
                allowBlank : false,
                blankText:'此项不能为空',
                value: records[0].get("minGamingMoney0")
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:5px;',
                width: 100,
                name: 'maxGamingMoney0',
                allowBlank : false,
                blankText:'此项不能为空',
                value: records[0].get("maxGamingMoney0")
            },
            {
                xtype : 'combo',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '类型',
                labelWidth: 35,
                width: 135,
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                valueField: 'id',
                hiddenName : 'awardHidden_1',
                id:'modifyAwardType1',
                name:"awardType1"
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '万分概率',
                labelWidth: 55,
                width: 155,
                name: 'awardRatio1',
                allowBlank : false,
                blankText:'此项不能为空',
                value: records[0].get("awardRatio1")
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '数量',
                labelWidth: 35,
                width: 135,
                name: 'minGamingMoney1',
                allowBlank : false,
                blankText:'此项不能为空',
                value: records[0].get("minGamingMoney1")
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:5px;',
                width: 100,
                name: 'maxGamingMoney1',
                allowBlank : false,
                blankText:'此项不能为空',
                value: records[0].get("maxGamingMoney1")
            },
            {
                xtype : 'combo',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '类型',
                labelWidth: 35,
                width: 135,
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                valueField: 'id',
                hiddenName : 'awardHidden_2',
                id:'modifyAwardType2',
                name:"awardType2"
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '万分概率',
                labelWidth: 55,
                width: 155,
                name: 'awardRatio2',
                allowBlank : false,
                blankText:'此项不能为空',
                value: records[0].get("awardRatio2")
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '数量',
                labelWidth: 35,
                width: 135,
                name: 'minGamingMoney2',
                allowBlank : false,
                blankText:'此项不能为空',
                value: records[0].get("minGamingMoney2")
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:5px;',
                width: 100,
                name: 'maxGamingMoney2',
                allowBlank : false,
                blankText:'此项不能为空',
                value: records[0].get("maxGamingMoney2")
            },
            {
                xtype : 'combo',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '类型',
                labelWidth: 35,
                width: 135,
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                valueField: 'id',
                hiddenName : 'awardHidden_3',
                id:'modifyAwardType3',
                name:"awardType3"
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '万分概率',
                labelWidth: 55,
                width: 155,
                name: 'awardRatio3',
                allowBlank : false,
                blankText:'此项不能为空',
                value: records[0].get("awardRatio3")
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '简述',
                labelWidth: 35,
                width: 240,
                name: 'awardDetail',
                allowBlank : false,
                blankText:'此项不能为空',
                value: records[0].get("awardDetail")
            }
        ]
    });

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
                height: 150,
                width: 500,
                name: 'message',
                editable:true,
                allowBlank : false,
                blankText:'此项不能为空',
                value: records[0].get("message")
            },
            {
                xtype : 'datefield',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '充值开始',
                labelWidth: 55,
                width: 250,
                name: 'rechargeStartTime',
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空',
                value: new Date(parseInt(records[0].get("rechargeStartTime")))
            },
            {
                xtype : 'datefield',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '充值结束',
                labelWidth: 55,
                width: 250,
                name: 'rechargeEndTime',
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空',
                value: new Date(parseInt(records[0].get("rechargeEndTime")))
            },
            {
                xtype : 'datefield',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '祈福开始',
                labelWidth: 55,
                width: 250,
                name: 'blessingStartTime',
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空',
                value: new Date(parseInt(records[0].get("blessingStartTime")))
            },
            {
                xtype : 'datefield',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '祈福结束',
                labelWidth: 55,
                width: 250,
                name: 'blessingEndTime',
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空',
                value: new Date(parseInt(records[0].get("blessingEndTime")))
            },
            unitPriceForm,
            awardsForm,
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
        title:'修改活动',
        width:700,
        height:530,
        closeAction:'close',
        items:[modifyForm]
    });

    Ext.getCmp("modifyAwardType0").setRawValue(options.data.items[0].data.option);
    Ext.getCmp("modifyAwardType0").setValue(options.data.items[0].data.id);
    Ext.getCmp("modifyAwardType1").setRawValue(options.data.items[0].data.option);
    Ext.getCmp("modifyAwardType1").setValue(options.data.items[0].data.id);
    Ext.getCmp("modifyAwardType2").setRawValue(options.data.items[0].data.option);
    Ext.getCmp("modifyAwardType2").setValue(options.data.items[0].data.id);
    Ext.getCmp("modifyAwardType3").setRawValue(options.data.items[1].data.option);
    Ext.getCmp("modifyAwardType3").setValue(options.data.items[1].data.id);

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

        if (!isToday(args.rechargeStartTime) || !isToday(args.rechargeEndTime) ||
            !isToday(args.blessingStartTime) || !isToday(args.blessingEndTime)) {
            Ext.Msg.alert("错误", "时间格式错误!");
            return;
        }

        if ((new Date(args.rechargeStartTime).getTime() >= new Date(args.rechargeEndTime).getTime()) ||
            (new Date(args.blessingStartTime).getTime() >= new Date(args.blessingEndTime).getTime())) {
            Ext.Msg.alert("错误", "时间格式错误!");
            return;
        }

        if (args.awardType0 !== 0 || args.awardType1 !== 0 || args.awardType2 !== 0 || args.awardType3 !== 1) {
            Ext.Msg.alert("错误", "奖励类型有误!");
            return;
        }

        if (parseInt(args.awardRatio0) + parseInt(args.awardRatio1) + parseInt(args.awardRatio2) + parseInt(args.awardRatio3) !== 10000) {
            Ext.Msg.alert("错误", "四种奖励概率相加不为10000!");
            return;
        }

        console.log(args);
        args.blessingId = records[0].get("blessingId");

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/blessing/update",
            method: 'POST',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.Msg.alert("错误", "修改活动失败");
                } else {
                    drawBlessing( json );
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "修改活动失败");
            }
        });

        win.close();
    }
};

function drawDetails( dataFromServer ){
    Ext.getDom('player_info').innerHTML = '';
    Ext.getDom('player_data').innerHTML = '';

    var unitPriceForm = new Ext.FormPanel({
        frame: true,
        layout : 'column',
        baseCls:'border-style:none',
        items:[
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '祈福单价',
                labelWidth: 55,
                width: 200,
                name: 'unitPrice',
                readOnly:true,
                value: dataFromServer.unitPrice
            }
        ]
    });

    var awardsForm = new Ext.FormPanel({
        frame: true,
        layout : 'column',
        baseCls:'border-style:none',
        items:[
            {
                xtype : 'combo',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '类型',
                labelWidth: 35,
                width: 135,
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                valueField: 'id',
                hiddenName : 'awardHidden_0',
                id:'awardType0',
                name:"awardType0",
                readOnly:true
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '万分概率',
                labelWidth: 55,
                width: 155,
                name: 'awardRatio0',
                readOnly:true,
                value: dataFromServer.awardRatio0
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '数量',
                labelWidth: 35,
                width: 135,
                name: 'minGamingMoney0',
                readOnly:true,
                value: dataFromServer.minGamingMoney0
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:5px;',
                width: 100,
                name: 'maxGamingMoney0',
                readOnly:true,
                value: dataFromServer.maxGamingMoney0
            },
            {
                xtype : 'combo',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '类型',
                labelWidth: 35,
                width: 135,
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                valueField: 'id',
                hiddenName : 'awardHidden_1',
                id:'awardType1',
                name:"awardType1",
                readOnly:true
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '万分概率',
                labelWidth: 55,
                width: 155,
                name: 'awardRatio1',
                readOnly:true,
                value: dataFromServer.awardRatio1
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '数量',
                labelWidth: 35,
                width: 135,
                name: 'minGamingMoney1',
                readOnly:true,
                value: dataFromServer.minGamingMoney1
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:5px;',
                width: 100,
                name: 'maxGamingMoney1',
                readOnly:true,
                value: dataFromServer.maxGamingMoney1
            },
            {
                xtype : 'combo',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '类型',
                labelWidth: 35,
                width: 135,
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                valueField: 'id',
                hiddenName : 'awardHidden_2',
                id:'awardType2',
                name:"awardType2",
                readOnly:true
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '万分概率',
                labelWidth: 55,
                width: 155,
                name: 'awardRatio2',
                readOnly:true,
                value: dataFromServer.awardRatio2
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '数量',
                labelWidth: 35,
                width: 135,
                name: 'minGamingMoney2',
                readOnly:true,
                value: dataFromServer.minGamingMoney2
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:5px;',
                width: 100,
                name: 'maxGamingMoney2',
                readOnly:true,
                value: dataFromServer.maxGamingMoney2
            },
            {
                xtype : 'combo',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '类型',
                labelWidth: 35,
                width: 135,
                model: 'local',
                store: options,
                displayField:'option',
                editable : false,// 是否允许输入
                valueField: 'id',
                hiddenName : 'awardHidden_3',
                id:'awardType3',
                name:"awardType3",
                readOnly:true
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '万分概率',
                labelWidth: 55,
                width: 155,
                name: 'awardRatio3',
                readOnly:true,
                value: dataFromServer.awardRatio3
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:25px;',
                fieldLabel: '简述',
                labelWidth: 35,
                width: 240,
                name: 'awardDetail',
                readOnly:true,
                value: dataFromServer.awardDetail
            }
        ]
    });

    var topPanel = new Ext.FormPanel({
        title: '',
        id : "detail",
        width:700,
        height:300,
        layout : 'column',
        frame: true,
        baseCls:'border-style:none',
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
                height: 150,
                width: 500,
                name: 'message',
                readOnly:true,
                value: dataFromServer.message
            },
            {
                xtype : 'datefield',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '充值开始',
                labelWidth: 55,
                width: 250,
                name: 'rechargeStartTime',
                format: 'Y-m-d H:i:s',
                readOnly:true,
                value: new Date(dataFromServer.rechargeStartTime)
            },
            {
                xtype : 'datefield',
                style : 'margin-top:10px;margin-left:15px;',
                fieldLabel: '充值结束',
                labelWidth: 55,
                width: 250,
                name: 'rechargeEndTime',
                format: 'Y-m-d H:i:s',
                readOnly:true,
                value: new Date(dataFromServer.rechargeEndTime)
            },
            {
                xtype : 'datefield',
                style : 'margin-top:10px;margin-left:65px;',
                fieldLabel: '祈福开始',
                labelWidth: 55,
                width: 250,
                name: 'blessingStartTime',
                format: 'Y-m-d H:i:s',
                readOnly:true,
                value: new Date(dataFromServer.blessingStartTime)
            },
            {
                xtype : 'datefield',
                style : 'margin-top:10px;margin-left:15px;',
                fieldLabel: '祈福结束',
                labelWidth: 55,
                width: 250,
                name: 'blessingEndTime',
                format: 'Y-m-d H:i:s',
                readOnly:true,
                value: new Date(dataFromServer.blessingEndTime)
            },
            unitPriceForm,
            awardsForm
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
                id : 'blessingState',
                style : 'margin-left:15px;margin-top:23px;',
                text :  "状态: " + (dataFromServer.state ? "开 启" : "关 闭")
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
                            url: "http://" + window.location.host + "/blessing/setState",
                            method: 'POST',
                            params: {"blessingId": dataFromServer.blessingId, "state": dataFromServer.state ? 0 : 1},
                            success: function(response){
                                var json = Ext.JSON.decode(response.responseText);
                                if (json.resultCode === 200) {
                                    Ext.Msg.alert("成功", "操作成功");
                                    Ext.getCmp("blessingState").setText("状态: " + (dataFromServer.state ? "关 闭" : "开 启"));
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
                    getBlessingAccounts(dataFromServer.blessingId);
                }
            },
            {
                xtype : 'button',
                style : 'margin-left:150px;margin-top:20px;',
                text: "增加礼品",
                handler : function(){
                    addAward(dataFromServer.blessingId);
                }
            },
            {
                xtype : 'button',
                style : 'margin-left:10px;margin-top:20px;',
                text: "删除礼品",
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定删除选中的礼品么?", function(e) {
                        if (e != "yes") {
                            return;
                        }
                        deleteAward(dataFromServer.blessingId);
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

    Ext.getCmp("awardType0").setRawValue(options.data.items[0].data.option);
    Ext.getCmp("awardType0").setValue(options.data.items[0].data.id);
    Ext.getCmp("awardType1").setRawValue(options.data.items[0].data.option);
    Ext.getCmp("awardType1").setValue(options.data.items[0].data.id);
    Ext.getCmp("awardType2").setRawValue(options.data.items[0].data.option);
    Ext.getCmp("awardType2").setValue(options.data.items[0].data.id);
    Ext.getCmp("awardType3").setRawValue(options.data.items[1].data.option);
    Ext.getCmp("awardType3").setValue(options.data.items[1].data.id);

    totalPanel.render("player_info");

    showBlessingAward(dataFromServer.FCodes);
};

function showBlessingAward (awardList) {
    Ext.getDom('player_data').innerHTML = '';
    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'FCode', type:'string'},
            {name: 'queryId', type:'string'},
            {name: 'nickname', type:'string'}
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
            {text: '礼品详情', width: 350, dataIndex: 'FCode'},
            {text: '玩家ID', width: 100, dataIndex: 'queryId'},
            {text: '玩家昵称', width: 100, dataIndex: 'nickname'}
        ],
        id : "awardList",
        autoScroll : true,
        width : 'auto',
        height: 200
    });

    logList.render('player_data');
};

function addAward(blessingId){
    var awardForm = new Ext.FormPanel({
        frame: true,
        baseCls:'border-style:none',
        items:[
            {
                xtype : 'textarea',
                fieldLabel: '礼品详情',
                style : 'margin-top:20px;margin-left:20px;',
                labelWidth: 55,
                height: 130,
                width: 300,
                name: 'FCode'
            },
            {
                xtype : 'button',
                style:'margin-top:10px;margin-left:170px;',
                text: "<font size=3px>提 交</font>",
                handler : function(){
                    submit();
                }
            }
        ]
    });

    var win = new Ext.Window({
        title:'增加礼品',
        width:400,
        height:250,
        closeAction:'hide',
        items:[awardForm]
    });
    win.show();

    function submit(){
        var args = awardForm.getForm().getValues();
        if (args.FCode === "") {
            Ext.Msg.alert("错误", "礼品详情不能为空!");
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/blessing/addAward",
            method: 'POST',
            params: {"blessingId" : blessingId, "FCode" : args.FCode},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.Msg.alert("错误", "增加礼品失败");
                } else {
                    Ext.Msg.alert("成功", "增加礼品成功");
                    showBlessingAward(json);
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "增加礼品失败");
            }
        });

        win.close();
    }
};

function deleteAward(blessingId){
    var selectionModel = Ext.getCmp('awardList').getSelectionModel();
    var records = selectionModel.getSelection();
    if (!records || records.length != 1) {
        Ext.Msg.alert("错误", "请选中要删除的礼品条目");
        return;
    }

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/blessing/deleteAward",
        method: 'POST',
        params: {blessingId : blessingId, FCode : records[0].get("FCode")},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "删除礼品失败");
            } else {
                Ext.Msg.alert("成功", "成功删除礼品");
                showActivityAward(isDanBi, json);
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "删除礼品失败");
        }
    });
};

function getBlessingAccounts(blessingId){
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/blessing/getBlessingAccounts",
        method: 'GET',
        params: {blessingId : blessingId},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);

            showBlessingAccounts(json);
        },
        failure: function(){
            Ext.Msg.alert("错误", "查看活动玩家失败");
        }
    });
};

var showBlessingAccounts = function(dataFromServer) {
    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'queryId', type:'string'},
            {name: 'nickname', type:'string'},
            {name: 'recharge', type:'string'},
            {name: 'count', type:'string'},
            {name: 'gamingMoney', type: 'string'},
            {name: 'FCode', type: 'int'}
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
            {text: '充值', width: 100, dataIndex: 'recharge'},
            {text: '祈福次数', width: 100, dataIndex: 'count'},
            {text: '获得金币', width: 120, dataIndex: 'gamingMoney'},
            {text: '获得礼品次数', width: 80, dataIndex: 'FCode'}
        ],
        width: 'auto'
    });

    var accountPanel = new Ext.Panel({
        width: 650,
        height: 400,
        frame: true,
        border: false,
        baseCls:'border-style:none',
        items: [
            logList
        ]
    });

    var win = new Ext.Window({
        title:'活动玩家',
        width:650,
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
};

