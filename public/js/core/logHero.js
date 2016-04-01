/**
 * Created by Administrator on 2016/3/17.
 * 英雄成长日志
 */
var FormTV = 0;
function logHeroData(fromTV){
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
                text:'训练日志',
                handler : function(){
                    submit();
                }
            },
            {
                xtype : 'button',
                style:'margin-left:20px;',
                text:'升星日志',
                handler : function(){
                    submit2();
                }
            }
        ]
    });

    logForm.render('condition');
    function submit(){
        //if (!logForm.getForm().isValid()) return;
        var args = logForm.getForm().getValues();

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/logHero/Train",
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
    function submit2(){
        //if (!logForm.getForm().isValid()) return;
        var args = logForm.getForm().getValues();

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/logHero/Star",
            method: 'GET',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                drawTable2( json );
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
                {name: 'HeroProfession', type: 'string'},
                {name: 'HeroTrainlevel', type: 'string'},
                {name: 'HeroTrainlevelA', type: 'string'},
                {name: 'TrainBook', type: 'string'},
                {name: 'TrianGold', type: 'string'},
                {name: 'TrianTime', type: 'string'},
                {name: 'TrianDate', type: 'string'}
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
                    {text: '职业', width: 80, dataIndex: 'HeroProfession'},
                    {text: '训练前等级', width: 80, dataIndex: 'HeroTrainlevel'},
                    {text: '训练后等级', width: 80, dataIndex: 'HeroTrainlevelA'},
                    {text: '花费训练书个数', width: 80, dataIndex: 'TrainBook'},
                    {text: '花费金币', width: 80, dataIndex: 'TrianGold'},
                    {text: '时间 ', width: 80, dataIndex: 'TrianTime'},
                    {text: '日期 ', width: 80, dataIndex: 'TrianDate'}

                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }

    function drawTable2( dataFromServer ){
        Ext.getDom('dataRegion').innerHTML = '';
        Ext.define('LogDataStruct', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'List', type: 'string'},
                {name: 'HeroProfession', type: 'string'},
                {name: 'HeroStar', type: 'string'},
                {name: 'HeroStarA', type: 'string'},
                {name: 'HeroGold', type: 'string'},
                {name: 'HeroHonor', type: 'string'},
                {name: 'HeroTime', type: 'string'},
                {name: 'HeroDate', type: 'string'}
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
                    {text: '职业', width: 80, dataIndex: 'HeroProfession'},
                    {text: '升星前', width: 80, dataIndex: 'HeroStar'},
                    {text: '升星后', width: 80, dataIndex: 'HeroStarA'},
                    {text: '花费金币', width: 80, dataIndex: 'HeroGold'},
                    {text: '花费荣誉', width: 80, dataIndex: 'HeroHonor'},
                    {text: '时间 ', width: 80, dataIndex: 'HeroTime'},
                    {text: '日期 ', width: 80, dataIndex: 'HeroDate'}

                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};