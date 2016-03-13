var FormTV = 0;
function boardData(fromTV){
    FormTV = (fromTV > 0) ? 1 : 0;
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
                name: 'endtime',
                value:new Date(),
                format: 'Y-m-d',
                editable:false,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'button',
                style:'margin-left:20px;',
                text:'查询',
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
            url: "http://" + window.location.host + "/account/board",
            method: 'GET',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
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
                {name: 'startServerTime', type: 'string'},
                {name: 'numOfOnlineUsers', type: 'string'},
                {name: 'numOfTotalLogin', type: 'string'},
                {name: 'numOfMonthLogin', type: 'string'},
                {name: 'numOfDayLogin', type: 'string'},
                {name: 'numOfTotalRegister', type: 'string'},
                {name: 'numOfMonthRegister', type: 'string'},
                {name: 'numOfDayRegister', type: 'string'},
                {name: 'numOfTotalAmount', type: 'string'},
                {name: 'numOfMonthAmount', type: 'string'},
                {name: 'numOfDayAmount', type: 'string'},
                {name: 'numOfTotalPaidUsers', type: 'string'},
                {name: 'numOfMonthPaidUsers', type: 'string'},
                {name: 'numOfDayPaidUsers', type: 'string'}
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
                    {text: '服务器', width: 80, dataIndex: 'serverId'},
                    {text: '开服时间', width: 100, dataIndex: 'startServerTime'},
                    {text: '在线人数', width: 60,  dataIndex: 'numOfOnlineUsers'},
                    {text: '日活跃人数', width: 70, dataIndex: 'numOfDayLogin'},
                    {text: '日新增人数', width: 70, dataIndex: 'numOfDayRegister'},
                    {text: '日充值人数', width: 80, dataIndex: 'numOfDayPaidUsers'},
                    {text: '日充值', width: 80, dataIndex: 'numOfDayAmount'},
                    {text: '月活跃人数', width: 70, dataIndex: 'numOfMonthLogin'},
                    {text: '月新增人数', width: 70, dataIndex: 'numOfMonthRegister'},
                    {text: '月充值人数', width: 80, dataIndex: 'numOfMonthPaidUsers'},
                    {text: '月充值', width: 80, dataIndex: 'numOfMonthAmount'},
                    {text: '总新增人数', width: 70, dataIndex: 'numOfTotalRegister'},
                    {text: '总充值人数', width: 70, dataIndex: 'numOfTotalPaidUsers'},
                    {text: '总充值', width: 80, dataIndex: 'numOfTotalAmount'}

                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};
