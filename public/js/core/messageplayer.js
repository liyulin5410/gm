/**
 * Created by Administrator on 2016/3/15.
 * 查询玩家信息
 */
var FormTV = 0;
function messageplayerData(fromTV){
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
            url: "http://" + window.location.host + "/messageplayer/board",
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
                {name: 'PlayerGrade', type: 'string'},
                {name: 'Fighting', type: 'string'},
                {name: 'Experience', type: 'string'},
                {name: 'PVPranking', type: 'string'},
                {name: 'PVAranking', type: 'string'},
                {name: 'Star', type: 'string'},
                {name: 'Power', type: 'string'},
                {name: 'SkillNumber', type: 'string'},
                {name: 'Skill', type: 'string'},
                {name: 'Gold', type: 'string'},
                {name: 'Dimond', type: 'string'},
                {name: 'Honor', type: 'string'}
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
                    {text: '战队等级', width: 80, dataIndex: 'PlayerGrade'},
                    {text: '战力', width: 80, dataIndex: 'Fighting'},
                    {text: '经验', width: 70, dataIndex: 'Experience'},
                    {text: '周赛场段位', width: 70, dataIndex: 'PVPranking'},
                    {text: '竞技塔排名', width: 70, dataIndex: 'PVAranking'},
                    {text: '总星数', width: 70, dataIndex: 'Star'},
                    {text: '当前体力', width: 70, dataIndex: 'Power'},
                    {text: '开启能量技个数', width: 70, dataIndex: 'SkillNumber'},
                    {text: '当前出战能量技', width: 70, dataIndex: 'Skill'},
                    {text: '当前金币', width: 70, dataIndex: 'Gold'},
                    {text: '当前钻石', width: 70, dataIndex: 'Dimond'},
                    {text: '当前荣誉', width: 80, dataIndex: 'Honor'}

                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};