/**
 * Created by Administrator on 2016/3/15.
 * 全服查询玩家信息总览
 */
var FormTV = 0;
function logplayerData(fromTV){
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
            url: "http://" + window.location.host + "/logplayer/board",
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
                {name: 'PlayerID', type: 'string'},
                {name: 'CreationTime', type: 'string'},
                {name: 'StartTime', type: 'string'},
                {name: 'EndTime', type: 'string'},
                {name: 'PlayTime', type: 'string'}
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
                    {text: '玩家ID', width: 80, dataIndex: 'PlayerID'},
                    {text: '创建时间', width: 80, dataIndex: 'CreationTime'},
                    {text: '登陆时间', width: 70, dataIndex: 'StartTime'},
                    {text: '登出时间', width: 70, dataIndex: 'EndTime'},
                    {text: '在线时长', width: 80, dataIndex: 'PlayTime'}

                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};
