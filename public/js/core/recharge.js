function recharge(){
    Ext.getDom('condition').innerHTML = '';
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/recharge/get",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("提示", "获取服务器相关数据失败");
            } else {
                console.log(json);
                showPanel(json);
            }
        },
        failure: function(){}
    });
};

function showPanel(dataFromServer) {
    var topForm = new Ext.FormPanel({
        frame: true,
        width: 800,
        height: 50,
        style : 'margin-left:180px;margin-top:30px;',
        layout : 'column',
        items:[
            {
                xtype : 'label',
                style : 'margin-top:13px;margin-left:15px',
                text: "短信支付功能"
            },
            {
                xtype : 'label',
                style : 'margin-top:13px;margin-left:50px;',
                id: 'isClosing',
                text :  dataFromServer.isClosing ? "状态: 关闭" : "状态: 开启"
            },
            {
                xtype : 'button',
                style : 'margin-top:10px;margin-left:15px;',
                id: "closeBtn",
                text : dataFromServer.isClosing ? "开 启" : "关 闭",
                handler : function(){
                    setReportState('isClosing', 'closeBtn', '/recharge/setClosing');
                }
            },
            {
                xtype : 'label',
                style : 'margin-top:13px;margin-left:50px',
                id: 'tab',
                text :  dataFromServer.tab ? "充值标签: 短信" : "充值标签: 小米"
            },
            {
                xtype : 'button',
                style : 'margin-top:10px;margin-left:15px;',
                text : "切 换",
                handler : function(){
                    var labelText = Ext.getCmp('tab').text;
                    setRechargeTab(labelText);
                }
            }
        ]
    });

    var activityForm = new Ext.FormPanel({
        frame: true,
        width: 800,
        height: 50,
        style : 'margin-left:180px;margin-top:30px;',
        layout : 'column',
        items:[
            {
                xtype : 'datefield',
                style : 'margin-top:10px;margin-left:15px',
                fieldLabel: '活动日期',
                labelWidth: 55,
                width: 205,
                name: 'startTime',
                value:dataFromServer.startTime ? new Date(dataFromServer.startTime) : new Date(),
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'datefield',
                style : 'margin-top:10px;margin-left:15px',
                width: 150,
                name: 'endTime',
                value:dataFromServer.startTime ? new Date(dataFromServer.endTime) : new Date(),
                format: 'Y-m-d H:i:s',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'textfield',
                fieldLabel: '活动内容',
                style : 'margin-top:10px;margin-left:15px',
                name: "content",
                labelWidth: 60,
                width: 200,
                value: dataFromServer.content
            },
            {
                xtype : 'label',
                style : 'margin-top:13px;margin-left:30px',
                text: "活动"
            },
            {
                xtype : 'label',
                style : 'margin-top:13px;',
                id: 'activity',
                text :  dataFromServer.activity ? "状态: 关闭" : "状态: 开启"
            },
            {
                xtype : 'button',
                style : 'margin-top:10px;margin-left:15px;',
                id: "activityBtn",
                text : dataFromServer.activity ? "开 启" : "关 闭",
                handler : function(){
                    var args =  activityForm.getForm().getValues();
                    setActivity(args, 'activity', "activityBtn");
                }
            }
        ]
    });

    var recharge0 = createRechargeForm(dataFromServer.recharges['mobile'][0], comboOptions, 'option', 'mobile_0', 'mobile_diamond');
    var recharge1 = createRechargeForm(dataFromServer.recharges['mobile'][1], combo1Options, 'option1', 'mobile_1', 'mobile_diamond1');
    var recharge2 = createRechargeForm(dataFromServer.recharges['mobile'][2], combo2Options, 'option2', 'mobile_2', 'mobile_diamond2');
    var recharge3 = createRechargeForm(dataFromServer.recharges['mobile'][3], combo3Options, 'option3', 'mobile_3', 'mobile_diamond3');
    var mobilePanel = new Ext.Panel({
        title: '移动充值',
        width: 800,
        //height: 300,
        height: "auto",
        frame: true,
        style : 'margin-left:180px;margin-top:30px;',
        items: [
            recharge0//,
            //recharge1,
            //recharge2,
            //recharge3
        ]
    });

    var recharge4 = createRechargeForm(dataFromServer.recharges['telecom'][0], comboOptions, 'option', 'telecom_0', 'telecom_iamond');
    var recharge5 = createRechargeForm(dataFromServer.recharges['telecom'][1], combo1Options, 'option1', 'telecom_1', 'telecom_diamond1');
    var recharge6 = createRechargeForm(dataFromServer.recharges['telecom'][2], combo2Options, 'option2', 'telecom_2', 'telecom_diamond2');
    var recharge7 = createRechargeForm(dataFromServer.recharges['telecom'][3], combo3Options, 'option3', 'telecom_3', 'telecom_diamond3');
    var telecomPanel = new Ext.Panel({
        title: '电信充值',
        width: 800,
        //height: 300,
        height: "auto",
        frame: true,
        style : 'margin-left:180px;margin-top:30px;',
        items: [
            recharge4//,
            //recharge5,
            //recharge6,
            //recharge7
        ]
    });

    var ips = [];
    for(var i in dataFromServer.ipList) {
        var ip = {ip : dataFromServer.ipList[i]};
        ips.push(ip);
    }
    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'ip', type:'string'}
        ]
    });

    var store = Ext.create('Ext.data.JsonStore', {
        model: LogDataStruct,
        data: ips
    });

    var ipForm = new Ext.FormPanel({
        frame: true,
        width: 800,
        height: 'auto',
        style : 'margin-left:180px;margin-top:30px;',
        layout : 'column',
        items:[
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:15px',
                fieldLabel: '短信平台IP',
                labelWidth: 70,
                width: 180,
                id: 'ip',
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'button',
                style : 'margin-top:10px;margin-left:15px;',
                text : "新 增",
                handler : function(){
                    addProviderIp();
                }
            },
            {
                xtype : 'grid',
                style : 'margin-top:10px;margin-left:15px',
                store: store,
                height: 150,
                width: 700,
                autoScroll : true,
                columns: [
                     {
                        xtype: 'gridcolumn',
                        dataIndex: 'ip',
                        header: 'IP地址',
                        id: 'id',
                        width: 150
                     }
                ]
            }
        ]
    });

    var totalPanel = new Ext.Panel({
        title: '',
        width: 'auto',
        height: document.documentElement.clientHeight,
        frame: true,
        autoScroll : true,
        items: [
            topForm,
            activityForm,
            mobilePanel,
            telecomPanel,
            ipForm
        ]
    });
    totalPanel.render("condition");
}

var comboOptions = new Ext.data.SimpleStore({
    fields: ['id', 'option'],
    data: [['1', 4],['2',5],['3',6]]
});

var combo1Options = new Ext.data.SimpleStore({
    fields: ['id1', 'option1'],
    data: [['1', 8],['2', 10],['3',12]]
});

var combo2Options = new Ext.data.SimpleStore({
    fields: ['id2', 'option2'],
    data: [['1', 40],['2', 50],['3',60]]
});

var combo3Options = new Ext.data.SimpleStore({
    fields: ['id3', 'option3'],
    data: [['1', 80],['2', 100],['3',90]]
});

function getPointId(provider, payFee) {
    switch(payFee) {
        case 600:
            return 90105;
        case 1200:
            return 90113;
        case 6000:
            return 99999;
        case 9000:
            return 99999;
        case 400:
            return 90107;
        case 800:
            return 90111;
        case 4000:
            return 99999;
        case 8000:
            return 99999;
        case 500:
            return 90104;
        case 1000:
            return 90112;
        case 5000:
            return 99999;
        case 10000:
            return 99999;
    }
}
function createRechargeForm(data, optionName, option, payFeeId, diamondId) {
    return new Ext.FormPanel({
        frame: true,
        title: '',
        width: 750,
        height:50,
        style : 'margin-left:15px;margin-top:10px;',
        layout : 'column',
        items:[
            {
                xtype : 'combo',
                style : 'margin-top:10px;margin-left:15px',
                fieldLabel: '充值金额(元)',
                labelWidth: 80,
                width: 180,
                name: 'payFee',
                model: 'local',
                store: optionName,
                displayField:option,
                value: data.payFee/100,
                id: payFeeId
            },
            {
                xtype : 'textfield',
                style : 'margin-top:10px;margin-left:50px',
                fieldLabel: '兑换钻石数',
                labelWidth: 70,
                width: 170,
                name: 'diamond',
                value: data.diamond,
                id : diamondId
            },
            {
                xtype : 'button',
                style : 'margin-top:10px;margin-left:15px',
                text:'设 置',
                handler : function(){
                    var feeNum = Ext.getCmp(payFeeId).getValue() * 100;
                    var diamondNum = Ext.getCmp(diamondId).getValue();
                    var providers = payFeeId.split("_");
                    console.dir(providers);
                    setRecharge(providers[0], parseInt(providers[1]), feeNum, diamondNum);
                }
            }
        ]
    });
}

function setRecharge(provider, index, payFee, diamond) {
    Ext.MessageBox.confirm("提示", "您确定修改充值金额和钻石数么?", function(e) {
        if (e != "yes") {
            return;
        }

        var pointId = getPointId(provider, payFee);
        Ext.Ajax.request({
            url: "http://" + window.location.host + "/recharge/setReportRecharge",
            method: 'POST',
            params: {provider: provider, index: index, payFee: payFee, diamond: diamond, pointId: pointId},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 200) {
                    Ext.Msg.alert("成功", "操作成功");
                } else {
                    Ext.Msg.alert("错误", "操作失败");
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "操作失败");
            }
        });

    });
}
function setReportState(labelId, btnId, url) {
    var labelText = Ext.getCmp(labelId).text;
    console.log(labelText);
    var msgText = "";
    var isClosing = 2;
    if (labelText === "状态: 开启") {
        msgText = "您确定关闭此功能么?";
        isClosing = 1;
    }  else if (labelText === "状态: 关闭"){
        msgText = "您确定开启此功能么?";
        isClosing = 0;
    }

    if(isClosing != 0 && isClosing != 1) {
        return;
    }

    Ext.MessageBox.confirm("提示", msgText, function(e) {
        if (e != "yes") {
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + url,
            method: 'POST',
            params: {"isClosing": isClosing},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 200) {
                    Ext.Msg.alert("成功", "操作成功");
                    var text = isClosing ? "状态: 关闭" : "状态: 开启";
                    Ext.getCmp(labelId).setText(text);
                    text = isClosing ? "开 启" : "关 闭";
                    Ext.getCmp(btnId).setText(text);
                } else {
                    Ext.Msg.alert("错误", "操作失败");
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "操作失败");
            }
        });
    });
}

function addProviderIp() {
    var ip = Ext.getCmp("ip").getValue();
    if (!ip) {
        Ext.Msg.alert("错误","IP内容不能为空");
        return;
    }

    var ipInfo = ip.split(".");
    if (ipInfo.length != 4 || parseInt(ipInfo[0]) > 255 || parseInt(ipInfo[1]) > 255
        || parseInt(ipInfo[2]) > 255 || parseInt(ipInfo[3]) > 255 || parseInt(ipInfo[0]) < 0
        || parseInt(ipInfo[1]) < 0 || parseInt(ipInfo[2]) < 0 || parseInt(ipInfo[3]) < 0) {
        Ext.Msg.alert("错误","IP格式错误");
        return;
    }
    Ext.MessageBox.confirm("提示", "您确定增加此短信平台IP么?", function(e) {
        if (e != "yes") {
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/recharge/addProviderIp",
            method: 'POST',
            params: {ip: ip},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 200) {
                    Ext.Msg.alert("成功", "操作成功");
                    recharge();
                } else {
                    Ext.Msg.alert("错误", "操作失败");
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "操作失败");
            }
        });

    });
}

function setRechargeTab(labelText) {
    var msgText = "";
    var tab = 2;
    if (labelText === "充值标签: 短信") {
        msgText = "您确定设置小米标签么?";
        tab = 0;
    }  else if (labelText === "充值标签: 小米"){
        msgText = "您确定设置短信标签么?";
        tab = 1;
    }

    if(tab != 0 && tab != 1) {
        return;
    }

    Ext.MessageBox.confirm("提示", msgText, function(e) {
        if (e != "yes") {
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + '/recharge/setTab',
            method: 'POST',
            params: {"tab": tab},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 200) {
                    Ext.Msg.alert("成功", "操作成功");
                    var text = tab ? "充值标签: 短信" : "充值标签: 小米";
                    Ext.getCmp("tab").setText(text);
                } else {
                    Ext.Msg.alert("错误", "操作失败");
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "操作失败");
            }
        });
    });
}

function setActivity(args, labelId, btnId) {
    console.log(args);
    var labelText = Ext.getCmp(labelId).text;
    var msgText = "";
    var isClosing = 2;
    if (labelText === "状态: 开启") {
        msgText = "您确定关闭活动么?";
        isClosing = 1;
    }  else if (labelText === "状态: 关闭"){
        msgText = "您确定开启活动么?";
        isClosing = 0;
    }

    if(isClosing != 0 && isClosing != 1) {
        return;
    }

    if (!isToday(args.startTime) || !isToday(args.endTime)) {
        Ext.Msg.alert("错误", "时间格式错误!");
        return;
    }

    Ext.MessageBox.confirm("提示", msgText, function(e) {
        if (e != "yes") {
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/recharge/setActivity",
            method: 'POST',
            params: {"isClosing": isClosing, "startTime": args.startTime, "endTime": args.endTime, "content": args.content},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 200) {
                    Ext.Msg.alert("成功", "操作成功");
                    var text = isClosing ? "状态: 关闭" : "状态: 开启";
                    Ext.getCmp(labelId).setText(text);
                    text = isClosing ? "开 启" : "关 闭";
                    Ext.getCmp(btnId).setText(text);
                } else {
                    Ext.Msg.alert("错误", "操作失败");
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "操作失败");
            }
        });
    });
}

