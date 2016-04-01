/**
 * Created by Administrator on 2016/3/16.
 * 周赛场个人日志
 */
var FormTV = 0;
function logPVPData(fromTV){
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
            url: "http://" + window.location.host + "/logPVP/board",
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
                {name: 'PVPRanking', type: 'string'},
                {name: 'PVPREsult', type: 'string'},
                {name: 'PVPPlayTime', type: 'string'},
                {name: 'PVPTime', type: 'string'},
                {name: 'PVPDate', type: 'string'}
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
                    {text: '当前段位', width: 80, dataIndex: 'PVPRanking'},
                    {text: '胜负结果', width: 70, dataIndex: 'PVPREsult'},
                    {text: '战斗时长', width: 70, dataIndex: 'PVPPlayTime'},
                    {text: '战斗时间', width: 70, dataIndex: 'PVPTime'},
                    {text: '日期', width: 70, dataIndex: 'PVPDate'}
                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};