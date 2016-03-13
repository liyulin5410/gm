var labelString = ["初级场比率: ", "中级场比率: ", "高级场比率: ", "至尊场比率: "];

function createRobotForm (label1, text1, label2, button1, text2) {
   return new Ext.FormPanel({
       frame: true,
       title: '',
       width: 800,
       height:50,
       style : 'margin-left:200px;margin-top:30px;',
       layout : 'column',
       items:[
           {
               xtype : 'label',
               style : 'margin-top:13px;margin-left:15px',
               id: label1
           },
           {
               xtype : 'textfield',
               fieldLabel: '新比率',
               style : 'margin-top:10px;margin-left:15px',
               labelWidth: 40,
               width: 150,
               //allowBlank : false,
               //blankText:'此项不能为空',
               id: text1
           },
           {
               xtype : 'button',
               style : 'margin-top:10px;margin-left:15px',
               text:'设 置',
               handler : function(){
                   Ext.MessageBox.confirm("提示", "您确定修改机器人输赢比率么?", function(e) {
                       if (e != "yes") {
                           return;
                       }

                       var newRatio =  Ext.getCmp(text1).getValue();
                       if (newRatio < 1) {
                           Ext.Msg.alert("提示", "新比率不能小于1,请修改!");
                           return;
                       }

                       var type =  parseInt(text1);
                       Ext.Ajax.request({
                           url: "http://" + window.location.host + "/robot/setRatio",
                           method: 'POST',
                           params: {"type": type, "ratio": newRatio},
                           success: function(response){
                               var json = Ext.JSON.decode(response.responseText);
                               if (json.resultCode === 200) {
                                   Ext.Msg.alert("成功", "操作成功");
                                   var labelText = labelString[type] + newRatio;
                                   Ext.getCmp(label1).setText(labelText);
                                   Ext.getCmp(text1).setValue("");
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
           },
           {
               xtype : 'label',
               style : 'margin-top:13px;margin-left:50px;',
               id: label2
           },
           {
               xtype : 'button',
               style : 'margin-top:10px;margin-left:15px;',
               id: button1,
               handler : function(){
                   var labelText = Ext.getCmp(label2).text;
                   console.log(labelText);
                   var msgText = "";
                   var isClosing = 2;
                   if (labelText === "状态: 开启") {
                       msgText = "您确定关闭机器人么?";
                       isClosing = 1;
                   }  else if (labelText === "状态: 关闭"){
                       msgText = "您确定开启机器人么?";
                       isClosing = 0;
                   }

                   if(isClosing != 0 && isClosing != 1) {
                       return;
                   }

                   Ext.MessageBox.confirm("提示", msgText, function(e) {
                       if (e != "yes") {
                           return;
                       }

                       var type =  parseInt(text1);
                       Ext.Ajax.request({
                           url: "http://" + window.location.host + "/robot/setClosing",
                           method: 'POST',
                           params: {"type": type, "isClosing": isClosing},
                           success: function(response){
                               var json = Ext.JSON.decode(response.responseText);
                               if (json.resultCode === 200) {
                                   Ext.Msg.alert("成功", "操作成功");
                                   var text = isClosing ? "状态: 关闭" : "状态: 开启";
                                   Ext.getCmp(label2).setText(text);
                                   text = isClosing ? "开 启" : "关 闭";
                                   Ext.getCmp(button1).setText(text);
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
           },
           {
               xtype : 'textfield',
               fieldLabel: '新增机器人数',
               style : 'margin-top:10px;margin-left:50px',
               labelWidth: 80,
               width: 130,
               value : 1,
               allowBlank : false,
               blankText:'此项不能为空',
               id : text2
           },
           {
               xtype : 'button',
               style : 'margin-top:10px;margin-left:15px',
               text:'增 加',
               handler : function(){
                   Ext.MessageBox.confirm("提示", "您确定增加机器人么?", function(e) {
                       if (e != "yes") {
                           return;
                       }

                       var count =  Ext.getCmp(text2).getValue();
                       if (count < 1 || count > 100) {
                           Ext.Msg.alert("提示", "新增机器人数取值范围为[1, 100],请修改!");
                           return;
                       }

                       var type =  parseInt(text1);
                       Ext.Ajax.request({
                           url: "http://" + window.location.host + "/robot/new",
                           method: 'POST',
                           params: {"type": type, "count": count},
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
           }
       ]
   });
}

function robotManager(){
    var robot0 = createRobotForm("label1_0", "0", "label2_0", "button1_0", "text2_0");
    var robot1 = createRobotForm("label1_1", "1", "label2_1", "button1_1", "text2_1");
    var robot2 = createRobotForm("label1_2", "2", "label2_2", "button1_2", "text2_2");
    var robot3 = createRobotForm("label1_3", "3", "label2_3", "button1_3", "text2_3");
    var pokerForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 600,
        height:50,
        style : 'margin-left:200px;margin-top:30px;',
        layout : 'column',
        items:[
            {
                xtype : 'label',
                style : 'margin-top:13px;margin-left:15px',
                id: "pokerRatio"
            },
            {
                xtype : 'textfield',
                fieldLabel: '新机率',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 170,
                id: "newGoodHandRatio"
            },
            {
                xtype : 'button',
                style : 'margin-top:10px;margin-left:15px',
                text:'设 置',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定修改大牌机率么?", function(e) {
                        setGoodHandRatio(e);
                    });
                }
            }
        ]
    });

    var goodHandForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 600,
        height:90,
        style : 'margin-left:200px;margin-top:30px;',
        layout : 'column',
        items:[
            {
                xtype : 'textfield',
                fieldLabel: 'AJ机率',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 160,
                id: "P_AJ"
            },
            {
                xtype : 'textfield',
                fieldLabel: '21点机率',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 160,
                id: "P_21"
            },
            {
                xtype : 'textfield',
                fieldLabel: '20点机率',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 160,
                id: "P_20"
            },
            {
                xtype : 'textfield',
                fieldLabel: '19点机率',
                style : 'margin-top:15px;margin-left:15px',
                labelWidth: 60,
                width: 160,
                id: "P_19"
            },
            {
                xtype : 'textfield',
                fieldLabel: '18点机率',
                style : 'margin-top:15px;margin-left:15px',
                labelWidth: 60,
                width: 160,
                id: "P_18"
            },
            {
                xtype : 'label',
                style : 'margin-top:18px;margin-left:15px',
                id: "P_WuXiaoLong"
            },
            {
                xtype : 'button',
                style : 'margin-top:15px;margin-left:50px',
                text:'设 置',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定修改游戏机率么?", function(e) {
                        setServerProbs(e);
                    });
                }
            }
        ]
    });

    var badLuckGuyForm = new Ext.FormPanel({
        frame : true,
        title : '',
        width : 600,
        height : 170,
        style : 'margin-left:200px;margin-top:30px;',
        layout : 'column',
        items:[
            {
                xtype : 'label',
                text: '倒霉蛋机率设置',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 600
            },
            {
                xtype : 'textfield',
                fieldLabel: '金币大于',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 200,
                name: "gamingMoney_0",
                id: "gamingMoney_0"
            },
            {
                xtype : 'textfield',
                fieldLabel: '倒霉机率',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 200,
                name: "badLuckProb_0",
                id: "badLuckProb_0"
            },
            {
                xtype : 'textfield',
                fieldLabel: '金币大于',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 200,
                name: "gamingMoney_1",
                id: "gamingMoney_1"
            },
            {
                xtype : 'textfield',
                fieldLabel: '倒霉机率',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 200,
                name: "badLuckProb_1",
                id: "badLuckProb_1"
            },
            {
                xtype : 'textfield',
                fieldLabel: '金币大于',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 200,
                name: "gamingMoney_2",
                id: "gamingMoney_2"
            },
            {
                xtype : 'textfield',
                fieldLabel: '倒霉机率',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 200,
                name: "badLuckProb_2",
                id: "badLuckProb_2"
            },
            {
                xtype : 'textfield',
                fieldLabel: '金币大于',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 200,
                name: "gamingMoney_3",
                id: "gamingMoney_3"
            },
            {
                xtype : 'textfield',
                fieldLabel: '倒霉机率',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 200,
                name: "badLuckProb_3",
                id: "badLuckProb_3"
            },
            {
                xtype : 'button',
                style : 'margin-top:10px;margin-left:30px',
                text:'设 置',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定修改倒霉蛋游戏机率么?", function(e) {
                        setBadLuckProb(e);
                    });
                }
            }
        ]
    });

    /*var insiderForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 600,
        height:120,
        style : 'margin-left:200px;margin-top:30px;',
        layout : 'column',
        items:[
            {
                xtype : 'label',
                text: '特殊玩家机率设置',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 600
            },
            {
                xtype : 'textfield',
                fieldLabel: 'AJ机率',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 160,
                id: "insider_P_AJ"
            },
            {
                xtype : 'textfield',
                fieldLabel: '21点机率',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 160,
                id: "insider_P_21"
            },
            {
                xtype : 'textfield',
                fieldLabel: '20点机率',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 160,
                id: "insider_P_20"
            },
            {
                xtype : 'textfield',
                fieldLabel: '19点机率',
                style : 'margin-top:15px;margin-left:15px',
                labelWidth: 60,
                width: 160,
                id: "insider_P_19"
            },
            {
                xtype : 'textfield',
                fieldLabel: '18点机率',
                style : 'margin-top:15px;margin-left:15px',
                labelWidth: 60,
                width: 160,
                id: "insider_P_18"
            },
            {
                xtype : 'label',
                style : 'margin-top:18px;margin-left:15px',
                id: "insider_P_WuXiaoLong"
            },
            {
                xtype : 'button',
                style : 'margin-top:15px;margin-left:50px',
                text:'设 置',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定修改特殊玩家游戏机率么?", function(e) {
                        setServerInsiderProbs(e);
                    });
                }
            }
        ]
    }); */

    var goodLuckForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 600,
        height:50,
        style : 'margin-left:200px;margin-top:30px;',
        layout : 'column',
        items:[
            {
                xtype : 'textfield',
                fieldLabel: '特殊玩家机率',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 80,
                width: 180,
                id: "goodLuckProb"
            },
            {
                xtype : 'button',
                style : 'margin-top:10px;margin-left:50px',
                text:'设 置',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定修改特殊玩家机率么?", function(e) {
                        setGoodLuckProb(e);
                    });
                }
            }
        ]
    });

    var gamingMoneyAnnounceForm = new Ext.FormPanel({
        frame : true,
        title : '',
        width : 600,
        height : 150,
        style : 'margin-left:200px;margin-top:30px;',
        layout : 'column',
        items:[
            {
                xtype : 'label',
                text: '赢金币广播设置',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 600
            },
            {
                xtype : 'textfield',
                fieldLabel: '在线人数大于',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 80,
                width: 200,
                name: "online_0",
                id: "online_0"
            },
            {
                xtype : 'textfield',
                fieldLabel: '金币大于',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 200,
                name: "gamingMoneyAnnounce_0",
                id: "gamingMoneyAnnounce_0"
            },
            {
                xtype : 'textfield',
                fieldLabel: '在线人数大于',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 80,
                width: 200,
                name: "online_1",
                id: "online_1"
            },
            {
                xtype : 'textfield',
                fieldLabel: '金币大于',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 200,
                name: "gamingMoneyAnnounce_1",
                id: "gamingMoneyAnnounce_1"
            },
            {
                xtype : 'textfield',
                fieldLabel: '在线人数大于',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 80,
                width: 200,
                name: "online_2",
                id: "online_2"
            },
            {
                xtype : 'textfield',
                fieldLabel: '金币大于',
                style : 'margin-top:10px;margin-left:15px',
                labelWidth: 60,
                width: 200,
                name: "gamingMoneyAnnounce_2",
                id: "gamingMoneyAnnounce_2"
            },
            {
                xtype : 'button',
                style : 'margin-top:10px;margin-left:30px',
                text:'设 置',
                handler : function(){
                    Ext.MessageBox.confirm("提示", "您确定修改赢金币广播设置么?", function(e) {
                        setGamingMoneyAnnounce(e);
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
			/*
            robot0,
            robot1,
            robot2,
            robot3,
            pokerForm,
            goodHandForm,
            //insiderForm,
            goodLuckForm,
            badLuckGuyForm,
            gamingMoneyAnnounceForm
            */
        ]
    });
    totalPanel.render("condition");

    //loadServerData();
};

function loadServerData() {
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/robot/getClosing",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("提示", "获取服务器相关数据失败");
            } else {
                for (var i in json.ratio) {
                    var labelId = "label1_" + i;
                    var labelText = labelString[i] + json.ratio[i];
                    Ext.getCmp(labelId).setText(labelText);
                }

                for (var i in json.isClosing) {
                    var labelId = "label2_" + i;
                    var isClosing = json.isClosing[i] ? "状态: 关闭" : "状态: 开启";
                    Ext.getCmp(labelId).setText(isClosing);
                    var btnId = "button1_" + i;
                    isClosing = json.isClosing[i] ? "开 启" : "关 闭";
                    Ext.getCmp(btnId).setText(isClosing);
                }
            }
        },
        failure: function(){}
    });

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/robot/getGoodHandRatio",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            console.log(json.ratio);
            Ext.getCmp("pokerRatio").setText("大牌机率: " + json.ratio);
        },
        failure: function(){}
    });

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/robot/getBadLuckGuyProb",
        method: 'GET',
        success: function(response){
            console.log(response.responseText);
            var json = Ext.JSON.decode(response.responseText);
            console.log(json);
            for(var i in json) {
                Ext.getCmp("gamingMoney_" + i).setValue(json[i].gamingMoney);
                Ext.getCmp("badLuckProb_" + i).setValue(json[i].ratio);
            }
        },
        failure: function(){}
    });

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/robot/getProbs",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            console.log(json);
            setProbs(json);
        },
        failure: function(){}
    });

    /*Ext.Ajax.request({
        url: "http://" + window.location.host + "/robot/getInsiderProbs",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            console.log(json);
            setInsiderProbs(json);
        },
        failure: function(){}
    });*/
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/robot/getGoodLuckProb",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            //console.log(json);
            Ext.getCmp("goodLuckProb").setValue(json.prob);
        },
        failure: function(){}
    });

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/robot/getMoneyAnnounce",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            console.log(json);
            for(var i in json) {
                Ext.getCmp("gamingMoneyAnnounce_" + i).setValue(json[i].gamingMoney);
                Ext.getCmp("online_" + i).setValue(json[i].online);
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });
}

function setProbs(probs) {
    Ext.getCmp("P_AJ").setValue(probs.P_AJ);
    Ext.getCmp("P_21").setValue(probs.P_21);
    Ext.getCmp("P_20").setValue(probs.P_20);
    Ext.getCmp("P_19").setValue(probs.P_19);
    Ext.getCmp("P_18").setValue(probs.P_18);
    var fixValue = probs.P_WuXiaoLong.toFixed(3);
    Ext.getCmp("P_WuXiaoLong").setText("五小龙:   " + fixValue);
}

function setInsiderProbs(probs) {
    Ext.getCmp("insider_P_AJ").setValue(probs.P_AJ);
    Ext.getCmp("insider_P_21").setValue(probs.P_21);
    Ext.getCmp("insider_P_20").setValue(probs.P_20);
    Ext.getCmp("insider_P_19").setValue(probs.P_19);
    Ext.getCmp("insider_P_18").setValue(probs.P_18);
    var fixValue = probs.P_WuXiaoLong.toFixed(3);
    Ext.getCmp("insider_P_WuXiaoLong").setText("五小龙:   " + fixValue);
}

function setGoodHandRatio(e) {
    if (e != "yes") {
        return;
    }

    var newRatio =  Ext.getCmp("newGoodHandRatio").getValue();
    if (newRatio == "" || newRatio < 0 || newRatio > 1) {
        Ext.Msg.alert("提示", "新机率取值范围为[0,1],请修改!");
        return;
    }

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/robot/setGoodHandRatio",
        method: 'POST',
        params: {"ratio": newRatio},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 200) {
                Ext.Msg.alert("成功", "操作成功");
                var labelText = "大牌机率: " + newRatio;
                Ext.getCmp("pokerRatio").setText(labelText);
                Ext.getCmp("newGoodHandRatio").setValue("");
            } else {
                Ext.Msg.alert("错误", "操作失败");
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });

}

function setServerProbs(e) {
    if (e != "yes") {
        return;
    }

    var P_AJ =  Ext.getCmp("P_AJ").getValue();
    var P_21 =  Ext.getCmp("P_21").getValue();
    var P_20 =  Ext.getCmp("P_20").getValue();
    var P_19 =  Ext.getCmp("P_19").getValue();
    var P_18 =  Ext.getCmp("P_18").getValue();
    if (P_AJ == "" || P_21 === "" || P_20 === "" || P_19 == "" || P_18 === ""
        || (P_AJ < 0 || P_AJ > 1) || (P_21 < 0 || P_21 > 1) || (P_20 < 0 || P_20 > 1)
        || (P_19 < 0 || P_19 > 1) || (P_18 < 0 || P_18 > 1)) {
        Ext.Msg.alert("提示", "新机率取值范围为[0,1],请修改!");
        return;
    }

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/robot/setProbs",
        method: 'POST',
        params: {"P_AJ": P_AJ, "P_21": P_21, "P_20": P_20, "P_19": P_19, "P_18": P_18},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "操作失败");
            } else {
                Ext.Msg.alert("成功", "设置成功");
                setProbs(json);
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });

}

function setServerInsiderProbs(e) {
    if (e != "yes") {
        return;
    }

    var P_AJ =  Ext.getCmp("insider_P_AJ").getValue();
    var P_21 =  Ext.getCmp("insider_P_21").getValue();
    var P_20 =  Ext.getCmp("insider_P_20").getValue();
    var P_19 =  Ext.getCmp("insider_P_19").getValue();
    var P_18 =  Ext.getCmp("insider_P_18").getValue();
    if (P_AJ == "" || P_21 === "" || P_20 === "" || P_19 == "" || P_18 === ""
        || (P_AJ < 0 || P_AJ > 1) || (P_21 < 0 || P_21 > 1) || (P_20 < 0 || P_20 > 1)
        || (P_19 < 0 || P_19 > 1) || (P_18 < 0 || P_18 > 1)) {
        Ext.Msg.alert("提示", "新机率取值范围为[0,1],请修改!");
        return;
    }

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/robot/setInsiderProbs",
        method: 'POST',
        params: {"P_AJ": P_AJ, "P_21": P_21, "P_20": P_20, "P_19": P_19, "P_18": P_18},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "操作失败");
            } else {
                Ext.Msg.alert("成功", "设置成功");
                setInsiderProbs(json);
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "操作失败");
        }
    });

}

function setBadLuckProb(e) {
    if (e != "yes") {
        return;
    }

    var badLuckProb = [];
    for (var i = 0; i < 4; ++i) {
        var gamingMoney =  parseFloat(Ext.getCmp("gamingMoney_" + i).getValue());
        var ratio =  parseFloat(Ext.getCmp("badLuckProb_" + i).getValue());
        if (ratio < 0 || ratio > 1) {
            Ext.Msg.alert("提示", "倒霉蛋倒霉的机率范围为[0,1],请修改!");
            return;
        }

        if (badLuckProb.length >= 1) {
            var maxValue = badLuckProb[badLuckProb.length-1].gamingMoney;
            if (gamingMoney < maxValue) {
                Ext.Msg.alert("提示", "第" + (i+1) + "档次的金币数小于前一档次的金币数，请修改!");
                return;
            }
        }

        var prob = {"gamingMoney" : gamingMoney, "ratio" : ratio};
        badLuckProb.push(prob);
    }

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/robot/setBadLuckGuyProb",
        method: 'POST',
        params: {"prob": JSON.stringify(badLuckProb)},
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

function setGoodLuckProb(e) {
    if (e != "yes") {
        return;
    }

    var prob = parseFloat(Ext.getCmp("goodLuckProb").getValue());
    if (prob < 0 || prob > 1) {
        Ext.Msg.alert("提示", "特殊玩家的机率范围为[0,1],请修改!");
        return;
    }

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/robot/setGoodLuckProb",
        method: 'POST',
        params: {"prob": prob},
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

function setGamingMoneyAnnounce(e) {
    if (e != "yes") {
        return;
    }

    var value = [];
    for (var i = 0; i < 3; ++i) {
        var gamingMoney =  parseInt(Ext.getCmp("gamingMoneyAnnounce_" + i).getValue());
        var online =  parseInt(Ext.getCmp("online_" + i).getValue());

        if (value.length >= 1) {
            var maxValue = value[value.length-1].gamingMoney;
            var maxOnline = value[value.length-1].online;
            if (gamingMoney < maxValue) {
                Ext.Msg.alert("提示", "第" + (i+1) + "档次的金币数小于前一档次的金币数，请修改!");
                return;
            }
            if (online < maxOnline) {
                Ext.Msg.alert("提示", "第" + (i+1) + "档次的在线人数小于前一档次的在线人数，请修改!");
                return;
            }
        }

        var prob = {"gamingMoney" : gamingMoney, "online" : online};
        value.push(prob);
    }

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/robot/setMoneyAnnounce",
        method: 'POST',
        params: {"gamingMoneys": JSON.stringify(value)},
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


