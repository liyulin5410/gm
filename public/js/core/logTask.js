/**
 * Created by Administrator on 2016/3/17.
 * 任务交付日志
 */
var FormTV = 0;
function logTaskData(fromTV){
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
            url: "http://" + window.location.host + "/logTask/board",
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
                {name: 'TaskID', type: 'string'},
                {name: 'TaskType', type: 'string'},
                {name: 'TaskName', type: 'string'},
                {name: 'TaskExplain', type: 'string'},
                {name: 'TaskCompletionTime', type: 'string'},
                {name: 'TaskGetTime', type: 'string'}
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
                    {text: '任务ID ', width: 80, dataIndex: 'TaskID'},
                    {text: '任务类型', width: 80, dataIndex: 'TaskType'},
                    {text: '任务名称', width: 80, dataIndex: 'TaskName'},
                    {text: '任务说明', width: 80, dataIndex: 'TaskExplain'},
                    {text: '完成时间', width: 80, dataIndex: 'TaskCompletionTime'},
                    {text: '领取时间', width: 70, dataIndex: 'TaskGetTime'}
                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};