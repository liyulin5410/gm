function gmAction(){
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
                fieldLabel: '操作日期',
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
            url: "http://" + window.location.host + "/action/get",
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
                {name: 'nickname', type:'string'},
                {name: 'type', type: 'string'},
                {name: 'remarks', type: 'string'},
                {name: 'time', type: 'string'},
                {name: 'gmAccountName', type: 'string'}
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
            autoScroll : true,
            height: 700,
            columns: [
                {text: '玩家ID', width: 100, dataIndex: 'queryId'},
                {text: '玩家昵称', width: 150, dataIndex: 'nickname'},
                {text: '操作类型', width: 100,  dataIndex: 'type'},
                {text: '操作说明', width: 180,  dataIndex: 'remarks'},
                {text: '操作时间', width: 180, dataIndex: 'time'},
                {text: '操作者', width: 100, dataIndex: 'gmAccountName'}
            ],
            width: 'auto'
        });

        logList.render('dataRegion');
    }
};

