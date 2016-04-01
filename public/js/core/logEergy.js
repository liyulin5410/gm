/**
 * Created by Administrator on 2016/3/17.
 * 能量卡购买个人日志
 */
var FormTV = 0;
function logEergyData(fromTV){
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
            url: "http://" + window.location.host + "/logEergy/board",
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
                {name: 'EergyName', type: 'string'},
                {name: 'EergyHave', type: 'string'},
                {name: 'EergyTime', type: 'string'},
                {name: 'EergyGold', type: 'string'},
                {name: 'EergyDimond', type: 'string'},
                {name: 'EergyGrade', type: 'string'}
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
                    {text: '能量卡名称', width: 100, dataIndex: 'EergyName'},
                    {text: '是否拥有', width: 80, dataIndex: 'EergyHave'},
                    {text: '购买时间', width: 80, dataIndex: 'EergyTime'},
                    {text: '花费金币', width: 80, dataIndex: 'EergyGold'},
                    {text: '花费钻石', width: 80, dataIndex: 'EergyDimond'},
                    {text: '用户购买时的等级', width: 140, dataIndex: 'EergyGrade'}

                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};