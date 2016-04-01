/**
 * Created by Administrator on 2016/3/17.
 * 用户钻石获得个人日志
 */
var FormTV = 0;
function logDimondAData(fromTV){
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
                xtype : 'textfield',
                style : 'margin-left:10px;margin-top:0px;',
                fieldLabel: '玩家ID',
                id: 'playerId',
                labelWidth: 50,
                width: 200
            },
            {
                xtype: 'datefield',
                fieldLabel: '查询日期',
                labelWidth: 55,
                width: 200,
                name: 'startTime',
                format: 'Y-m-d',
                value: Ext.Date.add(new Date(), Ext.Date.DAY, -7),
                editable: false,
                allowBlank: false,
                blankText: '此项不能为空'
            },
            {
                xtype: 'datefield',
                width: 145,
                name: 'endTime',
                format: 'Y-m-d',
                editable: false,
                value: new Date(),
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
        var args = logForm.getForm().getValues();
        args.playerId = Ext.getCmp('playerId').getValue();
        Ext.Ajax.request({
            url: "http://" + window.location.host + "/logDimondA/board",
            method: 'GET',
            params:args,
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
                {name: 'DimondAList', type: 'string'},
                {name: 'Player_id', type: 'string'},
                {name: 'DimondASource', type: 'string'},
                {name: 'DimondANum', type: 'string'},
                {name: 'DimondATime', type: 'string'},

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
                    {text: '序列', width: 80, dataIndex: 'DimondAList'},
                    {text: '玩家ID', width: 80, dataIndex: 'Player_id'},
                    {text: '钻石来源', width: 140, dataIndex: 'DimondASource'},
                    {text: '获得钻石数量', width: 80, dataIndex: 'DimondANum'},
                    {text: '时间', width: 140, dataIndex: 'DimondATime'}
                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};