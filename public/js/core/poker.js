function poker(){
     var searchForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 'auto',
        height:50,
        region: 'center',
        layout : 'column',
        items:[
            {
                xtype : 'textfield',
                style : 'margin-left:20px;margin-top:10px;',
                fieldLabel: '玩家ID',
                id: 'queryId',
                labelWidth: 40,
                width: 120
            },
            {
                xtype : 'datefield',
                style : 'margin-left:20px; margin-top:10px;',
                fieldLabel: '查询日期',
                labelWidth: 60,
                width: 220,
                name: 'startTime',
                id: 'startTime',
                format: 'Y-m-d H:i:s',
                value:Ext.Date.add(new Date(), Ext.Date.HOUR, -2),
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'datefield',
                style : 'margin-left:5px;margin-top:10px;',
                width: 160,
                name: 'endTime',
                id: 'endTime',
                format: 'Y-m-d H:i:s',
                value:new Date(),
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'textfield',
                style : 'margin-left:20px;margin-top:10px;',
                fieldLabel: '金币范围',
                id: 'gamingMoney',
                labelWidth: 60,
                width: 140,
                value: 30000
            },
            {
                xtype : 'textfield',
                style : 'margin-left:2px;margin-top:10px;',
                id: 'gamingMoney1',
                width: 80,
                value: 10000000
            },
            {
                xtype : 'button',
                style : 'margin-left:5px; margin-top:10px;',
                text:'查 询',
                handler : function(){
                    var queryId = Ext.getCmp('queryId').getValue();
                    var startTime = Ext.getCmp('startTime').getValue();
                    var endTime = Ext.getCmp('endTime').getValue();
                    var gamingMoney = Ext.getCmp('gamingMoney').getValue();
                    var gamingMoney1 = Ext.getCmp('gamingMoney1').getValue();
                    submit(queryId, startTime, endTime, gamingMoney, gamingMoney1);
                }
            }
        ]
    });

    searchForm.render('condition');
};

function submit(queryId, startTime, endTime, gamingMoney, gamingMoney1){
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/poker/getPokerResult",
        method: 'GET',
        params: {queryId : queryId, startTime : new Date(startTime).getTime(), endTime: new Date(endTime).getTime(),gamingMoney1: gamingMoney, gamingMoney2: gamingMoney1},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "没有找到相关记录");
            } else {
                drawTable(getPokerResult(queryId, json, gamingMoney, gamingMoney1));
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "没有找到相关记录");
        }
    });
};

function getPokerResult(queryId, json, gamingMoney, gamingMoney1) {
    console.log(json);
    var results = [];
    var dataFromServer = json.data;
    for (var i in dataFromServer) {
        var result = {};
        result.tableType = "初级场";
        if (dataFromServer[i].tableType === 1) {
            result.tableType = "中级场";
        } else if (dataFromServer[i].tableType === 2) {
            result.tableType = "高级场";
        } else if (dataFromServer[i].tableType === 3) {
            result.tableType = "至尊场";
        } else if (dataFromServer[i].tableType === 10) {
            result.tableType = "疯狂金花1";
        } else if (dataFromServer[i].tableType === 11) {
            result.tableType = "疯狂金花2";
        } else if (dataFromServer[i].tableType === 12) {
            result.tableType = "擂台场";
        }

        result.queryId = queryId;
        var index = 0;
        var flag = true;//false;
        for(var j in dataFromServer[i].players) {
             if (dataFromServer[i].players[j].id === json.accountId) {
                 ++index;
                 result["accountId" + index] = dataFromServer[i].players[j].id;
                 result["cards" + index] =  cardToImageUrls(dataFromServer[i].players[j].cards);
                 result["award" + index] = dataFromServer[i].players[j].award;
                 /*var award = Math.abs(dataFromServer[i].players[j].award);
                 if (award >= gamingMoney && award <= gamingMoney1) {
                     flag = true;
                 } */
             }
        }

        for(var j in dataFromServer[i].players) {
            if (dataFromServer[i].players[j].id != json.accountId) {
                ++index;
                result["accountId" + index] = dataFromServer[i].players[j].id;
                result["cards" + index] =  cardToImageUrls(dataFromServer[i].players[j].cards);
                result["award" + index] = dataFromServer[i].players[j].award;
            }
        }

        result.ts = dateFormat(dataFromServer[i].ts);
        if (flag) {
            results.push(result);
        }
    }

    return results;
}
function drawTable( dataFromServer ){
    Ext.getDom('dataRegion').innerHTML = '';
    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'ts', type: 'string'},
            {name: 'tableType', type:'string'},
            {name: 'queryId', type:'string'},
            {name: 'accountId1', type: 'string'},
            {name: 'cards1', type: 'string'},
            {name: 'award1', type: 'string'},
            {name: 'accountId2', type: 'string'},
            {name: 'cards2', type: 'string'},
            {name: 'award2', type: 'string'},
            {name: 'accountId3', type: 'string'},
            {name: 'cards3', type: 'string'},
            {name: 'award3', type: 'string'},
            {name: 'accountId4', type: 'string'},
            {name: 'cards4', type: 'string'},
            {name: 'award4', type: 'string'},
            {name: 'accountId5', type: 'string'},
            {name: 'cards5', type: 'string'},
            {name: 'award5', type: 'string'}
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
        columns: [
            {text: '时间', width: 150, dataIndex: 'ts'},
            {text: '牌桌类型', width: 100, dataIndex: 'tableType'},
            {text: '玩家对象ID', width: 200, dataIndex: 'accountId1'},
            {text: '牌', width: 150,  dataIndex: 'cards1'},
            {text: '输赢金币', width: 90,  dataIndex: 'award1'},
            {text: '玩家对象ID', width: 200, dataIndex: 'accountId2'},
            {text: '牌', width: 150,  dataIndex: 'cards2'},
            {text: '输赢金币', width: 90,  dataIndex: 'award2'},
            {text: '玩家对象ID', width: 200, dataIndex: 'accountId3'},
            {text: '牌', width: 150,  dataIndex: 'cards3'},
            {text: '输赢金币', width: 90,  dataIndex: 'award3'},
            {text: '玩家对象ID', width: 200, dataIndex: 'accountId4'},
            {text: '牌', width: 150,  dataIndex: 'cards4'},
            {text: '输赢金币', width: 90,  dataIndex: 'award4'},
            {text: '玩家对象ID', width: 200, dataIndex: 'accountId5'},
            {text: '牌', width: 150,  dataIndex: 'cards5'},
            {text: '输赢金币', width: 90,  dataIndex: 'award5'}
        ],
        width: 'auto',
        autoScroll : true,
        height: 700
    });

    logList.render('dataRegion');
}

function cardToImageUrls(cardString) {
    var cards = cardString.split(" ");
    return cards.map(function (card, index, context) {
        if (card === '') {
            return '';
        }
        var imageName =  "poker_" + card[1].toLowerCase() + card[0].replace('A', '1').replace('T', '10').replace('J', '11').replace('Q', '12').replace('K', 13) + ".JPG";
        return "<img width='44px' height='61px' src='/img/pokers/" + imageName + "'>";
    });
}





