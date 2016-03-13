function giftExchange(){
    var logForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 'auto',
        height: 50,
        layout : 'column',
        items:[
            {
                xtype : 'datefield',
                style : 'margin-left:30px;margin-top:10px;',
                fieldLabel: '兑换日期',
                labelWidth: 55,
                width: 200,
                name: 'startTime',
                format: 'Y-m-d',
                value:Ext.Date.add(new Date(), Ext.Date.DAY, -30),
                editable:false,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'datefield',
                style : 'margin-left:30px;margin-top:10px;',
                width: 145,
                name: 'endTime',
                format: 'Y-m-d',
                value: new Date(),
                editable:false,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'button',
                style : 'margin-left:30px;margin-top:10px;',
                text:'查 询',
                handler : function(){
                    submit();
                }
            }
        ]
    });

    logForm.render('condition');
    function submit(){
        //if (!logForm.getForm().isValid()) return;
        var args = logForm.getForm().getValues();
        Ext.Ajax.request({
            url: "http://" + window.location.host + "/presentExchange/get",
            method: 'GET',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.getDom('dataRegion').innerHTML = '';
                    Ext.Msg.alert("错误", "没有找到相关记录");
                } else {
                    drawTable(json);
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "没有找到相关记录");
            }
        });
    }

    function drawTable( dataFromServer ){
        Ext.getDom('dataRegion').innerHTML = '';
        Ext.define('LogDataStruct', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'queryId', type:'string'},
                {name: 'accountName', type:'string'},
                {name: 'name', type: 'string'},
                {name: 'type', type: 'string'},
                {name: 'gift', type: 'string'},
                {name: 'ts', type: 'string'}
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
            frame: true,
            tripeRows:true,
            columns: [
                {text: '玩家ID', width: 80, dataIndex: 'queryId'},
                {text: '玩家昵称', width: 100, dataIndex: 'accountName'},
                {text: '类型名称', width: 120,  dataIndex: 'name'},
                {text: '类型ID', width: 60,  dataIndex: 'type'},
                {text: '礼品', width: 600, dataIndex: 'gift'},
                {text: '兑换时间', width: 200,  dataIndex: 'ts'}
            ],
            width: 'auto',
            autoScroll : true,
            height: 700
        });

        logList.render('dataRegion');
    }
};
