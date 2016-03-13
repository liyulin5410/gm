function gamingMoney(){
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
                xtype : 'datefield',
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
                //labelWidth: 55,
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
            url: "http://" + window.location.host + "/gamingMoney/logs",
            method: 'GET',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                //console.log(json);
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
                {name: 'numOfTotalPay', type: 'string'},
                {name: 'numOfTotalIncome', type: 'string'},
                {name: 'numOfRegisterAmount', type: 'string'},
                {name: 'numOfDailyActiveAmount', type: 'string'},
                {name: 'numOfOnlineAmount', type: 'string'},
                {name: 'numOfBuyGamingMoneyAmount', type: 'string'},
                {name: 'numOfLowerLevelGame', type: 'string'},
                {name: 'numOfLowerLevelIncome', type: 'string'},
                {name: 'numOfLowerRobotIncome', type: 'string'},
                {name: 'numOfLowerRobotPay', type: 'string'},
                {name: 'numOfMiddleLevelGame', type: 'string'},
                {name: 'numOfMiddleLevelIncome', type: 'string'},
                {name: 'numOfMiddleRobotIncome', type: 'string'},
                {name: 'numOfMiddleRobotPay', type: 'string'},
                {name: 'numOfHigherLevelGame', type: 'string'},
                {name: 'numOfHigherLevelIncome', type: 'string'},
                {name: 'numOfHigherRobotIncome', type: 'string'},
                {name: 'numOfHigherRobotPay', type: 'string'},
                {name: 'numOfSuperLevelGame', type: 'string'},
                {name: 'numOfSuperLevelIncome', type: 'string'},
                {name: 'numOfSuperRobotIncome', type: 'string'},
                {name: 'numOfSuperRobotPay', type: 'string'},
                {name: 'numOfSendGiftAmount', type: 'string'},
                {name: 'numOfReceiveGiftAmount', type: 'string'},
                {name: 'numOfAnnounceAmount', type: 'string'},
                {name: 'numOfSuperRobotIncome', type: 'string'},
                {name: 'numOfSendGiftAmount', type: 'string'},
                {name: 'numOfReceiveGiftAmount', type: 'string'},
                {name: 'numOfAnnounceAmount', type: 'string'},
                {name: 'numOfVipAward', type: 'string'},
                {name: 'numOfRechargeDailyAward', type: 'string'},
                {name: 'numOfFirstRechargeAward', type: 'string'},
                {name: 'numOfShowPlayerMoney', type: 'string'},
                {name: 'numOfReceiveCdKey', type: 'string'},
                {name: 'numOfCouponExchange', type: 'string'},
                {name: 'numOfArena1Game', type: 'string'},
                {name: 'numOfArena1Income', type: 'string'},
                {name: 'numOfArena2Game', type: 'string'},
                {name: 'numOfArena2Income', type: 'string'},
                {name: 'numOfArena3Game', type: 'string'},
                {name: 'numOfArena3Income', type: 'string'},
                {name: 'numOfNoviceAmount', type: 'string'},
                {name: 'numOfInsiderAmount', type: 'string'},
                {name: 'numOfDaySurplus', type: 'string'},
                {name: 'numOfTaskAward', type: 'string'},
                {name: 'difference', type: 'string'},
                {name: 'numOfCrazy1Game', type: 'string'},
                {name: 'numOfCrazy1Income', type: 'string'},
                {name: 'numOfCrazy2Game', type: 'string'},
                {name: 'numOfCrazy2Income', type: 'string'},
                {name: 'numOfBeautyDailyAward', type: 'string'},
                {name: 'numOfBeautyRankAward', type: 'string'},
                {name: 'numOfActivityAward', type: 'string'},
                {name: 'numOfLeiTaiGame', type: 'string'},
                {name: 'numOfLeiTaiIncome', type: 'string'},
                {name: 'numOfLeiTaiTips', type: 'string'},
                {name: 'numOfCreateFamilyIncome', type: 'string'},
                {name: 'numOfDistributeFamilyAward', type: 'string'},
                {name: 'numOfChangeFamilyName', type: 'string'},
                {name: 'numOfBlessingAward', type: 'string'}
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
                    {text: '产出', width: 100,  dataIndex: 'numOfTotalPay'},
                    {text: '消耗', width: 100,  dataIndex: 'numOfTotalIncome'},
                    {text: '总剩余', width: 100,  dataIndex: 'numOfDaySurplus'},
                    {text: '差值', width: 100,  dataIndex: 'difference'},
                    {text: '新玩家', width: 100,  dataIndex: 'numOfRegisterAmount'},
                    {text: '登录奖励', width: 100,  dataIndex: 'numOfDailyActiveAmount'},
                    {text: '在线奖励', width: 100,  dataIndex: 'numOfOnlineAmount'},
                    {text: '金币购买', width: 100,  dataIndex: 'numOfBuyGamingMoneyAmount'},
                    {text: 'VIP奖励', width: 100,  dataIndex: 'numOfVipAward'},
                    {text: '每日充值奖励', width: 100,  dataIndex: 'numOfRechargeDailyAward'},
                    {text: '首充奖励', width: 100,  dataIndex: 'numOfFirstRechargeAward'},
                    {text: '救助金', width: 100,  dataIndex: 'numOfShowPlayerMoney'},  //底注奖励
                    {text: '初级局数', width: 100,  dataIndex: 'numOfLowerLevelGame'},
                    {text: '初级消耗', width: 100,  dataIndex: 'numOfLowerLevelIncome'},
                    {text: '初级机器人产出', width: 100,  dataIndex: 'numOfLowerRobotPay'},
                    {text: '初级机器人消耗', width: 100,  dataIndex: 'numOfLowerRobotIncome'},
                    {text: '中级局数', width: 100,  dataIndex: 'numOfMiddleLevelGame'},
                    {text: '中级消耗', width: 100,  dataIndex: 'numOfMiddleLevelIncome'},
                    {text: '中级机器人产出', width: 100,  dataIndex: 'numOfMiddleRobotPay'},
                    {text: '中级机器人消耗', width: 100,  dataIndex: 'numOfMiddleRobotIncome'},
                    {text: '高级局数', width: 100,  dataIndex: 'numOfHigherLevelGame'},
                    {text: '高级消耗', width: 100,  dataIndex: 'numOfHigherLevelIncome'},
                    {text: '高级机器人产出', width: 100,  dataIndex: 'numOfHigherRobotPay'},
                    {text: '高级机器人消耗', width: 100,  dataIndex: 'numOfHigherRobotIncome'},
                    {text: '至尊局数', width: 100,  dataIndex: 'numOfSuperLevelGame'},
                    {text: '至尊消耗', width: 100,  dataIndex: 'numOfSuperLevelIncome'},
                    {text: '至尊机器人产出', width: 100,  dataIndex: 'numOfSuperRobotPay'},
                    {text: '至尊机器人消耗', width: 100,  dataIndex: 'numOfSuperRobotIncome'},
                    {text: '普通赛局数', width: 100,  dataIndex: 'numOfArena1Game'},
                    {text: '普通赛消耗', width: 100,  dataIndex: 'numOfArena1Income'},
                    {text: '精英赛局数', width: 100,  dataIndex: 'numOfArena2Game'},
                    {text: '精英赛消耗', width: 100,  dataIndex: 'numOfArena2Income'},
                    {text: '富豪赛局数', width: 100,  dataIndex: 'numOfArena3Game'},
                    {text: '富豪赛消耗', width: 100,  dataIndex: 'numOfArena3Income'},
                    {text: '疯狂金花1局数', width: 100,  dataIndex: 'numOfCrazy1Game'},
                    {text: '疯狂金花1消耗', width: 100,  dataIndex: 'numOfCrazy1Income'},
                    {text: '疯狂金花2局数', width: 100,  dataIndex: 'numOfCrazy2Game'},
                    {text: '疯狂金花2消耗', width: 100,  dataIndex: 'numOfCrazy2Income'},
                    {text: '擂台场局数', width: 100,  dataIndex: 'numOfLeiTaiGame'},
                    {text: '擂台场消耗', width: 100,  dataIndex: 'numOfLeiTaiIncome'},
                    {text: '擂台场小费消耗', width: 100,  dataIndex: 'numOfLeiTaiTips'},
                    {text: '送礼', width: 100,  dataIndex: 'numOfSendGiftAmount'},
                    {text: '收礼', width: 100,  dataIndex: 'numOfReceiveGiftAmount'},
                    {text: '喇叭', width: 100,  dataIndex: 'numOfAnnounceAmount'},
                    {text: 'CDKEY兑换', width: 100,  dataIndex: 'numOfReceiveCdKey'},
                    {text: '礼券兑换', width: 100,  dataIndex: 'numOfCouponExchange'},
                    {text: '新手教程', width: 100,  dataIndex: 'numOfNoviceAmount'},
                    {text: '任务产出', width: 100,  dataIndex: 'numOfTaskAward'},
                    {text: '特殊消耗', width: 100,  dataIndex: 'numOfInsiderAmount'},
                    {text: '美女每日奖励', width: 100,  dataIndex: 'numOfBeautyDailyAward'},
                    {text: '美女排名奖励', width: 100,  dataIndex: 'numOfBeautyRankAward'},
                    {text: '限时活动奖励', width: 100,  dataIndex: 'numOfActivityAward'},
                    {text: '创建家族', width: 100,  dataIndex: 'numOfCreateFamilyIncome'},
                    {text: '家族发奖', width: 100,  dataIndex: 'numOfDistributeFamilyAward'},
                    {text: '修改家族名称', width: 100,  dataIndex: 'numOfChangeFamilyName'},
                    {text: '祈福金币', width: 100,  dataIndex: 'numOfBlessingAward'}
                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};

function insiderGamingMoney(){
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
                fieldLabel: '玩家ID',
                labelWidth: 50,
                width: 150,
                editable:true,
                name: 'queryId'
            },
            {
                xtype : 'datefield',
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
                //labelWidth: 55,
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
        args.queryId = args.queryId == "" ? 0 : args.queryId;
        Ext.Ajax.request({
            url: "http://" + window.location.host + "/gamingMoney/getInsiderLogs",
            method: 'GET',
            params: args,
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                for (var i in json) {
                    json[i].numOfLeiTaiGame = json[i].numOfLeiTaiGame ? json[i].numOfLeiTaiGame : 0;
                    json[i].numOfLeiTaiAmount = json[i].numOfLeiTaiAmount ? json[i].numOfLeiTaiAmount : 0;
                    json[i].numOfLeiTaiWin = json[i].numOfLeiTaiWin ? json[i].numOfLeiTaiWin : 0;
                    json[i].numOfLeiTaiLoss = json[i].numOfLeiTaiLoss ? json[i].numOfLeiTaiLoss : 0;
                    json[i].numOfLeiTaiTipsLoss = json[i].numOfLeiTaiTipsLoss ? json[i].numOfLeiTaiTipsLoss : 0;

                    json[i].dt = timeFormat(json[i].dt);
                    json[i].totalWin = json[i].numOfHigherLevelWin + json[i].numOfSuperLevelWin + json[i].numOfCrazy1Win +
                        json[i].numOfCrazy2Win + json[i].numOfReceiveGiftWin + json[i].numOfLeiTaiWin;

                    var higherLoss =  Math.floor(json[i].numOfHigherLevelLoss * 0.09) * 10;
                    var superLoss =  Math.floor(json[i].numOfSuperLevelLoss * 0.09) * 10;
                    var crazy1Loss =  Math.floor(json[i].numOfCrazy1Loss * 0.09) * 10;
                    var crazy2Loss =  Math.floor(json[i].numOfCrazy2Loss * 0.09) * 10;
                    var leiTaiLoss =  Math.floor(json[i].numOfLeiTaiLoss * 0.09) * 10;
                    json[i].numOfHigherLevelAmount += json[i].numOfHigherLevelLoss - higherLoss;
                    json[i].numOfSuperLevelAmount += json[i].numOfSuperLevelLoss - superLoss;
                    json[i].numOfCrazy1Amount += json[i].numOfCrazy1Loss - crazy1Loss;
                    json[i].numOfCrazy2Amount += json[i].numOfCrazy2Loss - crazy2Loss;
                    json[i].numOfLeiTaiAmount += json[i].numOfLeiTaiLoss - leiTaiLoss;
                    json[i].numOfHigherLevelLoss = higherLoss;
                    json[i].numOfSuperLevelLoss = superLoss;
                    json[i].numOfCrazy1Loss = crazy1Loss;
                    json[i].numOfCrazy2Loss = crazy2Loss;
                    json[i].numOfLeiTaiLoss = leiTaiLoss;

                    json[i].totalAmount = json[i].numOfHigherLevelAmount + json[i].numOfSuperLevelAmount + json[i].numOfCrazy1Amount +
                        json[i].numOfCrazy2Amount + json[i].numOfSendGiftAmount + json[i].numOfReceiveGiftAmount + json[i].numOfAnnounceAmount +
                        json[i].numOfInsiderAmount + json[i].numOfLeiTaiAmount + json[i].numOfLeiTaiTipsAmount;
                    json[i].totalLoss = json[i].numOfHigherLevelLoss + json[i].numOfSuperLevelLoss + json[i].numOfCrazy1Loss +
                        json[i].numOfCrazy2Loss + json[i].numOfSendGiftLoss + json[i].numOfBuyGamingMoneyLoss + json[i].numOfDailyActiveLoss +
                        json[i].numOfRechargeDailyLoss + json[i].numOfLeiTaiLoss + json[i].numOfLeiTaiTipsLoss;
                    json[i].interval = json[i].totalWin + json[i].totalAmount - json[i].totalLoss;
                    json[i].totalLoss = - json[i].totalLoss;
                    json[i].numOfHigherLevelLoss = - json[i].numOfHigherLevelLoss;
                    json[i].numOfSuperLevelLoss = - json[i].numOfSuperLevelLoss;
                    json[i].numOfCrazy1Loss = - json[i].numOfCrazy1Loss;
                    json[i].numOfCrazy2Loss = - json[i].numOfCrazy2Loss;
                    json[i].numOfSendGiftLoss = - json[i].numOfSendGiftLoss;
                    json[i].numOfBuyGamingMoneyLoss = - json[i].numOfBuyGamingMoneyLoss;
                    json[i].numOfDailyActiveLoss = - json[i].numOfDailyActiveLoss;
                    json[i].numOfRechargeDailyLoss = - json[i].numOfRechargeDailyLoss;
                    json[i].numOfLeiTaiLoss = - json[i].numOfLeiTaiLoss;
                    json[i].numOfLeiTaiTipsLoss = - json[i].numOfLeiTaiTipsLoss;
                }
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
                {name: 'queryId', type: 'string'},
                {name: 'nickname', type: 'string'},
                {name: 'numOfHigherLevelGame', type: 'string'},
                {name: 'numOfHigherLevelWin', type: 'string'},
                {name: 'numOfHigherLevelLoss', type: 'string'},
                {name: 'numOfHigherLevelAmount', type: 'string'},
                {name: 'numOfSuperLevelGame', type: 'string'},
                {name: 'numOfSuperLevelWin', type: 'string'},
                {name: 'numOfSuperLevelLoss', type: 'string'},
                {name: 'numOfSuperLevelAmount', type: 'string'},
                {name: 'numOfCrazy1Game', type: 'string'},
                {name: 'numOfCrazy1Win', type: 'string'},
                {name: 'numOfCrazy1Loss', type: 'string'},
                {name: 'numOfCrazy1Amount', type: 'string'},
                {name: 'numOfCrazy2Game', type: 'string'},
                {name: 'numOfCrazy2Win', type: 'string'},
                {name: 'numOfCrazy2Loss', type: 'string'},
                {name: 'numOfCrazy2Amount', type: 'string'},
                {name: 'numOfSendGiftAmount', type: 'string'},
                {name: 'numOfSendGiftLoss', type: 'string'},
                {name: 'numOfReceiveGiftWin', type: 'string'},
                {name: 'numOfReceiveGiftAmount', type: 'string'},
                {name: 'numOfAnnounceAmount', type: 'string'},
                {name: 'numOfInsiderAmount', type: 'string'},
                {name: 'numOfBuyGamingMoneyLoss', type: 'string'},
                {name: 'numOfDailyActiveLoss', type: 'string'},
                {name: 'numOfRechargeDailyLoss', type: 'string'},
                {name: 'totalWin', type: 'string'},
                {name: 'totalAmount', type: 'string'},
                {name: 'totalLoss', type: 'string'},
                {name: 'interval', type: 'string'},
                {name: 'numOfLeiTaiGame', type: 'string'},
                {name: 'numOfLeiTaiWin', type: 'string'},
                {name: 'numOfLeiTaiLoss', type: 'string'},
                {name: 'numOfLeiTaiAmount', type: 'string'},
                {name: 'numOfLeiTaiTipsLoss', type: 'string'},
                {name: 'numOfLeiTaiTipsAmount', type: 'string'}
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
                    {text: '玩家ID', width: 100,  dataIndex: 'queryId'},
                    {text: '玩家昵称', width: 100,  dataIndex: 'nickname'},
                    //{text: '合计', width: 100,  dataIndex: 'interval'},
                    {text: '消耗', width: 100,  dataIndex: 'totalAmount'},
                    {text: '赢', width: 100,  dataIndex: 'totalWin'},
                    {text: '输', width: 100,  dataIndex: 'totalLoss'},
                    {text: '高级局数', width: 100,  dataIndex: 'numOfHigherLevelGame'},
                    {text: '高级赢币', width: 100,  dataIndex: 'numOfHigherLevelWin'},
                    {text: '高级消耗', width: 100,  dataIndex: 'numOfHigherLevelAmount'},
                    {text: '高级输币', width: 100,  dataIndex: 'numOfHigherLevelLoss'},
                    {text: '至尊局数', width: 100,  dataIndex: 'numOfSuperLevelGame'},
                    {text: '至尊赢币', width: 100,  dataIndex: 'numOfSuperLevelWin'},
                    {text: '至尊消耗', width: 100,  dataIndex: 'numOfSuperLevelAmount'},
                    {text: '至尊输币', width: 100,  dataIndex: 'numOfSuperLevelLoss'},
                    {text: '金花1局数', width: 100,  dataIndex: 'numOfCrazy1Game'},
                    {text: '金花1赢币', width: 100,  dataIndex: 'numOfCrazy1Win'},
                    {text: '金花1消耗', width: 100,  dataIndex: 'numOfCrazy1Amount'},
                    {text: '金花1输币', width: 100,  dataIndex: 'numOfCrazy1Loss'},
                    {text: '金花2局数', width: 100,  dataIndex: 'numOfCrazy2Game'},
                    {text: '金花2赢币', width: 100,  dataIndex: 'numOfCrazy2Win'},
                    {text: '金花2消耗', width: 100,  dataIndex: 'numOfCrazy2Amount'},
                    {text: '金花2输币', width: 100,  dataIndex: 'numOfCrazy2Loss'},
                    {text: '送礼消耗', width: 100,  dataIndex: 'numOfSendGiftAmount'},
                    {text: '送礼输币', width: 100,  dataIndex: 'numOfSendGiftLoss'},
                    {text: '收礼赢币', width: 100,  dataIndex: 'numOfReceiveGiftWin'},
                    {text: '收礼消耗', width: 100,  dataIndex: 'numOfReceiveGiftAmount'},
                    {text: '喇叭消耗', width: 100,  dataIndex: 'numOfAnnounceAmount'},
                    {text: '特殊消耗', width: 100,  dataIndex: 'numOfInsiderAmount'},
                    {text: '金币购买', width: 100,  dataIndex: 'numOfBuyGamingMoneyLoss'},
                    {text: '登录奖励', width: 100,  dataIndex: 'numOfDailyActiveLoss'},
                    {text: '月充奖励', width: 100,  dataIndex: 'numOfRechargeDailyLoss'},
                    {text: '擂台局数', width: 100,  dataIndex: 'numOfLeiTaiGame'},
                    {text: '擂台赢币', width: 100,  dataIndex: 'numOfLeiTaiWin'},
                    {text: '擂台消耗', width: 100,  dataIndex: 'numOfLeiTaiAmount'},
                    {text: '擂台输币', width: 100,  dataIndex: 'numOfLeiTaiLoss'},
                    {text: '擂台小费输币', width: 100,  dataIndex: 'numOfLeiTaiTipsLoss'},
                    {text: '擂台小费消耗', width: 100,  dataIndex: 'numOfLeiTaiTipsAmount'}
                ],
                width: 'auto'
            });

            logList.render('dataRegion');
        }
    }
};

