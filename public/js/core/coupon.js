function coupon(){
    var logForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 'auto',
        height: 50,
        layout : 'column',
        items:[
            {
                xtype : 'datefield',
                style : 'margin-left:30px;margin-top:10px;',
                fieldLabel: '查询日期',
                labelWidth: 55,
                width: 200,
                name: 'startTime',
                format: 'Y-m-d',
                value:Ext.Date.add(new Date(), Ext.Date.DAY, -30),
                editable:false,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'datefield',
                style : 'margin-left:30px;margin-top:10px;',
                width: 145,
                name: 'endTime',
                format: 'Y-m-d',
                value: new Date(),
                editable:false,
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'button',
                style : 'margin-left:30px;margin-top:10px;',
                text:'查 询',
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
            url: "http://" + window.location.host + "/coupon/get",
            method: 'GET',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.getDom('dataRegion').innerHTML = '';
                    Ext.Msg.alert("错误", "没有找到相关记录");
                } else {
                    drawTable(json);
                }
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
                {name: 'numOfTotalPay', type: 'string'},
                {name: 'numOfTotalIncome', type: 'string'},
                {name: 'numOfDaySurplus', type: 'string'},
                {name: 'numOfLowerLevelGame', type: 'string'},
                {name: 'numOfLowerLevelPay', type: 'string'},
                {name: 'numOfMiddleLevelGame', type: 'string'},
                {name: 'numOfMiddleLevelPay', type: 'string'},
                {name: 'numOfHigherLevelGame', type: 'string'},
                {name: 'numOfHigherLevelPay', type: 'string'},
                {name: 'numOfSuperLevelGame', type: 'string'},
                {name: 'numOfSuperLevelPay', type: 'string'},
                {name: 'numOfArena1Game', type: 'string'},
                {name: 'numOfArena1Pay', type: 'string'},
                {name: 'numOfArena2Game', type: 'string'},
                {name: 'numOfArena2Pay', type: 'string'},
                {name: 'numOfArena3Game', type: 'string'},
                {name: 'numOfArena3Pay', type: 'string'}/*,
                {name: 'numOfGamingMoney', type: 'string'},
                {name: 'numOfGamingMoneyIncome', type: 'string'},
                {name: 'numOfMobile10', type: 'string'},
                {name: 'numOfMobile10Income', type: 'string'},
                {name: 'numOfUnicom10', type: 'string'},
                {name: 'numOfUnicom10Income', type: 'string'},
                {name: 'numOfTelecom10', type: 'string'},
                {name: 'numOfTelecom10Income', type: 'string'},
                {name: 'numOfMobile50', type: 'string'},
                {name: 'numOfMobile50Income', type: 'string'},
                {name: 'numOfUnicom50', type: 'string'},
                {name: 'numOfUnicom50Income', type: 'string'},
                {name: 'numOfTelecom50', type: 'string'},
                {name: 'numOfTelecom50Income', type: 'string'},
                {name: 'numOfGamingMoney50', type: 'string'},
                {name: 'numOfGamingMoney50Income', type: 'string'}*/
            ]
        });

        var store = Ext.create('Ext.data.JsonStore', {
            model: LogDataStruct,
            data: dataFromServer
        });

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
                {text: '产出', width: 100,  dataIndex: 'numOfTotalPay'},
                {text: '消耗', width: 100,  dataIndex: 'numOfTotalIncome'},
                {text: '总剩余', width: 100,  dataIndex: 'numOfDaySurplus'},
                {text: '初级局数', width: 100,  dataIndex: 'numOfLowerLevelGame'},
                {text: '初级产出', width: 100,  dataIndex: 'numOfLowerLevelPay'},
                {text: '中级局数', width: 100,  dataIndex: 'numOfMiddleLevelGame'},
                {text: '中级产出', width: 100,  dataIndex: 'numOfMiddleLevelPay'},
                {text: '高级局数', width: 100,  dataIndex: 'numOfHigherLevelGame'},
                {text: '高级产出', width: 100,  dataIndex: 'numOfHigherLevelPay'},
                {text: '至尊局数', width: 100,  dataIndex: 'numOfSuperLevelGame'},
                {text: '至尊产出', width: 100,  dataIndex: 'numOfSuperLevelPay'},
                {text: '普通赛局数', width: 100,  dataIndex: 'numOfArena1Game'},
                {text: '普通赛产出', width: 100,  dataIndex: 'numOfArena1Pay'},
                {text: '精英赛局数', width: 100,  dataIndex: 'numOfArena2Game'},
                {text: '精英赛产出', width: 100,  dataIndex: 'numOfArena2Pay'},
                {text: '富豪赛局数', width: 100,  dataIndex: 'numOfArena3Game'},
                {text: '富豪赛产出', width: 100,  dataIndex: 'numOfArena3Pay'}/*,
                {text: '10万金币次数', width: 100,  dataIndex: 'numOfGamingMoney'},
                {text: '消耗', width: 100,  dataIndex: 'numOfGamingMoneyIncome'},
                {text: '50万金币次数', width: 100,  dataIndex: 'numOfGamingMoney50'},
                {text: '消耗', width: 100,  dataIndex: 'numOfGamingMoney50Income'},
                {text: '10元移动次数', width: 100,  dataIndex: 'numOfMobile10'},
                {text: '消耗', width: 100,  dataIndex: 'numOfMobile10Income'},
                {text: '20元联通次数', width: 100,  dataIndex: 'numOfUnicom10'},
                {text: '消耗', width: 100,  dataIndex: 'numOfUnicom10Income'},
                {text: '10元电信次数', width: 100,  dataIndex: 'numOfTelecom10'},
                {text: '消耗', width: 100,  dataIndex: 'numOfTelecom10Income'},
                {text: '50元移动次数', width: 100,  dataIndex: 'numOfMobile50'},
                {text: '消耗', width: 100,  dataIndex: 'numOfMobile50Income'},
                {text: '50元联通次数', width: 100,  dataIndex: 'numOfUnicom50'},
                {text: '消耗', width: 100,  dataIndex: 'numOfUnicom50Income'},
                {text: '50元电信次数', width: 100,  dataIndex: 'numOfTelecom50'},
                {text: '消耗', width: 100,  dataIndex: 'numOfTelecom50Income'} */
            ],
            width: 'auto'
        });

        logList.render('dataRegion');
    }
};
