/**
 * Created by Administrator on 2016/3/16.
 * 周赛场日志
 */
var FormTV = 0;
function logPVPSData(fromTV){
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
            url: "http://" + window.location.host + "/logPVPS/board",
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
                {name: 'PVPSNumber', type: 'string'},
                {name: 'PVPSPlayerNumber', type: 'string'},
                {name: 'PVPSSum', type: 'string'},
                {name: 'PVPSAverageNumber', type: 'string'},
                {name: 'PVPSAverageTime', type: 'string'},
                {name: 'PVPSDate', type: 'string'}
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
                    {text: '进入人数 ', width: 80, dataIndex: 'PVPSNumber'},
                    {text: '战斗激活人数', width: 80, dataIndex: 'PVPSPlayerNumber'},
                    {text: '总战斗次数', width: 70, dataIndex: 'PVPSSum'},
                    {text: '平均战斗次数', width: 70, dataIndex: 'PVPSAverageNumber'},
                    {text: '平均在线时长', width: 70, dataIndex: 'PVPSAverageTime'},
                    {text: '日期', width: 70, dataIndex: 'PVPSDate'}
                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};
