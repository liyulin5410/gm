/**
 * Created by Administrator on 2016/3/14.
 */
//var ServerConfig = require("../../../config/server.js");
var FormTV = 0;
//var serverList = [];
//var config = ServerConfig.server;
//config.forEach(function (server) {
//    var value = '';
//    value += server.serverId;
//    serverList.push([server.serverId, value]);
//});
var timeOptions = new Ext.data.SimpleStore({
    fields: ['id', 'timeOption'],
    data: [['1','1'],['2', '2'],['3','3'],['4', '4']]
});
function messagepandectData(fromTV){
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
                xtype: 'combo',
                fieldLabel: '服务器选择',
                displayField: 'timeOption',
                valueField: 'value',
                store: timeOptions,
                style: 'margin-left:10px;',
                labelWidth: 80,
                width: 200,
                name: 'service',
                readOnly: false,
                editable: false,
                allowBlank: false,
                blankText: '此项不能为空'
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
            url: "http://" + window.location.host + "/messagepandect/board",
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
                {name: 'Name', type: 'string'},
                {name: 'StartTime', type: 'string'},
                {name: 'EndTime', type: 'string'},
                {name: 'Area', type: 'string'}
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
                    {text: '昵称', width: 80, dataIndex: 'Name'},
                    {text: '登入时间', width: 70, dataIndex: 'StartTime'},
                    {text: '登出时间', width: 70, dataIndex: 'EndTime'},
                    {text: '地区', width: 80, dataIndex: 'Area'}

                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};