function arpuData(){
    var logForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 'auto',
        height:35,
        region: 'center',
        fieldDefaults: {
            labelAlign: 'left',
            msgTarget: 'side',
            width : 200,
            style : 'margin-left:15px;'
        },
        layout : 'column',
        items:[
            {
                xtype : 'datefield',
                fieldLabel: '查询日期',
                labelWidth: 55,
                width: 200,
                name: 'starttime',
                format: 'Y-m-d',
                value:Ext.Date.add(new Date(), Ext.Date.DAY, -30),
                editable:false,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'datefield',
                //fieldLabel: '查询日期',
                //labelWidth: 55,
                width: 145,
                name: 'endtime',
                format: 'Y-m-d',
                editable:false,
                value:new Date(),
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'button',
                style:'margin-left:20px;',
                text:'查询',
                region: 'east',
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
            url: "http://" + window.location.host + "/arpu/stats",
            method: 'GET',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
				/*
                for(var i in json) {
                    if (!json[i].numOfDayFirstPaidUsers) {
                        json[i].numOfDayFirstPaidRatio = "";
                    }
                }
				*/
                drawTable( json );
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
                {name: 'serverId', type:'string'},
                {name: 'dateTime', type: 'string'},
                {name: 'numOfDayLogin', type: 'string'},
                {name: 'numOfDayRegister', type: 'string'},
                {name: 'numOfDayPaidUsers', type: 'string'},
                {name: 'numOfDayAmount', type: 'string'},
                {name: 'numOfDayArpu', type: 'string'},
                {name: 'numOfDayPaidRatio', type: 'string'},
                {name: 'numOfDayFirstPaidUsers', type: 'string'},
                {name: 'numOfDayFirstPaidAmount', type: 'string'},
                {name: 'numOfDayFirstPaidArpu', type: 'string'},
                {name: 'numOfDayFirstPaidRatio', type: 'string'}
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
                autoScroll : true,
                height: 700,
                columns: [
                    {text: '服务器', width: 70, dataIndex: 'serverId'},
                    {text: '日期', width: 100, dataIndex: 'dateTime'},
                    {text: '活跃人数', width: 70, dataIndex: 'numOfDayLogin'},
                    {text: '新增人数', width: 70, dataIndex: 'numOfDayRegister'},
                    {text: '充值人数', width: 70, dataIndex: 'numOfDayPaidUsers'},
                    {text: '充值金额', width: 80, dataIndex: 'numOfDayAmount'},
                    {text: '付费ARPU', width: 70, dataIndex: 'numOfDayArpu'},
                    {text: '付费率', width: 80, dataIndex: 'numOfDayPaidRatio'},
                    {text: '首充人数', width: 70, dataIndex: 'numOfDayFirstPaidUsers'},
                    {text: '首充金额', width: 80, dataIndex: 'numOfDayFirstPaidAmount'},
                    {text: '首充ARPU', width: 70, dataIndex: 'numOfDayFirstPaidArpu'},
                    {text: '首充付费率', width: 80, dataIndex: 'numOfDayFirstPaidRatio'}

                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};
