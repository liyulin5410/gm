function accountAnnounce(){
    var logForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 'auto',
        height: 50,
        layout : 'column',
        items:[
            {
                xtype : 'textfield',
                style : 'margin-left:30px;margin-top:10px;',
                fieldLabel: '玩家ID',
                id: 'queryId',
                labelWidth: 50,
                width: 200
            },
            {
                xtype : 'button',
                style : 'margin-left:5px;margin-top:10px;',
                text:'查 询',
                handler : function(){
                    submit(0);
                }
            },
            {
                xtype : 'datefield',
                style : 'margin-left:30px;margin-top:10px;',
                fieldLabel: '日期',
                labelWidth: 30,
                width: 180,
                name: 'startTime',
                id: 'startTime',
                format: 'Y-m-d H:i:s',
                value:Ext.Date.add(new Date(), Ext.Date.DAY, -2),
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'datefield',
                style : 'margin-left:30px;margin-top:10px;',
                width: 150,
                name: 'endTime',
                id: 'endTime',
                format: 'Y-m-d H:i:s',
                value: Ext.Date.add(new Date(), Ext.Date.DAY, 1),
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'button',
                style : 'margin-left:30px;margin-top:10px;',
                text:'查 询',
                handler : function(){
                    submit(1);
                }
            }
        ]
    });

    logForm.render('condition');
    function submit(isDate){
        var startTime = Ext.getCmp('startTime').getValue();
        var endTime = Ext.getCmp('endTime').getValue();
        var queryId = isDate ? 0 : Ext.getCmp('queryId').getValue();

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/accountAnnounce/get",
            method: 'GET',
            params: {queryId : queryId, startTime : new Date(startTime).getTime(), endTime: new Date(endTime).getTime()},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.getDom('dataRegion').innerHTML = '';
                    Ext.Msg.alert("错误", "没有找到相关记录");
                } else {
                    for (var i in json) {
                        json[i].ts = dateFormat(json[i].ts);
                    }
                    console.log(json);
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
                {name: 'message', type: 'string'},
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
            autoScroll : true,
            height: 700,
            columns: [
                {text: '玩家ID', width: 100, dataIndex: 'queryId'},
                {text: '玩家昵称', width: 200, dataIndex: 'nickname'},
                {text: '内容', width: 650,  dataIndex: 'message'},
                {text: '时间', width: 150,  dataIndex: 'ts'}
            ],
            width: 'auto'
        });

        logList.render('dataRegion');
    }
};

