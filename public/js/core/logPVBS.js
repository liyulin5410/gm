/**
 * Created by Administrator on 2016/3/16.
 * 无尽boss全服日志
 */
var FormTV = 0;
function logPVBSData(fromTV){
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
            url: "http://" + window.location.host + "/logPVBS/board",
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
                {name: 'PVBSID', type: 'string'},
                {name: 'PVBSSum', type: 'string'},
                {name: 'PVBSNumber', type: 'string'},
                {name: 'PVBSPlayTime', type: 'string'},
                {name: 'PVBSItem1', type: 'string'},
                {name: 'PVBSItem2', type: 'string'},
                {name: 'PVBSItem3', type: 'string'}
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
                    {text: 'boss关卡', width: 80, dataIndex: 'PVBSID'},
                    {text: '胜负记录', width: 80, dataIndex: 'PVBSSum'},
                    {text: '战斗时长', width: 70, dataIndex: 'PVBSNumber'},
                    {text: '战斗时长', width: 70, dataIndex: 'PVBSPlayTime'},
                    {text: '道具1', width: 70, dataIndex: 'PVBSItem1'},
                    {text: '道具2', width: 70, dataIndex: 'PVBSItem2'},
                    {text: '道具3', width: 70, dataIndex: 'PVBSItem3'}

                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};