/**
 * Created by Administrator on 2016/3/16.
 * 竞技塔爬塔日志
 */
var FormTV = 0;
function logPVASData(fromTV){
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
            url: "http://" + window.location.host + "/logPVAS/board",
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
                {name: 'PVASNumber', type: 'string'},
                {name: 'PVASPlayerNumber', type: 'string'},
                {name: 'PVASSum', type: 'string'},
                {name: 'PVASAverageNumber', type: 'string'},
                {name: 'PVASAverageTime', type: 'string'},
                {name: 'PVASDate', type: 'string'}
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
                    {text: '进入人数', width: 80, dataIndex: 'PVASNumber'},
                    {text: '爬塔人数', width: 80, dataIndex: 'PVASPlayerNumber'},
                    {text: '总共战斗次数', width: 70, dataIndex: 'PVASSum'},
                    {text: '平均战斗次数', width: 70, dataIndex: 'PVASAverageNumber'},
                    {text: '平均战斗时长', width: 70, dataIndex: 'PVASAverageTime'},
                    {text: '日期', width: 70, dataIndex: 'PVASDate'}

                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};