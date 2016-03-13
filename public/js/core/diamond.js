
function diamond(){

    var logForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 'auto',
        height: 50,
        region: 'center',
        layout : 'column',
        items:[
            {
                xtype : 'datefield',
                style : 'margin-left:20px;margin-top:10px;',
                fieldLabel: '查询日期',
                labelWidth: 55,
                width: 200,
                name: 'starttime',
                format: 'Y-m-d',
                value:Ext.Date.add(new Date(), Ext.Date.DAY, -30),
                editable:false,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'datefield',
                style : 'margin-left:15px;margin-top:10px;',
                width: 145,
                name: 'endtime',
                format: 'Y-m-d',
                value:new Date(),
                editable:false,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'button',
                style:'margin-left:20px;margin-top:10px;',
                text:'查 询',
                handler : function(){
                    submit();
                }
            }
        ]
    });

    logForm.render('condition');
    function submit(){
        var args = logForm.getForm().getValues();
        console.log(args);

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/diamond/logs",
            method: 'GET',
            params: {starttime: args.starttime, endtime: args.endtime},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                console.log(json);
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
                {name: 'dt', type:'string'},
                {name: 'numOfDayRecharge', type: 'string'},
                {name: 'numOfDayPresent', type: 'string'},
                {name: 'numOfDayConsume', type: 'string'},
                {name: 'numOfDaySurplus', type: 'string'},
                {name: 'numOfRechargeDiamond1', type: 'string'},
                {name: 'numOfRechargeDiamond5', type: 'string'},
                {name: 'numOfRechargeDiamond10', type: 'string'},
                {name: 'numOfRechargeDiamond50', type: 'string'},
                {name: 'numOfRechargeDiamond100', type: 'string'},
                {name: 'numOfRechargeDiamond500', type: 'string'},
                {name: 'numOfRechargeDiamond1000', type: 'string'},
                {name: 'numOfConsumeDiamond1', type: 'string'},
                {name: 'numOfConsumeDiamond5', type: 'string'},
                {name: 'numOfConsumeDiamond10', type: 'string'},
                {name: 'numOfConsumeDiamond50', type: 'string'},
                {name: 'numOfConsumeDiamond100', type: 'string'},
                {name: 'numOfConsumeDiamond500', type: 'string'},
                {name: 'numOfMobile4', type: 'string'},
                {name: 'numOfMobile6', type: 'string'},
                {name: 'numOfMobile8', type: 'string'},
                {name: 'numOfMobile12', type: 'string'},
                {name: 'numOfMobile40', type: 'string'},
                {name: 'numOfMobile60', type: 'string'},
                {name: 'numOfMobile80', type: 'string'},
                {name: 'numOfMobile100', type: 'string'},
                {name: 'numOfTelecom4', type: 'string'},
                {name: 'numOfTelecom6', type: 'string'},
                {name: 'numOfTelecom8', type: 'string'},
                {name: 'numOfTelecom12', type: 'string'},
                {name: 'numOfTelecom40', type: 'string'},
                {name: 'numOfTelecom60', type: 'string'},
                {name: 'numOfTelecom80', type: 'string'},
                {name: 'numOfTelecom100', type: 'string'},
                {name: 'numOfMobile5', type: 'string'},
                {name: 'numOfMobile10', type: 'string'},
                {name: 'numOfMobile50', type: 'string'},
                {name: 'numOfTelecom5', type: 'string'},
                {name: 'numOfTelecom10', type: 'string'},
                {name: 'numOfTelecom50', type: 'string'},
                {name: 'numOfActivityAward', type: 'string'}
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
                frame: true,
                tripeRows:true,
                autoScroll : true,
                height: 700,
                columns: [
                    {text: '日期', width: 100, dataIndex: 'dt'},
                    {text: '充值', width: 100,  dataIndex: 'numOfDayRecharge'},
                    {text: '赠送', width: 100,  dataIndex: 'numOfDayPresent'},
                    {text: '消耗', width: 100,  dataIndex: 'numOfDayConsume'},
                    {text: '总剩余', width: 100,  dataIndex: 'numOfDaySurplus'},
                    {text: '充值1钻', width: 100,  dataIndex: 'numOfRechargeDiamond1'},
                    {text: '充值5钻', width: 100,  dataIndex: 'numOfRechargeDiamond5'},
                    {text: '充值10钻', width: 100,  dataIndex: 'numOfRechargeDiamond10'},
                    {text: '充值50钻', width: 100,  dataIndex: 'numOfRechargeDiamond50'},
                    {text: '充值100钻', width: 100,  dataIndex: 'numOfRechargeDiamond100'},
                    {text: '充值500钻', width: 100,  dataIndex: 'numOfRechargeDiamond500'},
                    {text: '充值1000钻', width: 100,  dataIndex: 'numOfRechargeDiamond1000'},
                    {text: '消耗1钻', width: 100,  dataIndex: 'numOfConsumeDiamond1'},
                    {text: '消耗5钻', width: 100,  dataIndex: 'numOfConsumeDiamond5'},
                    {text: '消耗10钻', width: 100,  dataIndex: 'numOfConsumeDiamond10'},
                    {text: '消耗50钻', width: 100,  dataIndex: 'numOfConsumeDiamond50'},
                    {text: '消耗100钻', width: 100,  dataIndex: 'numOfConsumeDiamond100'},
                    {text: '消耗500钻', width: 100,  dataIndex: 'numOfConsumeDiamond500'},
                    //{text: '移动2钻(4元)', width: 100,  dataIndex: 'numOfMobile4'},
                    //{text: '移动4钻', width: 100,  dataIndex: 'numOfMobile8'},
                    //{text: '移动20钻', width: 100,  dataIndex: 'numOfMobile40'},
                    //{text: '移动40钻', width: 100,  dataIndex: 'numOfMobile80'},
                    //{text: '电信2钻(4元)', width: 100,  dataIndex: 'numOfTelecom4'},
                    //{text: '电信4钻', width: 100,  dataIndex: 'numOfTelecom8'},
                    //{text: '电信20钻', width: 100,  dataIndex: 'numOfTelecom40'},
                    //{text: '电信40钻', width: 100,  dataIndex: 'numOfTelecom80'},
                    //{text: '移动3钻(6元)', width: 100,  dataIndex: 'numOfMobile6'},
                    //{text: '移动6钻', width: 100,  dataIndex: 'numOfMobile12'},
                    //{text: '移动30钻', width: 100,  dataIndex: 'numOfMobile60'},
                    //{text: '移动45钻', width: 100,  dataIndex: 'numOfMobile90'},
                    //{text: '电信3钻(6元)', width: 100,  dataIndex: 'numOfTelecom6'},
                    //{text: '电信6钻', width: 100,  dataIndex: 'numOfTelecom12'},
                    //{text: '电信30钻', width: 100,  dataIndex: 'numOfTelecom60'},
                    //{text: '电信45钻', width: 100,  dataIndex: 'numOfTelecom90'},
                    //{text: '移动2钻(5元)', width: 100,  dataIndex: 'numOfMobile5'},
                    //{text: '移动5钻', width: 100,  dataIndex: 'numOfMobile10'},
                    //{text: '移动25钻', width: 100,  dataIndex: 'numOfMobile50'},
                    //{text: '移动50钻', width: 100,  dataIndex: 'numOfMobile100'},
                    //{text: '电信2钻(5元)', width: 100,  dataIndex: 'numOfTelecom5'},
                    //{text: '电信5钻', width: 100,  dataIndex: 'numOfTelecom10'},
                    //{text: '电信25钻', width: 100,  dataIndex: 'numOfTelecom50'},
                    //{text: '电信50钻', width: 100,  dataIndex: 'numOfTelecom100'},
                    {text: '限时活动奖励', width: 100,  dataIndex: 'numOfActivityAward'}
                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};
