/**
 * Created by Administrator on 2016/3/16.
 * 竞技塔个人爬塔日志
 */
var FormTV = 0;
function logPVAData(fromTV){
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
            url: "http://" + window.location.host + "/logPVA/board",
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
                {name: 'List', type: 'string'},
                {name: 'PVARanking', type: 'string'},
                {name: 'PVAResult', type: 'string'},
                {name: 'PVAPlayTime', type: 'string'},
                {name: 'PVATime', type: 'string'},
                {name: 'PVADate', type: 'string'},
                {name: 'PlayerGrade', type: 'string'}
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
                    {text: '序列', width: 80, dataIndex: 'List'},
                    {text: '挑战的名次', width: 80, dataIndex: 'PVARanking'},
                    {text: '胜负结果', width: 70, dataIndex: 'PVAResult'},
                    {text: '战斗时长', width: 70, dataIndex: 'PVAPlayTime'},
                    {text: '战斗的时间', width: 70, dataIndex: 'PVATime'},
                    {text: '战斗的日期', width: 70, dataIndex: 'PVADate'},
                    {text: '玩家等级', width: 70, dataIndex: 'PlayerGrade'}

                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};