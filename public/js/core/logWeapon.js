/**
 * Created by Administrator on 2016/3/17.
 * 武器成长日志
 */
var FormTV = 0;
function logWeaponData(fromTV){
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
                text:'强化日志',
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
            },
            {
                xtype : 'button',
                style:'margin-left:20px;',
                text:'进阶日志',
                handler : function(){
                    submit3();
                }
            }
        ]
    });

    logForm.render('condition');
    function submit(){
        //if (!logForm.getForm().isValid()) return;
        var args = logForm.getForm().getValues();

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/logWeapon/Intensify",
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
            url: "http://" + window.location.host + "/logWeapon/Star",
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
    function submit3(){
        //if (!logForm.getForm().isValid()) return;
        var args = logForm.getForm().getValues();

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/logWeapon/Advance",
            method: 'GET',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                drawTable3( json );
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
                {name: 'WeaponProfession', type: 'string'},
                {name: 'WeaponName', type: 'string'},
                {name: 'WeaponIntensify', type: 'string'},
                {name: 'WeaponIntensifyA', type: 'string'},
                {name: 'Iron1', type: 'string'},
                {name: 'Iron2', type: 'string'},
                {name: 'Iron3', type: 'string'},
                {name: 'Iron4', type: 'string'},
                {name: 'Iron5', type: 'string'},
                {name: 'Iron6', type: 'string'},
                {name: 'IntensifyGold', type: 'string'},
                {name: 'IntensifyTime', type: 'string'},
                {name: 'IntensifyDate', type: 'string'}
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
                    {text: '职业', width: 80, dataIndex: 'WeaponProfession'},
                    {text: '武器名称 ', width: 80, dataIndex: 'WeaponName'},
                    {text: '强化前等级', width: 80, dataIndex: 'WeaponIntensify'},
                    {text: '强化后等级', width: 80, dataIndex: 'WeaponIntensifyA'},
                    {text: '铁锭1个数', width: 80, dataIndex: 'Iron1'},
                    {text: '铁锭2个数 ', width: 80, dataIndex: 'Iron2'},
                    {text: '铁锭3个数 ', width: 80, dataIndex: 'Iron3'},
                    {text: '铁锭4个数 ', width: 80, dataIndex: 'Iron4'},
                    {text: '铁锭5个数 ', width: 80, dataIndex: 'Iron5'},
                    {text: '铁锭6个数 ', width: 80, dataIndex: 'Iron6'},
                    {text: '花费金币 ', width: 80, dataIndex: 'IntensifyGold'},
                    {text: '时间 ', width: 80, dataIndex: 'IntensifyTime'},
                    {text: '日期 ', width: 80, dataIndex: 'IntensifyDate'}

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
                {name: 'WeaponStarProfession', type: 'string'},
                {name: 'WeaponName', type: 'string'},
                {name: 'WeaponStar', type: 'string'},
                {name: 'WeaponStarGold', type: 'string'},
                {name: 'WeaponStarHonor', type: 'string'},
                {name: 'WeaponStarTime', type: 'string'},
                {name: 'WeaponStarDate', type: 'string'}
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
                    {text: '职业', width: 80, dataIndex: 'WeaponStarProfession'},
                    {text: '武器名称 ', width: 80, dataIndex: 'WeaponName'},
                    {text: '升星后等级', width: 80, dataIndex: 'WeaponStar'},
                    {text: '花费金币', width: 80, dataIndex: 'WeaponStarGold'},
                    {text: '花费荣誉', width: 80, dataIndex: 'WeaponStarHonor'},
                    {text: '时间 ', width: 80, dataIndex: 'WeaponStarTime'},
                    {text: '日期 ', width: 80, dataIndex: 'WeaponStarDate'}

                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
    function drawTable3( dataFromServer ){
        Ext.getDom('dataRegion').innerHTML = '';
        Ext.define('LogDataStruct', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'List', type: 'string'},
                {name: 'WeaponOccupation', type: 'string'},
                {name: 'WeaponAdvanceName', type: 'string'},
                {name: 'WeaponAdvanceNameA', type: 'string'},
                {name: 'WeaponBook', type: 'string'},
                {name: 'WeaponGold', type: 'string'},
                {name: 'WeaponHonor', type: 'string'}
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
                    {text: '职业', width: 80, dataIndex: 'WeaponOccupation'},
                    {text: '进阶前武器名称', width: 120, dataIndex: 'WeaponAdvanceName'},
                    {text: '进阶后武器名称', width: 120, dataIndex: 'WeaponAdvanceNameA'},
                    {text: '花费武器图册个数', width: 150, dataIndex: 'WeaponBook'},
                    {text: '花费金币 ', width: 80, dataIndex: 'WeaponGold'},
                    {text: '花费荣誉 ', width: 80, dataIndex: 'WeaponHonor'}

                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};