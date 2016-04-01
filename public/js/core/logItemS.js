/**
 * Created by Administrator on 2016/3/17.
 * 道具消耗全服日志
 */
var FormTV = 0;
function logItemSData(fromTV){
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
            url: "http://" + window.location.host + "/logItemS/board",
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
                {name: 'ItemSList', type: 'string'},
                {name: 'ItemSID', type: 'string'},
                {name: 'ItemSName', type: 'string'},
                {name: 'ItemSNum', type: 'string'},
                {name: 'ItemSDate', type: 'string'}
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
                    {text: '序列', width: 80, dataIndex: 'ItemSList'},
                    {text: '道具id ', width: 80, dataIndex: 'ItemSID'},
                    {text: '道具名称', width: 80, dataIndex: 'ItemSName'},
                    {text: '使用总个数', width: 80, dataIndex: 'ItemSNum'},
                    {text: '日期', width: 80, dataIndex: 'ItemSDate'}

                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};