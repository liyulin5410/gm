
var TotalAmounts = [5, 10, 50, 100, 500, 1000];
function createRechargeAmountForm (type) {
    return new Ext.FormPanel({
        frame: true,
        title: '',
        width: 600,
        height: 30,
        layout : 'column',
        baseCls:'border-style:none',
        items:[
            {
                xtype : 'textfield',
                fieldLabel: '充值大于等于',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 80,
                width: 150,
                name: "recharge_" + type,
                id: "recharge_" + type
            },
            {
                xtype : 'checkbox',
                style : 'margin-top:10px;margin-left:15px',
                boxLabel: '5钻',
                width: 60,
                name: "amount_" + type + "_0",
                id: "amount_" + type + "_0"
            },
            {
                xtype : 'checkbox',
                style : 'margin-top:10px;',
                boxLabel: '10钻',
                width: 60,
                name: "amount_" + type + "_1",
                id: "amount_" + type + "_1"
            },
            {
                xtype : 'checkbox',
                style : 'margin-top:10px;',
                boxLabel: '50钻',
                width: 60,
                name: "amount_" + type + "_2",
                id: "amount_" + type + "_2"
            },
            {
                xtype : 'checkbox',
                style : 'margin-top:10px;',
                boxLabel: '100钻',
                width: 60,
                name: "amount_" + type + "_3",
                id: "amount_" + type + "_3"
            },
            {
                xtype : 'checkbox',
                style : 'margin-top:10px;',
                boxLabel: '500钻',
                width: 60,
                name: "amount_" + type + "_4",
                id: "amount_" + type + "_4"
            },
            {
                xtype : 'checkbox',
                style : 'margin-top:10px;',
                boxLabel: '1000钻',
                width: 80,
                name: "amount_" + type + "_5",
                id: "amount_" + type + "_5"
            }
        ]
    });
}

function rechargeAmount(){
    var amount0 = createRechargeAmountForm(0);
    var amount1 = createRechargeAmountForm(1);
    var amount2 = createRechargeAmountForm(2);
    var rechargeAmountForm = new Ext.FormPanel({
        frame : true,
        title : '',
        width : 600,
        height : 165,
        style : 'margin-left:150px;margin-top:10px;',
        layout : 'column',
        items:[
            {
                xtype : 'label',
                text: '充值设置',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 600
            },
            amount0,
            amount1,
            amount2,
            {
                xtype : 'button',
                style : 'margin-top:10px;margin-left:250px',
                text:'设 置',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定修改充值额度设置么?", function(e) {
                        setRechargeAmount(e);
                    });
                }
            }
        ]
    });

    var awardForm1 = new Ext.FormPanel({
        frame : true,
        title : '',
        width : 600,
        height : 30,
        layout : 'column',
        baseCls:'border-style:none',
        items:[
            {
                xtype : 'textfield',
                fieldLabel: '当胜利次数小于等于',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 120,
                width: 190,
                name: "firstRechargeAwardWins",
                id: "firstRechargeAwardWins"
            },
            {
                xtype : 'textfield',
                fieldLabel: '首充奖励',
                style : 'margin-top:10px;margin-left:5px',
                labelWidth: 60,
                width: 130,
                name: "firstRechargeAwardByWins",
                id: "firstRechargeAwardByWins"
            },
            {
                xtype : 'textfield',
                fieldLabel: '首充VIP奖励',
                style : 'margin-top:10px;margin-left:5px',
                labelWidth: 80,
                width: 150,
                name: "vipAwardByWins",
                id: "vipAwardByWins"
            }
        ]
    });
    var awardForm = new Ext.FormPanel({
        frame : true,
        title : '',
        width : 600,
        height : 330,
        style : 'margin-left:150px;margin-top:10px;',
        layout : 'column',
        items:[
            {
                xtype : 'label',
                text: '活动奖励',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 600
            },
            {
                xtype : 'textfield',
                fieldLabel: '首充奖励',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 130,
                name: "firstRecharge",
                id: "firstRecharge"
            },
            {
                xtype : 'textfield',
                fieldLabel: '首充VIP奖励',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 80,
                width: 150,
                name: "vipAward",
                id: "vipAward"
            },
            awardForm1,
            {
                xtype : 'label',
                text: '登录奖励倍数',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 600
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP1',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "dailyActive_1",
                id: "dailyActive_1"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP2',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "dailyActive_2",
                id: "dailyActive_2"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP3',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "dailyActive_3",
                id: "dailyActive_3"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP4',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "dailyActive_4",
                id: "dailyActive_4"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP5',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "dailyActive_5",
                id: "dailyActive_5"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP6',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "dailyActive_6",
                id: "dailyActive_6"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP7',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "dailyActive_7",
                id: "dailyActive_7"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP8',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "dailyActive_8",
                id: "dailyActive_8"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP9',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "dailyActive_9",
                id: "dailyActive_9"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP10',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "dailyActive_10",
                id: "dailyActive_10"
            },
            {
                xtype : 'label',
                text: '充值赠送比例',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 600
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP1',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "rechargeBonus_1",
                id: "rechargeBonus_1"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP2',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "rechargeBonus_2",
                id: "rechargeBonus_2"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP3',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "rechargeBonus_3",
                id: "rechargeBonus_3"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP4',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "rechargeBonus_4",
                id: "rechargeBonus_4"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP5',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "rechargeBonus_5",
                id: "rechargeBonus_5"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP6',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "rechargeBonus_6",
                id: "rechargeBonus_6"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP7',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "rechargeBonus_7",
                id: "rechargeBonus_7"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP8',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "rechargeBonus_8",
                id: "rechargeBonus_8"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP9',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "rechargeBonus_9",
                id: "rechargeBonus_9"
            },
            {
                xtype : 'textfield',
                fieldLabel: 'VIP10',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 30,
                width: 100,
                name: "rechargeBonus_10",
                id: "rechargeBonus_10"
            },
            {
                xtype : 'button',
                style : 'margin-top:10px;margin-left:250px',
                text:'设 置',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定修改奖励设置么?", function(e) {
                        setAwards(e);
                    });
                }
            }
        ]
    });

    var dailyActiveForm1 = new Ext.FormPanel({
        frame : true,
        title : '',
        width : 600,
        height : 30,
        layout : 'column',
        baseCls:'border-style:none',
        items:[
            {
                xtype : 'checkbox',
                style : 'margin-top:10px;margin-left:15px',
                boxLabel: '不能领取登陆奖励',
                width: 170,
                name: 'isDailyActiveLimit',
                id : 'isDailyActiveLimit'
            }
        ]
    });

    var dailyActiveForm = new Ext.FormPanel({
        frame : true,
        title : '',
        width : 600,
        height : 80,
        style : 'margin-left:150px;margin-top:10px;',
        layout : 'column',
        items:[
            dailyActiveForm1,
            {
                xtype : 'label',
                style : 'margin-top:13px;margin-left:15px',
                text: "创建账号"
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;',
                width: 50,
                name: "registerTime",
                id: "registerTime"
            },
            {
                xtype : 'label',
                style : 'margin-top:13px;',
                text: "天后，平均每天胜利次数小于等于"
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;',
                width: 50,
                name: "wins",
                id: "wins"
            },
            {
                xtype : 'button',
                style : 'margin-top:10px;margin-left:50px',
                text:'设  置',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定设置只能领取第一天登录奖励么?", function(e) {
                        setDailyActiveAward(e);
                    });
                }
            }
        ]
    });

    var firstRechargeAnnounce = new Ext.FormPanel({
        frame : true,
        title : '',
        width : 600,
        height : 50,
        style : 'margin-left:150px;margin-top:10px;',
        layout : 'column',
        items:[
            {
                xtype : 'label',
                style : 'margin-top:10px;margin-left:15px',
                text: "当胜利次数大于等于"
            },
            {
                xtype : 'textfield',
                style : 'margin-top:6px;',
                width: 100,
                name: "winCount",
                id: "winCount"
            },
            {
                xtype : 'label',
                style : 'margin-top:10px;',
                text: ", 首充、首VIP将全服广播"
            },
            {
                xtype : 'button',
                style : 'margin-top:8px;margin-left:20px',
                text:'设  置',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定设置首充/首VIP广播么?", function(e) {
                        setFirstRechargeAnnounce(e);
                    });
                }
            }
        ]
    })

    var giveGiftPanel = new Ext.FormPanel({
        frame : true,
        title : '',
        width : 600,
        height : 50,
        style : 'margin-left:150px;margin-top:10px;',
        layout : 'column',
        items:[
            {
                xtype : 'label',
                style : 'margin-top:10px;margin-left:15px',
                text: "当胜利次数小于等于"
            },
            {
                xtype : 'textfield',
                style : 'margin-top:6px;',
                width: 100,
                name: "giveGiftWins",
                id: "giveGiftWins"
            },
            {
                xtype : 'label',
                style : 'margin-top:10px;',
                text: ", 不能送礼"
            },
            {
                xtype : 'button',
                style : 'margin-top:8px;margin-left:20px',
                text:'设  置',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定设置送礼限制么?", function(e) {
                        setGiveGiftWins(e);
                    });
                }
            }
        ]
    });

    var blessingPanel = new Ext.FormPanel({
        frame : true,
        title : '',
        width : 600,
        height : 50,
        style : 'margin-left:150px;margin-top:10px;',
        layout : 'column',
        items:[
            {
                xtype : 'checkbox',
                style : 'margin-top:10px;margin-left:15px',
                boxLabel: '祈福获得礼品全服广播',
                width: 150,
                name: 'blessingFCode',
                id : 'blessingFCode'
            },
            {
                xtype : 'checkbox',
                style : 'margin-top:10px;margin-left:15px',
                boxLabel: '祈福获取金币大于等于',
                width: 140,
                name: 'canBlessingGamingMoney',
                id : 'canBlessingGamingMoney'
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;',
                width: 80,
                name: "blessingGamingMoney",
                id: "blessingGamingMoney"
            },
            {
                xtype : 'label',
                style : 'margin-top:12px;',
                text: "万, 全服广播"
            },
            {
                xtype : 'button',
                style : 'margin-top:8px;margin-left:20px',
                text:'设  置',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定设置祈福广播么?", function(e) {
                        setBlessingAnnounce(e);
                    });
                }
            }
        ]
    });

    var totalPanel = new Ext.Panel({
        title: '',
        width: 'auto',
        height: document.documentElement.clientHeight,
        autoScroll : true,
        frame: true,
        items: [
            rechargeAmountForm,
            awardForm,
            dailyActiveForm,
            firstRechargeAnnounce,
            giveGiftPanel,
            blessingPanel
        ]
    });
    totalPanel.render("condition");

    loadServerData();
};

function loadServerData() {
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/rechargeAmount/get",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            console.log(json);
            for(var i in json) {
                Ext.getCmp("recharge_" + i).setValue(json[i].recharge);
                for (var j in json[i].amounts) {
                    for(var index in TotalAmounts) {
                        if (json[i].amounts[j] === TotalAmounts[index]) {
                            Ext.getCmp("amount_" + i + "_" + index).setValue("on") ;
                        }
                    }
                }
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/rechargeAmount/getAwards",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            console.log(json);
            Ext.getCmp("firstRecharge").setValue(json.firstRecharge);
            Ext.getCmp("vipAward").setValue(json.vipAward);
            Ext.getCmp("firstRechargeAwardWins").setValue(json.firstRechargeAwardWins);
            Ext.getCmp("firstRechargeAwardByWins").setValue(json.firstRechargeAwardByWins);
            Ext.getCmp("vipAwardByWins").setValue(json.vipAwardByWins);
            for(var i = 1; i < json.dailyActive.length; ++i) {
                Ext.getCmp("dailyActive_" + i).setValue(json.dailyActive[i]);
            }
            for(var i = 1; i < json.rechargeBonus.length; ++i) {
                Ext.getCmp("rechargeBonus_" + i).setValue(json.rechargeBonus[i]);
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/rechargeAmount/getDailyActiveLimit",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            console.log(json);
            Ext.getCmp("isDailyActiveLimit").setValue(json.isDailyActiveLimit ? true : false);
            //Ext.getCmp("dailyActiveAward").setValue(json.dailyActiveAward);
            Ext.getCmp("wins").setValue(json.wins);
            Ext.getCmp("registerTime").setValue(json.registerTime);
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/rechargeAmount/getFirstRechargeAnnounceWins",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            Ext.getCmp("winCount").setValue(json);
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/rechargeAmount/getGiveGiftWins",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            Ext.getCmp("giveGiftWins").setValue(json);
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/rechargeAmount/getBlessingAnnounce",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            Ext.getCmp("blessingFCode").setValue(json.blessingFCode ? true : false);
            Ext.getCmp("canBlessingGamingMoney").setValue(json.canBlessingGamingMoney ? true : false);
            Ext.getCmp("blessingGamingMoney").setValue(json.blessingGamingMoney);
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });
}

function setAwards(e) {
    if (e != "yes") {
        return;
    }

    var value = {};
    value.firstRecharge = parseInt(Ext.getCmp("firstRecharge").getValue());
    value.vipAward = parseInt(Ext.getCmp("vipAward").getValue());
    value.firstRechargeAwardWins = parseInt(Ext.getCmp("firstRechargeAwardWins").getValue());
    value.firstRechargeAwardByWins = parseInt(Ext.getCmp("firstRechargeAwardByWins").getValue());
    value.vipAwardByWins = parseInt(Ext.getCmp("vipAwardByWins").getValue());
    value.dailyActive = [1];
    for(var i = 1; i < 11; ++i) {
        value.dailyActive[i] = parseFloat(Ext.getCmp("dailyActive_" + i).getValue());
    }
    value.rechargeBonus = [0];
    for(var i = 1; i < 11; ++i) {
        value.rechargeBonus[i] = parseFloat(Ext.getCmp("rechargeBonus_" + i).getValue());
    }

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/rechargeAmount/setAwards",
        method: 'POST',
        params: {"value": JSON.stringify(value)},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "操作失败");
            } else {
                Ext.Msg.alert("成功", "设置成功");
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });

}

function setDailyActiveAward(e) {
    if (e != "yes") {
        return;
    }

    var value = {};
    value.isDailyActiveLimit = (Ext.getCmp('isDailyActiveLimit').getValue()) ? 1 : 0;
    value.wins = parseInt(Ext.getCmp('wins').getValue());
    value.registerTime = parseInt(Ext.getCmp('registerTime').getValue());
    value.dailyActiveAward = 0;//parseInt(Ext.getCmp('dailyActiveAward').getValue());
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/rechargeAmount/setDailyActiveLimit",
        method: 'POST',
        params: {"value": JSON.stringify(value)},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "操作失败");
            } else {
                Ext.Msg.alert("成功", "设置成功");
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });

}

function setRechargeAmount(e) {
    if (e != "yes") {
        return;
    }

    var value = [];
    for (var i = 0; i < 3; ++i) {
        var recharge =  parseInt(Ext.getCmp("recharge_" + i).getValue());
        if (value.length >= 1) {
            var maxValue = value[value.length-1].recharge;
            if (recharge < maxValue) {
                Ext.Msg.alert("提示", "第" + (i+1) + "档次的充值数小于前一档次的充值数，请修改!");
                return;
            }
        }

        var amounts = [];
        for (var j = 0; j < 6; ++j) {
            var checked = Ext.getCmp("amount_" + i + "_" + j).getValue();
            if (checked) {
                amounts.push(TotalAmounts[j]);
            }
        }
        var prob = {"recharge" : recharge, "amounts" : amounts};
        value.push(prob);
    }

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/rechargeAmount/set",
        method: 'POST',
        params: {"value": JSON.stringify(value)},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "操作失败");
            } else {
                Ext.Msg.alert("成功", "设置成功");
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });

}

function setFirstRechargeAnnounce(e) {
    if (e != "yes") {
        return;
    }

    var value = Ext.getCmp("winCount").getValue();

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/rechargeAmount/setFirstRechargeAnnounceWins",
        method: 'POST',
        params: {"value": value},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "操作失败");
            } else {
                Ext.Msg.alert("成功", "设置成功");
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });

}

function setGiveGiftWins(e) {
    if (e != "yes") {
        return;
    }

    var value = Ext.getCmp("giveGiftWins").getValue();

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/rechargeAmount/setGiveGiftWins",
        method: 'POST',
        params: {"value": value},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "操作失败");
            } else {
                Ext.Msg.alert("成功", "设置成功");
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });

}

function setBlessingAnnounce(e) {
    if (e != "yes") {
        return;
    }

    var value = {};
    value.blessingFCode = (Ext.getCmp('blessingFCode').getValue()) ? 1 : 0;
    value.canBlessingGamingMoney = (Ext.getCmp('canBlessingGamingMoney').getValue()) ? 1 : 0;
    value.blessingGamingMoney = parseInt(Ext.getCmp('blessingGamingMoney').getValue());
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/rechargeAmount/setBlessingAnnounce",
        method: 'POST',
        params: value,
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "操作失败");
            } else {
                Ext.Msg.alert("成功", "设置成功");
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });

}


