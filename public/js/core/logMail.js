/**
 * Created by Administrator on 2016/3/16.
 * 收取个人邮件
 */
var FormTV = 0;
function logMailData(fromTV){
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
            url: "http://" + window.location.host + "/logMail/board",
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
                {name: 'MailSID', type: 'string'},
                {name: 'MailItemName', type: 'string'},
                {name: 'MailItemNumber', type: 'string'},
                {name: 'MailTake', type: 'string'},
                {name: 'MailTime', type: 'string'}
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
                    {text: '邮件id', width: 80, dataIndex: 'MailSID'},
                    {text: '附送道具名称', width: 80, dataIndex: 'MailItemName'},
                    {text: '附送道具个数', width: 80, dataIndex: 'MailItemNumber'},
                    {text: '用户是否收取', width: 80, dataIndex: 'MailTake'},
                    {text: '收取时间', width: 80, dataIndex: 'MailTime'}

                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};